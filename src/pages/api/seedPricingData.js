import { connectDB } from '../../lib/config/db.js';
import PricingTrainingData from "../../lib/models/PricingTrainingData.js";

const categories = ["Weekend", "Adventure", "Cultural"];

const randomBool = () => Math.random() > 0.5;

const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateRecord = () => {
  const distance = getRandom(20, 500);
  const people = getRandom(1, 10);

  const ac = randomBool();
  const food = randomBool();
  const room = randomBool();

  const category = categories[getRandom(0, 2)];

  const temperature = getRandom(15, 40);
  const humidity = getRandom(30, 90);
  const pressure = getRandom(990, 1020);
  const windSpeed = getRandom(2, 25);
  const windDirection = getRandom(0, 360);
  const precipitation = Math.random() > 0.7 ? getRandom(1, 10) : 0;

  const latitude = 26 + Math.random();
  const longitude = 80 + Math.random();

  // 👇 basic realistic pricing logic (ML ke liye target)
  let base = distance * 8;
  base += people * 200;

  if (ac) base += 500;
  if (food) base += 800;
  if (room) base += 1500;

  const finalPrice = Math.round(base + Math.random() * 1000);

  return {
    distance,
    noOfPeople: people,
    ac,
    food,
    room,
    category,
    boardingDate: new Date(),
    temperature,
    humidity,
    pressure,
    windSpeed,
    windDirection,
    precipitation,
    latitude,
    longitude,
    finalPrice,
  };
};

const seedData = async () => {
  try {
    await connectDB()

    console.log("Connected to DB");

    const records = [];

    for (let i = 0; i < 100; i++) {
      records.push(generateRecord());
    }

    await PricingTrainingData.insertMany(records);

    console.log("✅ 100 records inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();