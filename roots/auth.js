const router = require("express").Router();
const User =require("../models/User.js")
const bycrypt = require("bcrypt")
//register

router.post("/register",async(req,res)=>{
    
    try {
        const salt =  await bycrypt.genSalt(10)
        const hashePsword = await bycrypt.hash(req.body.password,salt)

        const newUser = new User({
            userName:req.body.username,
            email:req.body.emial,
            password:hashePsword
        });


        const user = await newUser.save();
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
    }


})


//login
router.post("/login", async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        !user && res.status(404).send("user is not founed")
        const validPassword = await bycrypt.compare(req.body.password,user.password)
        !validPassword && res.status(400).json("the password is not corect")
        
        res.status(200).json(user)
    }catch(error){
        console.log(error)
    }

})

module.exports = router
