import { connectDB } from '../../lib/config/db';
import ReviewModel from '../../lib/models/ReviewModel'
export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'GET') {
        try {
            const tourid = req.query.tourid
            if (tourid) {
                const Reviewlist = await ReviewModel.find({ tourid }).sort({ _id: -1 });
                return res.status(200).json(Reviewlist);
            }
            else {
                return res.status(200).json({ msg: "TourId missing" });
            }
        }
        catch (error) {
            return res.status(200).json({ msg: "no data Found" });
        }
    }
    if (req.method === 'POST') {
        try {
            if (req.body) {
                const tourid=req.body.tourid
                await ReviewModel.create(req.body);
                const Reviewlist = await ReviewModel.find({ tourid }).sort({ _id: -1 });
                return res.status(200).json({ msg: "Review Added", review:Reviewlist});
            }

        }
        catch (error) {
            return res.status(200).json({ msg: error });
        }
    }
}
