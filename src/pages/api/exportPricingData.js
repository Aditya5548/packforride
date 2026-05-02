import { connectDB } from "../../lib/config/db.js";
import PricingTrainingData from "../../lib/models/PricingTrainingData.js";
import fs from "fs";

const exportToCSV = async () => {
  try {
    await connectDB();
    console.log("DB Connected");

    const data = await PricingTrainingData.find({}).lean();

    if (!data.length) {
      console.log("No data found");
      return;
    }

    // 👇 CSV headers
    const headers = [
      "distance",
      "noOfPeople",
      "ac",
      "food",
      "room",
      "category",
      "month",
      "dayType",
      "temperature",
      "humidity",
      "pressure",
      "windSpeed",
      "windDirection",
      "precipitation",
      "latitude",
      "longitude",
      "finalPrice"
    ];

    // 👇 data rows convert karo
    const rows = data.map(item => {
      const date = new Date(item.boardingDate);
      const month = date.getMonth() + 1;
      const day = date.getDay();
      const dayType = (day === 0 || day === 6) ? "Weekend" : "Weekday";

      return [
        item.distance,
        item.noOfPeople,
        item.ac ? 1 : 0,
        item.food ? 1 : 0,
        item.room ? 1 : 0,
        item.category,
        month,
        dayType,
        item.temperature,
        item.humidity,
        item.pressure,
        item.windSpeed,
        item.windDirection,
        item.precipitation,
        item.latitude,
        item.longitude,
        item.finalPrice
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    fs.writeFileSync("tour_price_data.csv", csvContent);

    console.log("✅ CSV file created: tour_price_data.csv");
  } catch (error) {
    console.error(error);
  }
};

exportToCSV();