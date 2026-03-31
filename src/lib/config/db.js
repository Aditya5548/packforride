import mongoose from "mongoose";
import dns from 'dns';
dns.setServers(["1.1.1.1","8.8.8.8"])
export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://yadityakumar205:9621882868@cluster0.ir5ehzu.mongodb.net/Travelling')
    console.log(mongoose.Connection.host)
}