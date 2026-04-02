import { distance } from 'framer-motion';
import { connectDB } from '../../lib/config/db';
import BookingModel from '../../lib/models/BookingModel';
import TourlistModel from '../../lib/models/TourlistModel';
export default async function handler(req, res) {
    await connectDB();
    if (req.method === 'GET') {
        try {
            if (req.query.fetchtype === "user") {
                const { userid } = req.query
                const BookedTours = await BookingModel.find({ userid: userid }).sort({ _id: -1 });
                return res.status(200).json(BookedTours);
            }
            if (req.query.fetchtype === "admin") {
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
                pickupaddress: req.body.pickupaddress,
                locationid: req.body.locationid,
                vehicletype: req.body.vehicletype,
                noofPeople: req.body.passenger,
                distance: req.body.distance,
                totalamount: req.body.totalamount,
                userid: req.body.userid,
                boardingtime: req.body.boardingtime,
                vehicletype: req.body.vehicleType,
                vehiclenumber: req.body.vehicleNumber,
                vehicletype: "",
                vehiclenumber: "",
                startdate: "",
                days: "",
                boardingtime: "",
                status: "pending",
                messages: "⏳ Your booking is under review. Please wait for confirmation.",
                facilities: req.body.facilities
            }
            await BookingModel.create(data);
            const _id=req.body.tourid;
            const updated = await TourlistModel.findByIdAndUpdate(
                _id,
                { $inc: { "bookingcount": 1 } },
                { new: true }
            );
            return res.status(200).json({ success: true, msg: "Tour Booked Successfully.." });
        }
        else {
            return res.status(200).json({ success: false, msg: "Please Enter Email" });
        }
    }
    if (req.method === 'PATCH') {
        try {

            if (req.body.tempStatus === "confirm") {
                console.log("gkgjgk", req.body)
                const data = {
                    status: req.body.tempStatus,
                    messages: req.body.messages,
                    startdate: req.body.startdate,
                    days: req.body.days,
                    vehicletype: req.body.vehicletype,
                    vehiclenumber: req.body.vehicleNumber,
                    startdate: req.body.startDate,
                    days: req.body.days,
                    boardingtime: req.body.boardingTime,
                }
                const updatetour = await BookingModel.findByIdAndUpdate(req.body.id, data);
                return res.status(200).json({ status: 'success', msg: "status updated" });
            }
            else {
                const updatetour = await BookingModel.findByIdAndUpdate(req.body.id, { status: req.body.tempStatus, messages: req.body.messages });
                return res.status(200).json({ status: 'success', msg: "status updated" });
            }

        } catch (error) {
            console.log(error)
            return res.status(200).json({ status: 'failed', msg: error });
        }

    }
}
