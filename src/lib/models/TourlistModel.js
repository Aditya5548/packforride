import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    tourname:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    image:{type:String,required:true},
    transport:{type:String,required:true},
    room:{type:String,required:true},
    fooding:{type:String,required:true},
    location:{type:String,required:true},
    tourhostname:{type:String,required:true},
    tourhostid:{type:String,required:true}
},
{ timestamps : true}

)
const TourlistModel =mongoose.models.Placesdata || mongoose.model('Placesdata',schema);
export default TourlistModel;