import mongoose from "mongoose";
import { DB_NAME } from "../constants";
import dotenv from "dotenv"
dotenv.config()


const mongo_uri = process.env.MONGODB_URI




const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${mongo_uri}/${DB_NAME}`)
        console.log(`MONGODB Connected!!! to ${connectionInstance.connection.host}`);
    } catch (error:any) {
        console.log('Error while connecting db',error);   
    }
}

export default connectDb