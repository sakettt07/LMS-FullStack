import mongoose from "mongoose";
import "colors"
export const connectDB=async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
          dbName: process.env.DB_NAME,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`.bgGreen.black);
      } catch (error) {
        console.log(`MongoDB connection error: ${error.message}`.bgRed.white);
        process.exit(1);
      }
}