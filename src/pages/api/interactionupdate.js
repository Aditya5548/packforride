import { connectDB } from '../../lib/config/db';
import TourlistModel from '../../lib/models/TourlistModel';
export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'PATCH') {
        try {
            if (req.body.actiontype = "views") {
                const _id = req.body.tourid;
                const updated = await TourlistModel.findByIdAndUpdate(
                    _id,
                    { $inc: { "interactions.0.views": 1 } },
                    { new: true }
                );
                return res.status(200).json({ status: true });
            }

        } catch (error) {
            return res.status(500).json({ status: false });
        }

    }

}
