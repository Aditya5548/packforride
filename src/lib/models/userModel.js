import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    name:{type:String,required:true},
    dob:{type:String,required:true},
    gender:{type:String,required:true},
    phoneno:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
},
{ timestamps : true}
)
const userModel =mongoose.models.usersReg || mongoose.model('usersReg',schema);
export default userModel;