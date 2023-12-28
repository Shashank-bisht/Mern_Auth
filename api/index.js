import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
dotenv.config()
const app = express();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connecte+d")
}).catch((err)=>{
console.log(err)
})

app.use('/api/user',userRoutes)

app.listen(8080,()=>{
    console.log("listen")
})

