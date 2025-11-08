import mongoose from "mongoose";
export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://yadityakumar205:9621882868@cluster0.ir5ehzu.mongodb.net/Travelling')
    console.log("DB Connected.....")
}