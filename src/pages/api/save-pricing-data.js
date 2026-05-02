import { connectDB } from '../../lib/config/db';
import PricingTrainingData from "../../lib/models/PricingTrainingData";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await connectDB();

    const {
      distance,
      noOfPeople,
      ac,
      food,
      room,
      category,
      boardingDate,
      temperature,
      humidity,
      pressure,
      windSpeed,
      windDirection,
      precipitation,
      latitude,
      longitude,
      finalPrice,
    } = req.body;

    if (!distance || !noOfPeople || !finalPrice) {
      return res.status(400).json({
        success: false,
        message: "distance, noOfPeople and finalPrice are required",
      });
    }

    const selectedDate = boardingDate ? new Date(boardingDate) : new Date();
    const day = selectedDate.getDay();
    const isWeekend = day === 0 || day === 6;

    const savedData = await PricingTrainingData.create({
      distance: Number(distance),
      noOfPeople: Number(noOfPeople),
      ac: Boolean(ac),
      food: Boolean(food),
      room: Boolean(room),
      category: category || "",
      boardingDate: selectedDate,
      month: selectedDate.getMonth() + 1,
      dayType: isWeekend ? "Weekend" : "Weekday",
      temperature: Number(temperature) || 0,
      humidity: Number(humidity) || 0,
      pressure: Number(pressure) || 0,
      windSpeed: Number(windSpeed) || 0,
      windDirection: Number(windDirection) || 0,
      precipitation: Number(precipitation) || 0,
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      finalPrice: Number(finalPrice),
    });

    return res.status(201).json({
      success: true,
      message: "Pricing training data saved successfully",
      data: savedData,
    });
  } catch (error) {
    console.error("Save pricing data error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}