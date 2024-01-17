const router = require("express").Router()
const { json } = require("express")
const Post = require("../models/Posts.js")

// create post 
router.post("/", async(req,res)=>{
    const newPost = new Post(req.body)
    try {
        const savePost = await newPost.save()
        res.status(200).json(savePost)
    } catch (error) {
        res.status(500).json(error)
    }

})
// update post
router.put("/:id", async(req,res)=>{
    try{
        const post  = await Post.findById(req.params.id)
        if(post.userId ===req.body.userId){
            await post.updateOne({$set:req.body})
            res.status(200).json("the post has been updated")
    
        }else{
            res.status(403),json("you can update only your post")
        }
    }
        catch(error){
            res.status(403).json(error)
        }

})

// delete posts
router.delete("/:id", async(req,res)=>{
    try{
        const post  = await Post.findById(req.params.id)
        if(post.userId ===req.body.userId){
            await post.deleteOne()
            res.status(200).json("the post has been deleted")
    
        }else{
            res.status(403),json("you can delete only your post")
        }
    }
        catch(error){
            res.status(403).json(error)
        }

})
// like/dislike posts
router.put("/:id/like", async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("post has ben liked")
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("post has ben disliked")
        }

    }catch(error){
        res.status(500).json(error)
    }
   

})
// get posts
router.get("/:id",async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(error){
        res.status(500).json(error)
    }
 
})
// get timline posts
router.get("/timeline/all",async(req,res)=>{
    let postArry = [];
    try{
        const curenentUser = await User.findById(req.body.userId)
        const userPost =await Post.find({userId:curenentUser._id})
        const friendPost = await Promise.all(
            curenentUser.followings.map(friendId=>{
                return Post.find({userId:friendId})
            })
        )
        res.json(userPost.concat(...friendPost))

    }catch(error){
        res.status(500).json(error)
    }
})

module.exports = router