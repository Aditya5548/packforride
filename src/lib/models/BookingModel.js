import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    name:{type:String,required:true},
    age:{type:String,required:true},
    gender:{type:String,required:true},
    phoneno:{type:String,required:true},
    email:{type:String,required:true},
    tourid:{type:String,required:true},
    tourname:{type:String,required:true},
    tourstartdate:{type:String,required:true},
    tourenddate:{type:String,required:true},
    boardingtime:{type:String,required:true},
    pickupaddress:{type:String,required:true},
    vehicletype:{type:String,required:true},
    noofPeople:{type:String,required:true},
    paymenttype:{type:String,required:true},
    remainingamount:{type:Number,required:true},
    userid:{type:String,required:true},
    status:{type:String,required:true},
    facilities:{type: Object},
    tourslotid:{type:String,required:true}
},
{ timestamps : true}
)
const BookingModel =mongoose.models.bookedTourdata || mongoose.model('bookedTourdata',schema);
export default BookingModel;