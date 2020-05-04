//测试使用moogoose 操作mongodb
//1.1连接db
//1.1 引用mogoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')//加密函数
//连接数据库
mongoose.connect('mongodb://localhost:27017/zhaopingtest')
//获取连接对象
const conn = mongoose.connection
//bind listener
conn.on('connected',function(){
    console.log("sucess")
})
// 2.得到特定集合的model
//2.1 字义Schema（文档结构， 对象，user）
//2.2 定义model（数组，users）

const userSchema = mongoose.Schema({
    username:{type:String, required:true},
    password:{type:String, required:true},
    type: {type:String, required:true},
    header:{type:String}
})

const UserModel = mongoose.model('user',userSchema)//users
function testSave(){
    //
  const userModel =  new UserModel({username: 'fanan',password: md5('123'),type:'employee'})
    userModel.save(function(error,userdoc){
        console.log('save()',error,userdoc)
    })
}


function testfind(){
    //

    UserModel.find(function(error,userdoc){
        console.log('find()',error,userdoc)
    })
}
function testupdate(){
    //

    UserModel.findByIdAndUpdate({_id:'5e54795c1007a460705272a8'} ,{username:'keke'},function (error,user) {
        console.log('update()', error, user)

    })
}
testSave()
testfind()
testupdate()
function testdelete(){
    //

    UserModel.deleteOne({_id:'5e547acad91e5a67cc4c31f7'} ,function (error,result) {
        console.log('delete()', error, result)

    })
}
testdelete()
