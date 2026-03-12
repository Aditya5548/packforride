import mongoose from 'mongoose';
const Schema = new mongoose.Schema({
    email:{type:String, required:true},
    time:{type:String},
    date:{type:String}
})
const EmailModel =mongoose.models.Subscriptions || mongoose.model('Subscriptions',Schema)
export default EmailModel;