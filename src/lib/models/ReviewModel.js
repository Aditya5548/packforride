import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    username:{type:String, required:true},
    rating:{type:String},
    comment:{type:String},
    date:{type:String},
    tourid:{type:String},
})
const ReviewModel =mongoose.models.commentedUser || mongoose.model('commentedUser',Schema)
export default ReviewModel;