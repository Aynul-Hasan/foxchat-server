const express= require('express')
const router= express.Router()
const ChatSchema= require('../models/chatSchema')
const UserSchema= require('../models/userSchema')

// create chat
router.post('/',async(req,res)=>{
    const {userId,logUserId}=req.body
    // console.log(userId,logUserId)
    if(!userId){
        console.log(`user id not found`)
        return res.status(400)
    }
    // req.user._id
    // console.log(req.user._id)
    var isChat=  await ChatSchema.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:logUserId}}},
            {users:{$elemMatch:{$eq:userId}}}
        ]
    }).populate("users").populate("latestMessage");
    isChat= await UserSchema.populate(isChat,{
        path:"latestMessage.sender",
        select:"name email image"
    },)
    if(isChat.length>0){
        res.send(isChat[0]) 
    }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[logUserId,userId]
        }
        try{
        const createdChat= await ChatSchema.create(chatData)
        const fullChat=await ChatSchema.findOne({_id:createdChat._id}).populate("users")
        res.status(200).send(fullChat)
        }catch(err){
            throw new Error(err.message)
        }
    }
})

// get all particular user chats
router.get('/:id',async(req,res)=>{
    try{ 
        // console.log(`hi`)
        const {id}=req.params
        var allChats= await ChatSchema.find({users:{$elemMatch:{$eq:id}}})
        .populate("users").populate("groupAdmin").populate("latestMessage")
        .sort({updatedAt:-1});
        
         allChats=await UserSchema.populate(allChats,{
            path:"latestMessage.sender",
            select:"name email image"
        })
        // console.log(allChats)
        res.status(200).send(allChats)
    }catch(err){

    }
})

// create group chat
router.post('/group/:id',async(req,res)=>{
    // console.log(req.body.users,req.body.name)
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"Please Fill the all the feilds"})
    }
    var users= JSON.parse(req.body.users)
    if(users.length<2){
        return res.status(400).send({message:"More then 2 users are requered to from a group chat"})
    }
    users.push(req.params.id)
    try{
        const groupChat= await ChatSchema.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.params.id
        })
        const fullGroupChat=await ChatSchema.findOne({_id:groupChat._id})
        .populate("users").populate("groupAdmin")
        res.status(200).json(fullGroupChat)
    }catch(err){

    }
})
// rename group chat
router.put("/rename",async(req,res)=>{
    const {chatId,chatName}=req.body
    // const {id}=req.params
    const updatedChatName=await ChatSchema.findByIdAndUpdate(
        chatId,{chatName},{new:true}
    ).populate("users").populate("groupAdmin")
    if(!updatedChatName){
        res.status(404)
        throw new Error("chat Not found")
    }else{
        res.json(updatedChatName)
    }
})
// remove from group 
router.put("/removemember",async(req,res)=>{
    const{groupId,removememberId}=req.body
    const removeNewMember=await ChatSchema.findByIdAndUpdate(groupId,{
        $pull:{users:removememberId}
    },{new:true}).populate("users").populate("groupAdmin")
    // console.log(`hi`)
    if(!removeNewMember){
        throw new Error("chat Not found")
    }else{
        res.status(200).send(removeNewMember)
    }
})


// add to group 
router.put("/addmember",async(req,res)=>{
    const{groupId,newmemberId}=req.body
    const addNewMember=await ChatSchema.findByIdAndUpdate(groupId,{
        $push:{users:newmemberId}
    },{new:true}).populate("users").populate("groupAdmin")
    if(!addNewMember){
        throw new Error("chat Not found")
    }else{
        res.json(addNewMember)
    }
})



module.exports= router