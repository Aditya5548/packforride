import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tourname:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:String,required:true},
    city:{type:String,required:true},
    tourhostid:{type:String,required:true},
    services:{type: Object},
    interactions:{type: Object},
    bookingcount:{type:Number},
    status:{type:String,required:true},
    lonlat:{type:Array,required:true},
},
{ timestamps : true} 

)
const TourlistModel =mongoose.models.peoplestourlist || mongoose.model('peoplestourlist',schema);
export default TourlistModel;