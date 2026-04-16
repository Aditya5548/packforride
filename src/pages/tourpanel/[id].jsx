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
const MapComponentInner = dynamic(() => import('../../Components/MapComponent'), {
  ssr: false,
});
import axios from "axios";

const page = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setdata] = useState([]);
  const [tourslots, setTourslots] = useState([]);
  const [noofpeople, setNoofPeople] = useState();
  const { paymentpanel, setPaymentPanel } = useUser();
  const { distance, setDistance } = useUser();
  const { showhide, setShowhide } = useUser();
  const { showhideoptions, setShowhideoptions } = useUser();
  const [displaydetail, setDisplayDetail] = useState(false);
  const { endPos, setEndPos } = useUser(null);
  const [loading, setLoading] = useState(true);
  const [boardingdate, setBoardingdate] = useState();
  const [weatherinfo, setWeatherinfo] = useState({});
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

  const Calculatecost = () => {
    if (noofpeople > 0) {
      const people = Number(noofpeople) || 1;
      const dist = Number(distance) || 0;

      let pricePerKm = 12;

      if (dist > 50) pricePerKm = 10;
      if (dist > 150) pricePerKm = 8;
      if (dist > 300) pricePerKm = 6;

      let baseFare = dist * pricePerKm;

      let discount = 0;
      if (people >= 5) discount = 0.1;
      if (people >= 10) discount = 0.2;

      baseFare = baseFare - baseFare * discount;

      let accharges = facilities.ac ? baseFare * 0.15 : 0;
      let roomcharges = facilities.room ? baseFare * 0.25 : 0;
      let foodingcharges = facilities.food ? baseFare * 0.2 : 0;
      let platformcharges = baseFare * 0.2;

      let totalfair = baseFare * people;

      let totalcost =
        totalfair + accharges + roomcharges + foodingcharges;

      const perPersonCost = totalcost / people;

      if (perPersonCost > 3000) {
        if (facilities.room) {
          roomcharges = 0;
          totalcost -= baseFare * 0.25;
        }

        if (perPersonCost > 3000 && facilities.food) {
          foodingcharges = 0;
          totalcost -= baseFare * 0.2;
        }
      }

      setTourcost({
        totalfair: Math.round(totalfair),
        accharges: Math.round(accharges),
        roomcharges: Math.round(roomcharges),
        foodingcharges: Math.round(foodingcharges),
        totalcost: Math.round(totalcost),
        platformcharges: Math.round(platformcharges),
      });

      setDisplayDetail(true);
    } else {
      toast.error("Enter No of People");
    }
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

    // ✅ Convert time
    const dateObj = new Date(current?.time);

    const formattedDate = dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = dateObj.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // 👉 AM/PM format
    });

    const weatherData = {
      temperature: current?.temperature_2m,
      humidity: current?.relative_humidity_2m,
      atmosphericPressure: current?.surface_pressure,
      windSpeed: current?.wind_speed_10m,
      windDirection: current?.wind_direction_10m,
      precipitation: current?.precipitation,

      // ✅ New fields
      date: formattedDate,
      time: formattedTime,
    };

    setWeatherinfo(weatherData);
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
          res?.data[0]?.lonlat[0],
          res?.data[0]?.lonlat[1]
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
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="mt-3 text-gray-600 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    data ? <>
      <div className='bg-gray-300 pb-5'>
        <Navbar />
        <div className="text-center mb-20 mt-5">
          <h1 className="text-xl sm:text-2xl font-semibold max-w-[700px] mx-auto pb-2">
            {data.category} Tour
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image
          src={null || data.image}
          width={400}
          height={300}
          alt=''
          className='border-4 border-white'
        />

        <div className='self-start text-justify w-full'>
          <p className='text-xl sm:text-2xl font-semibold py-2'>{data.tourname}</p>
          <p className='pt-3 text-sm md:text-md'>{data.description}</p>

          

          <div className='pt-5'>
            <p className='text-xl font-semibold'>Traveling option:</p>
            <div className='flex flex-wrap justify-center gap-5 pt-2'>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Family</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Friends</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Indivisual</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Groups</button>
            </div>
          </div>

          {/* Current Weather Card */}
          <div className="mt-6 rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white shadow-sm overflow-hidden">
            <div className="border-b border-sky-100 px-4 py-3">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                Current Weather
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Live atmospheric conditions for this tour location
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Temperature</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {weatherinfo?.temperature ?? "--"}°C
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Humidity</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {weatherinfo?.humidity ?? "--"}%
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Pressure</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {weatherinfo?.atmosphericPressure ?? "--"} hPa
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Wind Speed</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {weatherinfo?.windSpeed ?? "--"} km/h
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Wind Direction</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {getWindDirectionLabel(weatherinfo?.windDirection)}
                </p>
                <p className="text-[11px] text-gray-400">
                  {weatherinfo?.windDirection ?? "--"}°
                </p>
              </div>

              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-500">Precipitation</p>
                <p className="text-base sm:text-lg font-semibold text-gray-800">
                  {weatherinfo?.precipitation ?? "--"} mm
                </p>
              </div>
            </div>

            <div className="px-4 pb-4">
              <div className="rounded-xl bg-sky-50 px-3 py-2 text-xs sm:text-sm text-gray-600 border border-sky-100">
                Last updated: {weatherinfo?.date  || "--"} {weatherinfo?.time  || "--"}
              </div>
            </div>
          </div>

          {showhide ? showhideoptions == "login" ? <Userlogin /> : showhideoptions == "signup" ? <UserReg /> : "" : ""}
          {paymentpanel && (
            <Bookingpanel
              charges={tourcost.totalcost + tourcost.platformcharges}
              locationid={endPos}
              facilities={facilities}
              passenger={noofpeople}
              tourdata={data}
              distance={distance}
              boardingdate={boardingdate}
            />
          )}

          <div className="flex flex-col py-5 md:py-10">
            <MapComponentInner startPos={data.lonlat} />
            <div />

            <div className="w-full max-w-xl mx-auto my-10 p-5 rounded-xl shadow-md bg-gray-50">
              <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Trip Cost Calculator
              </h1>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Number of People
                </label>
                <input
                  type="number"
                  placeholder="Enter number"
                  className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-gray-400 outline-none"
                  value={noofpeople}
                  onChange={(e) => setNoofPeople(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 my-2">
                  Boarding Date
                </label>
                <input
                  type="date"
                  className="w-full border rounded-md px-3 py-2 focus:ring-1 focus:ring-gray-400 outline-none"
                  value={boardingdate}
                  onChange={(e) => setBoardingdate(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 text-sm">
                <div>
                  <p className="font-medium">AC Vehicle</p>
                  <select
                    className="w-full border rounded-md p-1 mt-1"
                    onChange={(e) => handleFacilityChange("ac", e.target.value)}
                  >
                    <option>Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {data.services.fooding === "Yes" &&
                  <div>
                    <p className="font-medium">Food facility</p>
                    <select
                      className="w-full border rounded-md p-1 mt-1"
                      onChange={(e) => handleFacilityChange("food", e.target.value)}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                }

                {data.services.room === "Yes" &&
                  <div>
                    <p className="font-medium">Room facility</p>
                    <select
                      className="w-full border rounded-md p-1 mt-1"
                      onChange={(e) => handleFacilityChange("room", e.target.value)}
                    >
                      <option>Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                }
              </div>

              <button
                onClick={Calculatecost}
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              >
                Calculate Cost
              </button>

              {displaydetail && (
                <div className="mt-4 p-3 border rounded-md bg-gray-50 animate-fadeIn">
                  {facilities.ac && <p>Vehicle Charges: ₹{tourcost.accharges}</p>}
                  {facilities.food && <p>Food Charges: ₹{tourcost.foodingcharges}</p>}
                  {facilities.room && <p>Room Charges: ₹{tourcost.roomcharges}</p>}

                  <hr className="my-2" />

                  <p className="font-semibold">
                    Total: ₹{tourcost.totalcost} + ₹{tourcost.platformcharges}(GST + Charges)
                  </p>

                  <button
                    onClick={paymentdashopen}
                    className="mt-3 w-full bg-gray-900 text-white py-2 rounded-md hover:bg-black transition"
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>

            <div>
              <p className='text-xl font-semibold'>Facilities:</p>
              <div className="pt-4 text-sm md:text-md">
                <div className="py-1">
                  <h1 className="font-bold">Hassle-Free Transportation:</h1>
                  <p>Enjoy smooth and reliable travel with our well-organized transport services. From pickups to drop-offs, we provide comfortable vehicles and experienced drivers so you can travel stress-free.</p>
                </div>
                <div className="py-1">
                  <h1 className="font-bold">Comfortable Accommodation:</h1>
                  <p>We offer a wide range of accommodation options, from budget-friendly stays to premium hotels. Clean, safe, and well-equipped rooms ensure you feel at home wherever you go.</p>
                </div>
                <div className="py-1">
                  <h1 className="font-bold">Budget-Friendly Packages:</h1>
                  <p>We design trips that fit your budget without compromising on quality, ensuring maximum value for your money.</p>
                </div>
                <div className="py-1">
                  <h1 className="font-bold">24/7 Customer Support:</h1>
                  <p>Our dedicated support team is always ready to assist you during your journey, making sure your travel experience remains smooth and enjoyable.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ReviewSection tourid={data._id} />
      <Countdown />

      <div className='py-1 bg-gray-100 px-5'>
        <p className='text-xl md:text-2xl font-semibold'>Important Notes :</p>
        <div className='flex flex-wrap gap-5 pt-2 text-sm md:text-md'>
          ➢ All tour timings are in Pack & go platform. <br />
          ➢ For immigration clearance purposes, be sure to allocate 90 minutes before the tour and 60 minutes before your boarding time (upon the tour's completion). <br />
          ➢ Availability of seats is not guaranteed on same-day bookings, please visit the Discover Qatar Transit Tour desk as soon as possible to secure your preferred tour timings. <br />
          ➢ Please make sure to check the last departure time for this tour before moving forward.
        </div>

        <div className="flex flex-col items-center my-5">
          <p className='text-black font-semibold pb-2 text-md md:text-2xl'>Share this Tour on social Media</p>
          <div className='flex'>
            <Image src={assets.facebook_icon} width={50} alt='' />
            <Image src={assets.twitter_icon} width={50} alt='' />
            <Image src={assets.googleplus_icon} width={50} alt='' />
          </div>
        </div>
      </div>

      <Footer />
    </> : <>
      <div className='flex p-5 text-5xl justify-center'>
        <h1 className='self-center'>No Tours Are Available</h1>
      </div>
    </>
  );
};

export default page;