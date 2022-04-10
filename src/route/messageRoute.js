const express= require('express')
const router= express.Router()
const MessageSchema=require('../models/messageSchema')
const ChatSchema= require('../models/chatSchema')
const UserSchema= require('../models/userSchema')
// create message 
router.post("/",async(req,res)=>{
    const {content,chatId,sender}= req.body
    // console.log(sender)
        if(!content||!chatId||!sender){
            return res.status(400)
        }
        var newMessage={
            sender:sender,
            content:content,
            chat:chatId
        }

  try {
      var message=await MessageSchema.create(newMessage)

      message= await message.populate('sender',"name image")
      message=await message.populate("chat")
      message=await UserSchema.populate(message,{
          path:'chat,users',
          select:"name image email"
      })
      await ChatSchema.findByIdAndUpdate(chatId,{
          latestMessage:message 
      })

      res.send(message) 
    } catch (error) {
        console.log(error)
    }
 
})
// get all message 
router.get("/:chatid",async(req,res)=>{
    try {
        const messages=await MessageSchema.find({chat:req.params.chatid}).populate('sender',"name image email")
        .populate("chat");
        res.send(messages) 
    } catch (error) {
        console.log(error)
    }
})
module.exports= router