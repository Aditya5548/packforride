import { connectDB } from '../../lib/config/db';
import BookingModel from '../../lib/models/BookingModel';
export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'GET') {
        try {
            if(req.query.fetchtype === "user"){
            const {userid} = req.query
            const BookedTours = await BookingModel.find({userid:userid}).sort({ _id: -1 });
            return res.status(200).json(BookedTours);
            }
            if(req.query.fetchtype === "admin"){
            const BookedTours = await BookingModel.find().sort({ _id: -1 });
            return res.status(200).json(BookedTours);
            }
        }
        catch (error) {
            return res.status(200).json({ msg: "no data Found" });
        }
    }
    if (req.method === 'POST') {

        if (req.body.email) {
        
            const data = {
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
                phoneno: req.body.phoneno,
                email: req.body.email,
                tourid: req.body.tourid,
                tourname: req.body.tourname,
                tourstartdate: req.body.tourstartdate,
                tourenddate: req.body.tourenddate,
                boardingtime: req.body.boardingtime,
                pickupaddress: req.body.pickupaddress,
                vehicletype: req.body.vehicletype,
                noofPeople: req.body.passenger,
                paymenttype: req.body.paymenttype,
                remainingamount: req.body.remainingamount,
                userid:req.body.userid,
                status: "pending",
                facilities:req.body.facilities,
                tourslotid:req.body.slotid

            }
            await BookingModel.create(data);
            return res.status(200).json({ success: true, msg: "Tour Booked Successfully.." });
        }
        else {
            return res.status(200).json({ success: false, msg: "Please Enter Email" });
        }
    }
    if (req.method ==='PATCH') {
        try {
            const updatetour=await BookingModel.findByIdAndUpdate(req.body.id, { status: req.body.status });
            return res.status(200).json({ status: 'success', msg: "status updated" });
        } catch (error) {
            return res.status(200).json({ status: 'failed', msg: "error Occurred" });
        }

    }
}
