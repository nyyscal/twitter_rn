import cors from "cors"
import express from "express"
import {clerkMiddleware} from "@clerk/express"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import notificationRoutes from "./routes/notifications.route.js"

import { ENV } from "./config/env.js"
import { connectDB } from "./config/db.js"
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js"

const app = express()

app.use(cors({
  origin: "*", // Allow all origins for development
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  credentials: true
}))

// Increase payload limits for file uploads
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(express.json())

app.use(clerkMiddleware())
//not calling using () because express automatically calls it if finds bot
app.use(arcjetMiddleware)

app.get("/",(req,res)=>res.send("Hello from the server!"))

app.use("/api/users",userRoutes)
app.use("/api/posts",postRoutes)
app.use("/api/comments",commentRoutes)
app.use("/api/notifications",notificationRoutes)

//error handling middleware
app.use((err,req,res,next)=>{
  console.error("Unhandled error:",err)
  res.status(500).json({error:err.message|| "Internal Server Error"})
})

const startServer = async()=>{
  try {
    await connectDB();
    if(ENV.NODE_ENV !== "production"){
       app.listen(ENV.PORT,()=>console.log("Server is up and running on PORT:",ENV.PORT))
    }
  } catch (error) {
    console.error("Failed to start the server:",error.message)
    process.exit(1)
  }
 }

 startServer()


 //export for vercel
 export default app