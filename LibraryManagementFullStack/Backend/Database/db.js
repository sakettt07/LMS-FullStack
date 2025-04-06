import mongoose from "mongoose";
export const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"LMS_FullStack"
    }).then(()=>{
        console.log("Conected to database");
    }).catch(err=>{
        console.log(`Some error occured while connecting to the DB:${err}`)
    })
}