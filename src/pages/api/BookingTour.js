import { connectDB } from "../../lib/config/db";
import BookingModel from "../../lib/models/BookingModel";
import TourlistModel from "../../lib/models/TourlistModel";
import { main } from "./Send-Email/helper";

const getCurrentStatus = (booking) => {
  return booking?.statusHistory?.[booking.statusHistory.length - 1]?.status || "pending";
};

const getCurrentMessage = (booking) => {
  return booking?.statusHistory?.[booking.statusHistory.length - 1]?.message || "";
};

const bookingEmailTemplate = (data) => {
  return `
    <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:20px;">
      <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:#0f766e;padding:18px;text-align:center;">
          <h2 style="color:#ffffff;margin:0;">PackForRide</h2>
          <p style="color:#d1fae5;margin:5px 0 0;">Booking Request Received</p>
        </div>

        <div style="padding:22px;">
          <p style="font-size:15px;">Dear <b>${data.name || "User"}</b>,</p>
          <p style="font-size:14px;color:#374151;">
            Thank you for booking with <b>PackForRide</b>. Your booking request has been received successfully and is currently under review.
          </p>

          <div style="background:#f9fafb;border-radius:10px;padding:15px;margin:18px 0;">
            <h3 style="margin-top:0;color:#111827;">Booking Details</h3>
            <p><b>Tour Name:</b> ${data.tourname || "-"}</p>
            <p><b>Pickup Address:</b> ${data.pickupaddress || "-"}</p>
            <p><b>Booking Date:</b> ${data.bookingdate || "Not provided"}</p>
            <p><b>No. of People:</b> ${data.noofPeople || "-"}</p>
            <p><b>Distance:</b> ${data.distance || "N/A"} km</p>
            <p><b>Total Amount:</b> Rs. ${data.totalamount || 0}</p>
            <p><b>Status:</b> Pending</p>
          </div>

          <p style="font-size:14px;color:#374151;">Our team will review your booking and update you shortly.</p>
          <p style="font-size:14px;color:#374151;">Regards,<br/><b>Team PackForRide</b></p>
        </div>

        <div style="background:#f3f4f6;padding:12px;text-align:center;font-size:12px;color:#6b7280;">
          This is an automated email. Please do not reply directly.
        </div>
      </div>
    </div>
  `;
};

