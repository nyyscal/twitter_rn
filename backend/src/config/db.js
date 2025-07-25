import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async() =>{
  try {
    await mongoose.connect(ENV.MONGO_URI)
    console.log("Connected to MONGO DB succesfully!✅")
  } catch (error) {
    console.log("Error connecting to MONGO DB:", error.message)
    process.exit(1)
  }
}