import mongoose from "mongoose";

const DB_Connect = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/authRawTesting`);
        console.log("Connected to MongoDb on port: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Connection Failed", error);
        process.exit(1)
    }
};

export default DB_Connect;