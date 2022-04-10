const express= require('express')
const router= express.Router()
const UserSchema= require('../models/userSchema')




// create user
router.post('/',async(req,res)=>{
    try{
        // console.log(req.body)
        const {name,email,image}=req.body
        // console.log(name,email)
        const find=await UserSchema.findOne({email})
        if(find){
            return res.status(200)
        }
        const newUser=new UserSchema({name,email,image})
        newUser.save()
        res.status(201).send({msg:"Account Created."})
    }catch(err){

    }
})
// sreach the user
router.get('/api',async(req,res)=>{
    try{
    // console.log('hi')
    const keyword=req.query.search?{
        $or:[
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}}
        ]
    }:{};
    // console.log(keyword,req.user)
    const user= await UserSchema.find(keyword)
    res.send(user)
  }catch(err){
      console.log(err)
  }
})

// get a single user
router.get("/:email",async(req,res)=>{
    try{
        const email= req.params.email
        const getUser= await UserSchema.findOne({email:email})
        // console.log(getUser,email)
        res.status(201).send(getUser)

    }catch(err){

    }
})
// update user data
router.put('/:id',async(req,res)=>{
    try {
        const id= req.params.id
        // console.log(req.body,id)
        const update= await UserSchema.findByIdAndUpdate(id,{
            image:req.body.image
        })
        res.status(200).send(update)

    } catch (error) {
        
    }
})

module.exports= router