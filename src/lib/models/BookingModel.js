import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: String, required: true },
    gender: { type: String, required: true },
    phoneno: { type: String, required: true },
    email: { type: String, required: true },

    tourid: { type: String, required: true },
    tourname: { type: String, required: true },
    pickupaddress: { type: String, required: true },
    locationid: { type: Array, required: true },

    noofPeople: { type: String, required: true },
    totalamount: { type: String, required: true },
    userid: { type: String, required: true },
    distance: { type: String, required: true },
    statusHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "waiting", "confirm", "rejected", "cancelled"],
          required: true,
        },
        message: {
          type: String,
          default: "",
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    facilities: {
      type: Object,
      default: {},
    },

    vehicletype: {
      type: String,
      default: "",
    },

    vehiclenumber: {
      type: String,
      default: "",
    },

    startdate: {
      type: Date,
    },

    days: {
      type: String,
      default: "",
    },

    boardingtime: {
      type: String,
      default: "",
    },

    bookingdate: {
  type: Date,
  default: Date.now,
},
    reqdate: {
       type: Date
    },
  },
  { timestamps: true }
);

const BookingModel =
  mongoose.models.BookingsofPlatform ||
  mongoose.model("BookingsofPlatform", bookingSchema);

export default BookingModel;