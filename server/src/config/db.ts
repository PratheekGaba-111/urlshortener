import mongoose from "mongoose";

export const connectDB = async() : Promise<void> => {
    try{
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Mongoose connected");
    }
    catch(error){
        console.log("Mongoose not connected");
        console.log(error);
        process.exit(1);
    }
};
