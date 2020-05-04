//包含n个操作多个集合数据的模块
const mogoose = require('mongoose');
mogoose.connect('mongodb://localhost:27017/zhaoping2')

const conn = mogoose.connection;

conn.on('connected', ()=> {
    console.log('sucess')

})

const userSchema = mogoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型 : dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String} // 工资
})

const UserModel = mogoose.model('user',userSchema)

exports.UserModel = UserModel

// 定义 chats 集合的文档结构
const chatSchema = mogoose.Schema(
    { from: {type: String, required: true},
// 发送用户的 id
        to: {type: String, required: true},
// 接收用户的 id
        chat_id: {type: String, required: true},
// from 和 to 组成的字符串
        content: {type: String, required: true}, // 内容
        read: {type:Boolean, default: false}, // 标识是否已读
        create_time: {type: Number} // 创建时间
        })// 定义能操作 chats 集合数据的 Model
const ChatModel = mogoose.model('chat', chatSchema)
// 向外暴露
exports.ChatModel = ChatModel
