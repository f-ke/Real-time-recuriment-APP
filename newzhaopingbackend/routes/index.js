var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
// //注册一个路由：用户注册
// router.post('/register', function(req,res) {
//   //获取请求参数
//   const {username, password} = req.body
//   console.log('register')
//   //处理
//   if(username == 'admin'){
//     res.send({code:1, msg:'此用户已存在'})
//     //注册失败， admin已经有了
//   }else{ //sucess
//     res.send({code:0,data:{id:'abc123',username, passjword}})
//
//   }
//
//     }
// )
const {UserModel,ChatModel} = require('../db/models')
const md5 = require('blueimp-md5')
const filter = {password:0}//指定过滤属性
router.post('/register',function(req, res) {
  //read parameter
  const {username, password, type} = req.body
  //deal
  UserModel.findOne({username}, function (error, user) {
        // if user is not none
        if (user) {
          //determine whether user is registered
          //if true ,error(username)

          res.send({code: 1, msg: 'this user has registered'})
        } else {//else, save
          new UserModel({username, password: md5(password), type}).save(function (error, user) {
            //返回包含user的json

            const data = {username, type, _id: user._id}
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})//maintain login one day, unit:ms
            res.send({code: 0, data})

          })



        }


      }
  )
}
)
//login router
router.post('/login', function(req, res){
  const{username, password} = req.body
  UserModel.findOne({username, password:md5(password)}, filter, function(err, user){
    if(user){
      res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})//maintain login one day, unit:ms
      res.send({code:0,data:user})

    }else{
      res.send({code:1, msg:'incorrect username or password'})
    }

  })


})
router.post('/update', function(req, res){
  //cookie give userid
  const userid = req.cookies.userid
  if(!userid){
   return  res.send({code:1,msg:'please log in at first'})
  }
  const user = req.body // no id
  UserModel.findByIdAndUpdate({_id:userid},user,function(error,oldUser){
    if(!oldUser){
      res.clearCookie('userid')
      res.send({code:1,msg:'please log in at first'})
      //同志浏览器删除userid cookie
    }else{
      const {_id, username,type}=oldUser
      const data = Object.assign({_id, username, type},user)
      res.send({code:0,data})

      //返回提示
    }
  })

})
router.get('/user',function(req, res){
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code:1, msg:"please login"})
  }
  UserModel.findOne({_id: userid},filter, function(error,user){
     res.send({code:0, data:user})
  });

})
router.get('/userlist',function(req,res){
  const {type} = req.query
  UserModel.find({type},filter,function(error,users){
    res.send({code:0,data:users});
  })
})
router.get('/msglist',function(req,res){
  const userid = req.cookies.userid
  UserModel.find(function(error,userDocs){
    //container
   const users =  userDocs.reduce((users,user)=>{
      users[user._id] = {username:user.username,header:user.header}
      return users
    } ,{})

    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function (error,chartMsgs) {
      res.send({code:0,data:{users,chartMsgs}})

    })

  })
})
router.post('/readmsg',function(req,res){
  const from = req.body.from;
  const to = req.cookies.userid;
  ChatModel.update({from, to, read:false}, {read:true}, {multi:true} ,function(err,doc){
    console.log('/readmsg',doc);
    res.send({code:0, data:doc.nModified})//number of update
  })
})
module.exports = router;

