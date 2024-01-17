const router = require("express").Router();
const User = require("../models/User")
const bycrypt = require("bcrypt")

//ubdate
router.put("/:id",async(req,res)=>{
if(req.body.userId === req.params.id  || req.body.isAdmin ){
if(req.body.password ){
try{
    const salt = await bycrypt.genSalt(10)
    req.body.password=await bycrypt.hash(req.body.password,salt);
}catch(error){
    return res.status(500).json(error)
}}
try {
    const ser = await User.findByIdAndUpdate(req.params.id,{
        $set:req.body,
    })
    res.status(200).json("Account has been updated")
} catch (error) {
    return res.status(500).json(error)
}


}
else{
    return res.status(403).json("you can update only your account")
}
})
// delate User
router.delete("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id  || req.body.isAdmin ){
    try {
        const ser = await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Account has been deleted")
    } catch (error) {
        return res.status(500).json(error)
    }
    
    
    }
    else{
        return res.status(403).json("you can update only your account")
    }
    })
// get User
router.get("/:id", async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other}=user._doc
        res.status(200).json(other)
        
    } catch (error) {
        res.status(500).json(error)
        
    }

})
// follow a user
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !==req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const current = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await current.updateOne({$push:{followings:req.params.id}})
                res.status(200).json("user has been followed")

            }else{
                res.status(403).json("you allready follow this user")
            }
        } catch (error) {
            res.status(500).json(error)
            
        }

    }
    else{
        res.status(403).json("you can not follow your self")
    }

})
// unfollow a user
router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !==req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const current = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await current.updateOne({$pull:{followings:req.params.id}})
                res.status(200).json("user has been unfollowed")

            }else{
                res.status(403).json("you allready unfollow this user")
            }
        } catch (error) {
            res.status(500).json(error)
            
        }

    }
    else{
        res.status(403).json("you can not unfollow your self")
    }

})
module.exports = router
