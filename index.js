const express =require("express");
const mongoose = require("mongoose")
const dotenv=require("dotenv")
const helmet=require("helmet")
const morgan = require("morgan")
const app = express()
const userRoute = require("./roots/users.js")
const authRouter = require("./roots/auth.js")
const postRouter = require("./roots/posts.js")
dotenv.config()
const connectToMongo = async () => {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  };
  
  app.use(express.json())
  app.use(helmet())
  app.use(morgan("common"))
  connectToMongo();
  app.use("/api/users",userRoute)
  app.use("/api/auth",authRouter)
  app.use("/api/post",postRouter)
app.listen(3001,()=>{
    console.log("the app is connected ")
})