import Image from "next/image";
import { assets } from '../../assets/assets';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import Bookingpanel from './Bookingpanel';
import { useEffect, useState } from "react";
import Userlogin from "../../Components/Userlogin";
import UserReg from "../../Components/UserReg";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import ReviewSection from "../../Components/ReviewSection";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Countdown from '../../Components/Countdown';
import axios from "axios";
import { motion } from "framer-motion";

const MapComponentInner = dynamic(() => import('../../Components/MapComponent'), {
  ssr: false,
});

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

const Page = () => {
  const router = useRouter();
  const { id } = router.query;

  const [data, setdata] = useState([]);
  const [noofpeople, setNoofPeople] = useState("");
  const { paymentpanel, setPaymentPanel } = useUser();
  const { distance } = useUser();
  const { showhide, setShowhide } = useUser();
  const { showhideoptions, setShowhideoptions } = useUser();
  const [displaydetail, setDisplayDetail] = useState(false);
  const { endPos } = useUser(null);
  const [loading, setLoading] = useState(true);
  const [boardingdate, setBoardingdate] = useState("");
  const [weatherinfo, setWeatherinfo] = useState({});
  const today = new Date().toISOString().split('T')[0];

  const [facilities, setFacilities] = useState({
    ac: false,
    food: false,
    room: false
  });

  const [tourcost, setTourcost] = useState({
    totalfair: "",
    accharges: "",
    roomcharges: "",
    foodingcharges: "",
    totalcost: "",
    platformcharges: ""
  });

  const savePricingTrainingData = async (calculatedPrice) => {
    try {
      const payload = {
        distance: Number(distance) || 0,
        noOfPeople: Number(noofpeople) || 0,
        ac: facilities.ac,
        food: facilities.food,
        room: facilities.room,
        category: data?.category || "",
        boardingDate: boardingdate || null,
        temperature: Number(weatherinfo?.temperature) || 0,
        humidity: Number(weatherinfo?.humidity) || 0,
        pressure: Number(weatherinfo?.atmosphericPressure) || 0,
        windSpeed: Number(weatherinfo?.windSpeed) || 0,
        windDirection: Number(weatherinfo?.windDirection) || 0,
        precipitation: Number(weatherinfo?.precipitation) || 0,
        latitude: Number(data?.lonlat?.[0]) || 0,
        longitude: Number(data?.lonlat?.[1]) || 0,
        finalPrice: Number(calculatedPrice) || 0,
      };

      await axios.post("/api/save-pricing-data", payload);
    } catch (error) {
      console.error("Training data save failed:", error);
    }
  };

  const categoryMap = {
    Weekend: 0,
    Adventure: 1,
    Cultural: 2,
  };

  const getDayTypeValue = (dateString) => {
    const date = new Date(dateString || new Date());
    const day = date.getDay();
    return day === 0 || day === 6 ? 1 : 0;
  };

  // const Calculatecost = async () => {
  //   if (!noofpeople || Number(noofpeople) <= 0) {
  //     toast.error("Enter No of People");
  //     return;
  //   }

  //   if (!boardingdate) {
  //     toast.error("Select Boarding Date");
  //     return;
  //   }

  //   try {
  //     const selectedDate = new Date(boardingdate);

  //     const payload = {
  //       distance: Number(distance) || 0,
  //       noOfPeople: Number(noofpeople) || 1,
  //       ac: facilities.ac ? 1 : 0,
  //       food: facilities.food ? 1 : 0,
  //       room: facilities.room ? 1 : 0,
  //       category: categoryMap[data?.category] ?? 0,
  //       month: selectedDate.getMonth() + 1,
  //       dayType: getDayTypeValue(boardingdate),
  //       temperature: Number(weatherinfo?.temperature) || 0,
  //       humidity: Number(weatherinfo?.humidity) || 0,
  //       pressure: Number(weatherinfo?.atmosphericPressure) || 0,
  //       windSpeed: Number(weatherinfo?.windSpeed) || 0,
  //       windDirection: Number(weatherinfo?.windDirection) || 0,
  //       precipitation: Number(weatherinfo?.precipitation) || 0,
  //       latitude: Number(data?.lonlat?.[0]) || 0,
  //       longitude: Number(data?.lonlat?.[1]) || 0,
  //     };

  //     const res = await axios.post("http://127.0.0.1:8001/predict-price", payload);

  //     const predictedPrice = Math.round(res?.data?.predictedPrice || 0);
  //     const platformcharges = Math.round(predictedPrice * 0.05);

  //     setTourcost({
  //       totalfair: predictedPrice,
  //       accharges: 0,
  //       roomcharges: 0,
  //       foodingcharges: 0,
  //       totalcost: predictedPrice,
  //       platformcharges,
  //     });

  //     setDisplayDetail(true);
  //     await savePricingTrainingData(predictedPrice);
  //   } catch (error) {
  //     console.error("ML prediction failed:", error);
  //     toast.error("Unable to predict price");
  //   }
  // };


const Calculatecost = () => {
  const people = Number(noofpeople);
  const dist = Number(distance) || 0;

  if (!people || people <= 0) {
    toast.error("Enter No of People");
    return;
  }

  if (!dist || dist <= 0) {
    toast.error("Distance not found");
    return;
  }

  // Long distance friendly rate
  let pricePerKm = 8;

  if (dist > 50) pricePerKm = 6.5;
  if (dist > 150) pricePerKm = 5.5;
  if (dist > 300) pricePerKm = 4.5;
  if (dist > 500) pricePerKm = 3.8;
  if (dist > 800) pricePerKm = 3.2;

  let baseFare = dist * pricePerKm;

  // Long distance cap, taaki price bahut zyada na ho
  if (dist > 300) {
    baseFare = Math.min(baseFare, 2200);
  }

  if (dist > 500) {
    baseFare = Math.min(baseFare, 2800);
  }

  if (dist > 800) {
    baseFare = Math.min(baseFare, 3500);
  }

  // Better group discount
  let discount = 0;

  if (people >= 4) discount = 0.1;
  if (people >= 6) discount = 0.15;
  if (people >= 10) discount = 0.22;
  if (people >= 15) discount = 0.3;

  const discountedBaseFare = baseFare - baseFare * discount;

  // Travel fare for all people
  let totalfair = discountedBaseFare * people;

  // Facilities ko budget friendly rakha
  let accharges = facilities.ac ? totalfair * 0.06 : 0;
  let roomcharges = facilities.room ? people * 300 : 0;
  let foodingcharges = facilities.food ? people * 150 : 0;

  // Platform charge low + capped
  let platformcharges = Math.min(totalfair * 0.03, 299);

  let totalcost =
    totalfair +
    accharges +
    roomcharges +
    foodingcharges +
    platformcharges;

  // Per person cost ko user friendly limit me rakho
  let perPersonCost = totalcost / people;

  if (perPersonCost > 2200) {
    if (facilities.room) {
      totalcost -= roomcharges * 0.35;
      roomcharges = roomcharges * 0.65;
    }

    if (facilities.food) {
      totalcost -= foodingcharges * 0.25;
      foodingcharges = foodingcharges * 0.75;
    }

    if (facilities.ac) {
      totalcost -= accharges * 0.25;
      accharges = accharges * 0.75;
    }
  }

  setTourcost({
    pricePerKm: Number(pricePerKm.toFixed(1)),
    totalfair: Math.round(totalfair),
    accharges: Math.round(accharges),
    roomcharges: Math.round(roomcharges),
    foodingcharges: Math.round(foodingcharges),
    platformcharges: Math.round(platformcharges),
    discount: Math.round(discount * 100),
    perPersonCost: Math.round(totalcost / people),
    totalcost: Math.round(totalcost),
  });

  setDisplayDetail(true);
};

  const paymentdashopen = () => {
    const token = localStorage.getItem('usertoken');
    if (!token) {
      setShowhide(true);
      setShowhideoptions("login");
    } else {
      if (!tourcost.totalcost) {
        toast.error("Enter no of Peoples");
      } else {
        setPaymentPanel(true);
      }
    }
  };

  const handleFacilityChange = (type, value) => {
    setFacilities((prev) => ({
      ...prev,
      [type]: value === "Yes"
    }));
  };

  async function getCurrentAtmosphericConditions(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,precipitation`;

      const res = await fetch(url);
      const data = await res.json();
      const current = data.current;

      const dateObj = new Date(current?.time);

      const formattedDate = dateObj.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      const formattedTime = dateObj.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setWeatherinfo({
        temperature: current?.temperature_2m,
        humidity: current?.relative_humidity_2m,
        atmosphericPressure: current?.surface_pressure,
        windSpeed: current?.wind_speed_10m,
        windDirection: current?.wind_direction_10m,
        precipitation: current?.precipitation,
        date: formattedDate,
        time: formattedTime,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

  const getWindDirectionLabel = (degree) => {
    if (degree === undefined || degree === null) return "--";
    if (degree >= 337.5 || degree < 22.5) return "North";
    if (degree >= 22.5 && degree < 67.5) return "North-East";
    if (degree >= 67.5 && degree < 112.5) return "East";
    if (degree >= 112.5 && degree < 157.5) return "South-East";
    if (degree >= 157.5 && degree < 202.5) return "South";
    if (degree >= 202.5 && degree < 247.5) return "South-West";
    if (degree >= 247.5 && degree < 292.5) return "West";
    if (degree >= 292.5 && degree < 337.5) return "North-West";
    return "--";
  };

  useEffect(() => {
    if (!id) return;

    const fetchTour = async () => {
      try {
        const res = await axios.get('/api/tourselect', { params: { id } });
        setdata(res.data[0]);

        getCurrentAtmosphericConditions(
          res?.data[0]?.lonlat?.[0],
          res?.data[0]?.lonlat?.[1]
        );
      } catch (error) {
        console.error("Error fetching tour:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [id]);

  if (!id || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f3f4f6] via-[#ffffff] to-[#eeeeee]">
        <div className="w-12 h-12 border-[3px] border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
        <p className="mt-3 text-xs text-slate-600 font-medium">Loading your tour...</p>
      </div>
    );
  }

  return data ? (
    <>
      <ToastContainer />
      <div className="min-h-screen">
        <Navbar />

        {showhide ? (
          showhideoptions === "login" ? <Userlogin /> :
          showhideoptions === "signup" ? <UserReg /> : ""
        ) : ""}

        {paymentpanel && (
          <Bookingpanel
            charges={Number(tourcost.totalcost || 0) + Number(tourcost.platformcharges || 0)}
            locationid={endPos}
            facilities={facilities}
            passenger={noofpeople}
            tourdata={data}
            distance={distance}
            boardingdate={boardingdate}
          />
        )}

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-5 py-5 md:py-7 space-y-5">
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="relative overflow-hidden rounded-[22px] border border-gray-200  bg-gradient-to-b from-[#FFF7ED] via-[#FFFFFF] to-[#F0F9FF]"
          >
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 items-center p-4 sm:p-5 md:p-6">
              <motion.div variants={fadeLeft} className="order-2 lg:order-1">
                <span className="inline-flex px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] sm:text-xs font-semibold text-gray-700 shadow-sm">
                  Premium Travel Tour
                </span>

                <h1 className="mt-3 text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 leading-snug">
                  {data?.tourname}
                </h1>

                <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-6 max-w-xl">
                  Explore a modern travel experience with smart pricing, interactive route selection, live weather insight and a cleaner tour booking journey.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] sm:text-xs text-slate-700 shadow-sm">
                    {data?.category || "Tour"}
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] sm:text-xs text-slate-700 shadow-sm">
                    Live Weather
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[10px] sm:text-xs text-slate-700 shadow-sm">
                    Smart Calculator
                  </span>
                </div>
              </motion.div>

              <motion.div variants={fadeRight} className="order-1 lg:order-2">
  <div className="rounded-[18px] overflow-hidden border border-gray-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)]">    <Image
                    src={data?.image || ""}
                    width={900}
                    height={520}
                    alt={data?.tourname || "tour"}
                    className="w-full h-[220px] sm:h-[280px] md:h-[340px] object-cover transition duration-700 hover:scale-105"
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-[22px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 sm:p-5 md:p-6"
          >
            <div>
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                Tour Description
              </p>
              <h2 className="mt-2 text-base sm:text-xl md:text-2xl font-bold text-slate-900">
                About this tour
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-7 text-justify px-10">
                {data?.description}
              </p>

              <div className="flex items-center flex-col mt-5">
                <p className="text-sm sm:text-lg font-semibold text-slate-900 mb-3">
                  Traveling Options
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Family", "Friends", "Individual", "Groups"].map((item, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-[10px] sm:text-xs font-medium text-slate-700"
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-[22px] border border-gray-200 bg-blue-100 overflow-hidden"
          >
            <div className="px-4 sm:px-5 py-3 border-b border-gray-200">
              <h2 className="text-sm sm:text-lg font-bold text-slate-900">Weather Condition</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                Live atmospheric conditions for this destination
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 sm:p-5">
              <motion.div whileHover={{ y: -3 }} className="rounded-[16px] bg-gray-50 border border-gray-200 p-3">
                <p className="text-[10px] sm:text-xs text-slate-500">Temperature</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {weatherinfo?.temperature ?? "--"}°C
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className="rounded-[16px] bg-gray-50 border border-gray-200 p-3">
                <p className="text-[10px] sm:text-xs text-slate-500">Humidity</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {weatherinfo?.humidity ?? "--"}%
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className="rounded-[16px] bg-gray-50 border border-gray-200 p-3">
                <p className="text-[10px] sm:text-xs text-slate-500">Pressure</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {weatherinfo?.atmosphericPressure ?? "--"} hPa
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className="rounded-[16px] bg-gray-50 border border-gray-200 p-3">
                <p className="text-[10px] sm:text-xs text-slate-500">Wind Speed</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {weatherinfo?.windSpeed ?? "--"} km/h
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className="rounded-[16px] bg-gray-50 border border-gray-200 p-3">
                <p className="text-[10px] sm:text-xs text-slate-500">Wind Direction</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {getWindDirectionLabel(weatherinfo?.windDirection)}
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  {weatherinfo?.windDirection ?? "--"}°
                </p>
              </motion.div>

              <motion.div whileHover={{ y: -3 }} className="rounded-[16px] bg-gray-50 border border-gray-200 p-3">
                <p className="text-[10px] sm:text-xs text-slate-500">Precipitation</p>
                <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
                  {weatherinfo?.precipitation ?? "--"} mm
                </p>
              </motion.div>
            </div>

            <div className="px-4 sm:px-5 pb-4">
              <div className="rounded-[16px]  px-4 py-3 text-[10px] sm:text-xs text-slate-600">
                Last updated: {weatherinfo?.date || "--"} {weatherinfo?.time || "--"}
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 xl:grid-cols-10 gap-4"
          >
            <motion.div
              variants={fadeLeft}
              className="xl:col-span-7 rounded-[20px] border border-gray-200 bg-gradient-to-br from-[#fafafa] via-[#ffffff] to-[#f3f4f6] shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-3 sm:p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm sm:text-lg font-bold text-slate-900">Pickup Location</h2>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                    Choose your route and view distance clearly
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-white border border-gray-200 text-[10px] sm:text-xs font-medium text-gray-700 shadow-sm">
                  Interactive Map
                </span>
              </div>

              <div className="rounded-[16px] overflow-hidden border border-gray-200 bg-white shadow-inner">
                <div className="h-[340px] sm:h-[420px] md:h-[500px] lg:h-[560px]">
                  <MapComponentInner startPos={data?.lonlat} />
                </div>
              </div>

            </motion.div>

            <motion.div
              variants={fadeRight}
              className="xl:col-span-3 rounded-[20px] border border-gray-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] overflow-hidden"
            >
              <div className="px-4 sm:px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-[#f7f7f7] via-[#ffffff] to-[#f1f1f1]">
                <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Smart Estimation
                </p>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  Trip Cost Calculator
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-600 mt-1 leading-5">
                  Enter your trip details and get a quick estimated cost.
                </p>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-700 mb-2">
                    Number of People
                  </label>
                  <input
                    type="number"
                    placeholder="Enter number of people"
                    className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-3 py-3 text-[10px] sm:text-xs text-slate-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition"
                    value={noofpeople}
                    onChange={(e) => setNoofPeople(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-700 mb-2">
                    Boarding Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-[14px] border border-gray-200 bg-gray-50 px-3 py-3 text-[10px] sm:text-xs text-slate-800 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition"
                    value={boardingdate}
                    min={today}
                    onChange={(e) => setBoardingdate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <div className="rounded-[14px] border border-gray-200 bg-gray-50 p-3">
                    <p className="text-[10px] sm:text-xs font-medium text-slate-700 mb-2">Vehicle Type</p>
                    <select
                      className="w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2.5 text-[10px] sm:text-xs outline-none focus:border-gray-400"
                      onChange={(e) => handleFacilityChange("ac", e.target.value)}
                    >
                      <option>Select</option>
                      <option value="Yes">AC</option>
                      <option value="No">Non-AC</option>
                    </select>
                  </div>
                  {(data?.services?.fooding === "Yes" || data?.services?.room === "Yes") && (<p className="text-[10px] sm:text-xs font-medium text-slate-700">Optional Facilities</p>)}
                  {data?.services?.fooding === "Yes" && (
                    <div className="rounded-[14px] border border-gray-200 bg-gray-50 p-3">
                      <p className="text-[10px] sm:text-xs font-medium text-slate-700 mb-2">Food Facility</p>
                      <select
                        className="w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2.5 text-[10px] sm:text-xs outline-none focus:border-gray-400"
                        onChange={(e) => handleFacilityChange("food", e.target.value)}
                      >
                        <option>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )}

                  {data?.services?.room === "Yes" && (
                    <div className="rounded-[14px] border border-gray-200 bg-gray-50 p-3">
                      <p className="text-[10px] sm:text-xs font-medium text-slate-700 mb-2">Room Facility</p>
                      <select
                        className="w-full rounded-[12px] border border-gray-200 bg-white px-3 py-2.5 text-[10px] sm:text-xs outline-none focus:border-gray-400"
                        onChange={(e) => handleFacilityChange("room", e.target.value)}
                      >
                        <option>Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  )}
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={Calculatecost}
                  className="w-full py-3 rounded-[14px] bg-gray-900 hover:bg-black text-white text-[10px] sm:text-xs font-semibold transition shadow-md"
                >
                  Calculate Cost
                </motion.button>

                {displaydetail && (
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-[16px] border border-gray-200 bg-gradient-to-b from-gray-50 to-white p-4"
                  >
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3">Estimated Cost</h3>

                    <div className="space-y-2 text-[10px] sm:text-xs text-slate-700">
                      {facilities.ac && (
                        <div className="flex justify-between">
                          <span>AC Vehicle Charges</span>
                          <span>₹{tourcost.accharges}</span>
                        </div>
                      )}
                      {facilities.food && (
                        <div className="flex justify-between">
                          <span>Food Charges</span>
                          <span>₹{tourcost.foodingcharges}</span>
                        </div>
                      )}
                      {facilities.room && (
                        <div className="flex justify-between">
                          <span>Room Charges</span>
                          <span>₹{tourcost.roomcharges}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tour Cost</span>
                        <span>₹{tourcost.totalcost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Charges</span>
                        <span>₹{tourcost.platformcharges}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 my-3"></div>

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-900">Grand Total</span>
                      <span className="text-xs sm:text-sm font-bold text-gray-900">
                        ₹{Number(tourcost.totalcost || 0) + Number(tourcost.platformcharges || 0)}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={paymentdashopen}
                      className="mt-4 w-full py-3 rounded-[14px] bg-slate-900 hover:bg-black text-white text-[10px] sm:text-xs font-semibold transition"
                    >
                      Book Now
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.section>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-[22px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 sm:p-5"
          >
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-4">Facilities</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: "Hassle-Free Transportation",
                  desc: "Enjoy smooth and reliable transport service with comfortable vehicles and experienced drivers for stress-free travel.",
                  bg: "bg-gray-50 border-gray-200"
                },
                {
                  title: "Comfortable Accommodation",
                  desc: "Clean, safe and well-equipped rooms with options from budget-friendly stays to premium hotel experience.",
                  bg: "bg-gray-50 border-gray-200"
                },
                {
                  title: "Budget-Friendly Packages",
                  desc: "Smart travel packages designed to balance affordability and quality for better overall value.",
                  bg: "bg-gray-50 border-gray-200"
                },
                {
                  title: "24/7 Customer Support",
                  desc: "Dedicated support team available whenever you need help during your journey.",
                  bg: "bg-gray-50 border-gray-200"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  className={`rounded-[16px] border p-4 ${item.bg}`}
                >
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-[10px] sm:text-xs text-slate-600 leading-6">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ReviewSection tourid={data?._id} />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Countdown />
          </motion.div>

          <motion.section
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-[22px] border border-gray-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] p-4 sm:p-5"
          >
            <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-4">Important Notes</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] sm:text-xs text-slate-600">
              <div className="rounded-[16px] bg-gray-50 border border-gray-200 p-4">
                ➢ All tour timings are in Pack & go platform.
              </div>
              <div className="rounded-[16px] bg-gray-50 border border-gray-200 p-4">
                ➢ Allocate 90 minutes before the tour and 60 minutes before your boarding time.
              </div>
              <div className="rounded-[16px] bg-gray-50 border border-gray-200 p-4">
                ➢ Same-day booking seats may not always be available.
              </div>
              <div className="rounded-[16px] bg-gray-50 border border-gray-200 p-4">
                ➢ Please check the last departure time before booking.
              </div>
            </div>

            <div className="flex flex-col items-center mt-7">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 mb-4 text-center">
                Share this Tour on Social Media
              </p>

              <div className="flex items-center gap-3">
                {[assets.facebook_icon, assets.twitter_icon, assets.googleplus_icon].map((icon, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
                  >
                    <Image src={icon} width={50} height={50} alt="social" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        <Footer />
      </div>
    </>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-5">
      <div className="bg-white rounded-3xl shadow-lg p-10 text-center border border-slate-100">
        <h1 className="text-lg sm:text-2xl font-bold text-slate-800">No Tours Are Available</h1>
      </div>
    </div>
  );
};

export default Page;