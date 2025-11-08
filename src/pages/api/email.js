import { connectDB } from '../../lib/config/db';
import EmailModel from '../../lib/models/EmailModel';
import jwt from 'jsonwebtoken';
export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'GET') {
        try {
            const decoded = jwt.verify(req.query.token, process.env.NEXT_PUBLIC_API_URL)
            if (decoded.id === process.env.NEXT_PUBLIC_SECRET_KEY) {
                const SubscribeEmail = await EmailModel.find({}).sort({ _id: -1 });
                return res.status(200).json(SubscribeEmail);
            } else {
                return res.status(200).json({ msg: "Unauthorised API Access" });
            }
        }
        catch (error) {
            return res.status(200).json({ msg: "Unauthorised API Access" });
        }
    }
    if (req.method === 'POST') {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString(); // e.g., "3:45:12 PM"
        const email_id = req.body.email
        if (email_id) {
            var emailData = { email: email_id, date: date, time: time }
            await EmailModel.create(emailData);
            return res.status(200).json({ success: true, msg: "Email Subscribed" });
        }
        else {
            return res.status(200).json({ success: false, msg: "Please Enter Email" });
        }
    }
    if (req.method === 'DELETE') {
        try {
            jwt.verify(req.query.token, process.env.NEXT_PUBLIC_API_URL)
            const _id = await req.query.id;
            await EmailModel.findByIdAndDelete(_id);
            return res.status(200).json({ msg: "Subscription Removed" });
        } catch (error) {
            return res.status(200).json({ status: 'failed', msg: "Invaild Login Credential" });
        }

    }
}
