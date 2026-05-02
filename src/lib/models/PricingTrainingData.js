import mongoose from "mongoose";

const PricingTrainingDataSchema = new mongoose.Schema(
  {
    distance: {
      type: Number,
      required: true,
    },
    noOfPeople: {
      type: Number,
      required: true,
    },
    ac: {
      type: Boolean,
      default: false,
    },
    food: {
      type: Boolean,
      default: false,
    },
    room: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      default: "",
    },
    boardingDate: {
      type: Date,
    },
    month: {
      type: Number,
    },
    dayType: {
      type: String,
      enum: ["Weekend", "Weekday"],
      default: "Weekday",
    },
    temperature: {
      type: Number,
      default: 0,
    },
    humidity: {
      type: Number,
      default: 0,
    },
    pressure: {
      type: Number,
      default: 0,
    },
    windSpeed: {
      type: Number,
      default: 0,
    },
    windDirection: {
      type: Number,
      default: 0,
    },
    precipitation: {
      type: Number,
      default: 0,
    },
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.PricingTrainingData ||
  mongoose.model("PricingTrainingData", PricingTrainingDataSchema);