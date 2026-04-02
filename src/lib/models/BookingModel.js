import mongoose from 'mongoose';
import { StringDecoder } from 'node:string_decoder';
const schema = new mongoose.Schema({
    name:{type:String,required:true},
    age:{type:String,required:true},
    gender:{type:String,required:true},
    phoneno:{type:String,required:true},
    email:{type:String,required:true},
    tourid:{type:String,required:true},
    tourname:{type:String,required:true},
    pickupaddress:{type:String,required:true},
    locationid:{type:Array,required:true},
    noofPeople:{type:String,required:true},
    totalamount:{type:String,required:true},
    userid:{type:String,required:true},
    status:{type:String,required:true},
    facilities:{type: Object},
    distance:{type:String,required:true},
    messages:{type:String},
    vehicletype:{type:String},
    vehiclenumber:{type:String},
    startdate: { type: Date},
    days: {type: String},
    boardingtime: {type: String},
},
{ timestamps : true}
)
const BookingModel =mongoose.models.listofbooking || mongoose.model('listofbooking',schema);
export default BookingModel;