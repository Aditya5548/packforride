import mongoose from "mongoose";

// import dns from 'dns';
// dns.setServers(['8.8.8.8','1.1.1.1'])
// dns.lookup("google.com", (err, address, family) => {
//   if (err) {
//     console.error("❌ Error occurred:");
//     console.error("Message:", err.message);
//     console.error("Code:", err.code);
//     console.error("Stack:", err.stack);
//     return;
//   }
//   console.log("✅ Address:", address);
//   console.log("IP Version (IPv4/IPv6):", family);
// });


export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://yadityakumar205:9621882868@cluster0.ir5ehzu.mongodb.net/Travelling')
    console.log(mongoose.Connection.host)
}