const statusEmailTemplate = (data) => {
  const status = getCurrentStatus(data);
  const message = getCurrentMessage(data);

  let title = "Booking Status Updated";
  let mainMessage = "Your booking status has been updated.";
  let statusColor = "#2563eb";

  if (status === "confirm") {
    title = "Booking Confirmed";
    mainMessage = "Your booking has been confirmed successfully. Your trip and vehicle details are given below.";
    statusColor = "#16a34a";
  }

  if (status === "waiting") {
    title = "Booking In Waiting";
    mainMessage = "Your booking is currently in waiting status. Our team will update you shortly.";
    statusColor = "#f59e0b";
  }

  if (status === "rejected") {
    title = "Booking Rejected";
    mainMessage = "Your booking request has been rejected. Please check the reason below.";
    statusColor = "#dc2626";
  }

  if (status === "cancelled") {
    title = "Booking Cancelled";
    mainMessage = "Your booking has been cancelled. Please check the message below.";
    statusColor = "#6b7280";
  }

  return `
    <div style="font-family:Arial,sans-serif;background:#f4f7fb;padding:20px;">
      <div style="max-width:650px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:${statusColor};padding:18px;text-align:center;">
          <h2 style="color:#ffffff;margin:0;">PackForRide</h2>
          <p style="color:#ffffff;margin:5px 0 0;">${title}</p>
        </div>

        <div style="padding:22px;">
          <p style="font-size:15px;">Dear <b>${data.name || "User"}</b>,</p>
          <p style="font-size:14px;color:#374151;">${mainMessage}</p>

          <div style="background:#f9fafb;border-radius:10px;padding:15px;margin:18px 0;">
            <h3 style="margin-top:0;color:#111827;">Booking Details</h3>
            <p><b>Tour Name:</b> ${data.tourname || "-"}</p>
            <p><b>Pickup Address:</b> ${data.pickupaddress || "-"}</p>
            <p><b>No. of People:</b> ${data.noofPeople || "-"}</p>
            <p><b>Distance:</b> ${data.distance || "N/A"} km</p>
            <p><b>Total Amount:</b> Rs. ${data.totalamount || 0}</p>
            <p><b>Status:</b> ${status}</p>
            <p><b>Message:</b> ${message || "-"}</p>
          </div>

          ${status === "confirm"
      ? `
              <div style="background:#ecfdf5;border:1px solid #bbf7d0;border-radius:10px;padding:15px;margin:18px 0;">
                <h3 style="margin-top:0;color:#166534;">Confirmed Trip Details</h3>
                <p><b>Start Date:</b> ${data.startdate || "-"}</p>
                <p><b>No. of Days Required:</b> ${data.days || "-"}</p>
                <p><b>Boarding Time:</b> ${data.boardingtime || "-"}</p>
                <p><b>Vehicle Type:</b> ${data.vehicletype || "-"}</p>
                <p><b>Vehicle Number:</b> ${data.vehiclenumber || "-"}</p>
              </div>
              `
      : ""
    }

          <p style="font-size:14px;color:#374151;">Regards,<br/><b>Team PackForRide</b></p>
        </div>

        <div style="background:#f3f4f6;padding:12px;text-align:center;font-size:12px;color:#6b7280;">
          This is an automated email. Please do not reply directly.
        </div>
      </div>
    </div>
  `;
};

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      if (req.query.fetchtype === "user") {
        const bookedTours = await BookingModel.find({
          userid: req.query.userid,
        }).sort({ _id: -1 });

        const formattedTours = bookedTours.map((item) => ({
          ...item.toObject(),
          status: getCurrentStatus(item),
          messages: getCurrentMessage(item),
        }));

        return res.status(200).json(formattedTours);
      }

      if (req.query.fetchtype === "admin") {
        const bookedTours = await BookingModel.find().sort({ _id: -1 });

        const formattedTours = bookedTours.map((item) => ({
          ...item.toObject(),
          status: getCurrentStatus(item),
          messages: getCurrentMessage(item),
        }));

        return res.status(200).json(formattedTours);
      }

      return res.status(400).json({
        success: false,
        msg: "Invalid fetch type",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        msg: "No data found",
        error: error.message,
      });
    }
  }

  if (req.method === "POST") {
    try {
      if (!req.body.email) {
        return res.status(400).json({
          success: false,
          msg: "Please enter email",
        });
      }

      const pendingMessage =
        "Your booking is under review. Please wait for confirmation.";

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

        noofPeople: req.body.passenger,
        distance: req.body.distance,
        totalamount: req.body.totalamount,
        userid: req.body.userid,

        vehicletype: "",
        vehiclenumber: "",
        startdate: undefined,
        reqdate: req.body.boardingdate || new Date(),
        days: "",
        boardingtime: "",

        statusHistory: [
          {
            status: "pending",
            message: pendingMessage,
            date: new Date(),
          },
        ],

        facilities: req.body.facilities || {},
      };

      const booking = await BookingModel.create(data);

      await TourlistModel.findByIdAndUpdate(
        req.body.tourid,
        { $inc: { bookingcount: 1 } },
        { new: true }
      );

      await main({
        to: data.email,
        subject: `PackForRide Booking Received - ${data.tourname}`,
        html: bookingEmailTemplate(data),
      });

      return res.status(200).json({
        success: true,
        msg: "Tour booked successfully. Confirmation email sent.",
        booking: {
          ...booking.toObject(),
          status: "pending",
          messages: pendingMessage,
        },
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        msg: "Booking failed",
        error: error.message,
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const booking = await BookingModel.findById(req.body.id);

      if (!booking) {
        return res.status(404).json({
          status: "failed",
          msg: "Booking not found",
        });
      }

      const currentStatus = getCurrentStatus(booking);

      if (currentStatus === "cancelled") {
        return res.status(400).json({
          status: "failed",
          msg: "Cancelled booking cannot be updated",
        });
      }

      const newStatus = req.body.tempStatus;
      const newMessage = req.body.messages || "";

      let updateData = {
        $push: {
          statusHistory: {
            status: newStatus,
            message: newMessage,
            date: new Date(),
          },
        },
      };

      if (newStatus === "confirm") {
        updateData = {
          ...updateData,
          startdate: req.body.startDate || undefined,
          days: req.body.days || "",
          boardingtime: req.body.boardingTime || "",
          vehicletype: req.body.vehicleType || req.body.vehicletype || "",
          vehiclenumber: req.body.vehicleNumber || "",
        };
      }

      const updatedBooking = await BookingModel.findByIdAndUpdate(
        req.body.id,
        updateData,
        { new: true }
      );

      const updatedStatus = getCurrentStatus(updatedBooking);

      if (updatedBooking?.email) {
        await main({
          to: updatedBooking.email,
          subject:
            updatedStatus === "confirm"
              ? `PackForRide Booking Confirmed - ${updatedBooking.tourname}`
              : `PackForRide Booking Status - ${updatedStatus}`,
          html: statusEmailTemplate(updatedBooking),
        });
      }

      return res.status(200).json({
        status: "success",
        msg: "Status updated and email sent successfully",
        booking: {
          ...updatedBooking.toObject(),
          status: getCurrentStatus(updatedBooking),
          messages: getCurrentMessage(updatedBooking),
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "failed",
        msg: error.message,
      });
    }
  }

  return res.status(405).json({
    success: false,
    msg: "Method not allowed",
  });
}