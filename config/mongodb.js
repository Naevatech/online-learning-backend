import mongoose from "mongoose";
import 'dotenv/config';
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

console.log("Connecting to:", process.env.MONGODB_URL);
const connectDB = async () => {
    mongoose.connection.on("connected", ()=>console.log("Database Connected"));
    if (!process.env.MONGODB_URL) {
        console.warn("MONGODB_URL is not set. Skipping database connection.");
        return;
    }

    await mongoose.connect(`${process.env.MONGODB_URL}/frontend`)
    // await mongoose.connect("mongodb://localhost:27017/frontend")

}

export default connectDB;