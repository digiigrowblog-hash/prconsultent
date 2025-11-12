import mongoose from "mongoose";
export  async function Db () {
   try {
     await mongoose.connect(process.env.MONGO_URI!);
     const connection =mongoose.connection;
     connection.on("connected",()=>{
        console.log("Mongodb is connected sussessfully");

     });
     connection.on("error",(err)=>{
        console.log("MongoDB is connection error pls check your db is running" + err);
        process.exit();
     })
    
   } catch (error) {
     console.log("error in connection mongodb");
     console.log(error);
   }
};