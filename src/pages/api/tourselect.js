import { connectDB } from '../../lib/config/db';
import TourlistModel from '../../lib/models/TourlistModel'
export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'GET') {
        try {
            const _id = req.query.id
            if (_id) {
                const tour = await TourlistModel.find({ _id })
                return res.status(200).json(tour);
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
                const response = await ReviewModel.create(req.body);
                return res.status(200).json({ msg: "Review Added" });
            }

        }
        catch (error) {
            return res.status(200).json({ msg: "Error ocuured" });
        }
    }
}
