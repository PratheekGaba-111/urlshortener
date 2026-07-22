import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import {connectDB} from "./config/db";


const port = process.env.PORT || 5000;
const startServer = async() => {
    try{
        await connectDB();
        app.listen(port, () => {
            console.log(`Server started at port ${port}`);
        });
    }
    catch(error){
        console.error("Failed to start at port : " + port);
        process.exit(1);
    }
}
startServer();

