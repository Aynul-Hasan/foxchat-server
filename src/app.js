const express= require('express')
const app= express()
require('dotenv').config()
const cors= require('cors')
const port = process.env.PORT || 8000
require('./db/databasecon.js')

const userRouter= require('./route/userRoute')
const chatRouter= require('./route/chatRoute')
const messageRouter= require('./route/messageRoute')


// middleware 
app.use(express.json())
app.use(cors())
// router
app.use("/user",userRouter)
app.use("/chat",chatRouter)
app.use("/message",messageRouter)

const server =app.listen(port, ()=>{
    console.log(`server is running at ${port}`)
})
const io= require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log('connected socket.oi')
    socket.on('setup',(userId)=>{
        socket.join(userId)
        // console.log(userId)
        socket.emit('connected')
    })
    socket.on("join chat",(room)=>{
        console.log(`user join room ${room}`)
        socket.join(room)
 
    })
    socket.on("typeing",(room)=>{socket.in(room).emit("typeing")})
    socket.on("stop typeing",(room)=>{socket.in(room).emit("stop typeing")})

    socket.on('new message',(newMessageRecieved)=>{
        // console.log(newMessageRecieved)
        var chat =newMessageRecieved.chat;

        if(!chat.users){return console.log(`chat.user not fount`)}
        chat.users.forEach(user=>{ 
            
            if(user == newMessageRecieved.sender._id)return; 
            socket.in(user).emit('message recieved',newMessageRecieved);
            // console.log(newMessageRecieved.sender._id,user)
            
        });
    })
    socket.off("setup",(userId)=>{
        console.log(userId)
        socket.leave(userId)
    })
})
