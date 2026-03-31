import mongoose from 'mongoose';
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
    facilities:{type: Object}
},
{ timestamps : true}
)
const BookingModel =mongoose.models.bookingpaneldata|| mongoose.model('bookingpaneldata',schema);
export default BookingModel;