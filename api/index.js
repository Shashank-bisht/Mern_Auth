import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import authRoutes from './routes/auth.route.js'

dotenv.config()
const app = express();

// parsing json data
app.use(express.json());

// connect to db
mongoose.connect(process.env.MONGO,{
   useUnifiedTopology: true
}).then(()=>{
    console.log("connected")
}).catch((err)=>{
console.log(err)
})

// using middleware
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)

app.listen(8080,()=>{
    console.log("listen")
})

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
})