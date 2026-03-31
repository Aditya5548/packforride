import Image from "next/image";
import { useRouter } from 'next/router';
import { assets } from '../../assets/assets';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import Bookingpanel from './Bookingpanel';
import { useEffect, useState } from "react";
import Userlogin from "../../Components/Userlogin";
import UserReg from "../../Components/UserReg";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
import dynamic from "next/dynamic";
const MapComponentInner = dynamic(() => import('../../Components/MapComponent'), {
  ssr: false,
});
import { AirVent, ArrowRight, BedSingle, BusFront, Clock, MapPin, PlugZap, User, Wifi } from 'lucide-react';

import "react-datepicker/dist/react-datepicker.css";
const page = () => {
  const [tourslots, setTourslots] = useState([])
  const [noofpeople, setNoofPeople] = useState();
  const { paymentpanel, setPaymentPanel } = useUser();
  const {distance, setDistance} = useUser();
  const { showhide, setShowhide } = useUser();
  const { showhideoptions, setShowhideoptions } = useUser();
  const [displaydetail,setDisplayDetail]=useState(false);
const {endPos, setEndPos} = useUser(null);
  
  const [facilities, setFacilities] = useState({
  ac: false,
  food: false,
  room: false
});
  const [tourcost,setTourcost]=useState({totalfair:"",accharges:"",roomcharges:"",foodingcharges:"",totalcost:""})
  const router = useRouter();
  const data = router.query;
const Calculatecost = () => {
  const people = Number(noofpeople) || 1;
  const dist = Number(distance) || 0;

  // 🚗 1. Distance slab pricing (₹/km)
  let pricePerKm = 12;

  if (dist > 50) pricePerKm = 10;
  if (dist > 150) pricePerKm = 8;
  if (dist > 300) pricePerKm = 6;

  // 💰 2. Base fare
  let baseFare = dist * pricePerKm;

  // 👥 3. Group discount
  let discount = 0;
  if (people >= 5) discount = 0.1;     // 10%
  if (people >= 10) discount = 0.2;    // 20%

  baseFare = baseFare - baseFare * discount;

  // 🏨 4. Facility dynamic pricing (percentage based)
  let accharges = facilities.ac ? baseFare * 0.15 : 0;     // 15%
  let roomcharges = facilities.room ? baseFare * 0.25 : 0; // 25%
  let foodingcharges = facilities.food ? baseFare * 0.2 : 0; // 20%

  // 👤 5. Per person multiply
  let totalfair = baseFare * people;

  // 💵 6. Total cost
  let totalcost =
    totalfair + accharges + roomcharges + foodingcharges;

  // 🎯 7. Budget optimization (auto adjust)
  const perPersonCost = totalcost / people;

  if (perPersonCost > 3000) {
    // remove expensive options automatically
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
    totalcost: Math.round(totalcost)
  });
  setDisplayDetail(true)
};
  const paymentdashopen = () => {
    const token = localStorage.getItem('usertoken')
    if (!token) {
      setShowhide(true)
      setShowhideoptions("login")
    }
    else {
      if (!tourcost.totalcost) {
        toast.error("Enter no of Peoples")
      }
      else { setPaymentPanel(true) }
    }

  };

  const handleFacilityChange = (type, value) => {
  setFacilities((prev) => ({
    ...prev,
    [type]: value === "Yes"
  }));
};


  useEffect(() => {
    fetch('/tourslotslist.json')
      .then((res) => res.json())
      .then((result) => setTourslots(result))
  }, [])

  return (
    data ? <>
      <div className='bg-gray-300 pb-5'>
        <Navbar />
        <ToastContainer />
        <div className="text-center mb-20 mt-5">
          <h1 className="text-xl sm:text-2xl font-semibold max-w-[700px] mx-auto pb-2">{data.category} Tour</h1>
        </div>
      </div>
      <div className="flex flex-col items-center mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image src={null || data.image} width={400} height={300} alt='' className='border-4 border-white' />
        <div className='self-start text-justify'>
          <p className='text-xl sm:text-2xl font-semibold py-2'>{data.tourname}</p>
          <p className='pt-3'>{data.description}</p>
          <div className='py-3'>
            <p className='text-xl font-semibold'>Facilities Involved:</p>
            <div>
              <p>Tranport: {data.transport}</p>
              <p>Room: {data.room}</p>
              <p>Fooding: {data.fooding}</p>
              <p>No of Days: 5 Days </p>
            </div>
          </div>

          <div className='pt-3'>
            <p className='text-xl font-semibold'>Traveling option:</p>
            <div className='flex flex-wrap justify-center gap-5 pt-2'>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Family</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Friends</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Indivisual</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Groups</button>
            </div>
          </div>
          

          {showhide ? showhideoptions == "login" ? <Userlogin /> : showhideoptions == "signup" ? <UserReg /> : "" : ""}
          {paymentpanel && <Bookingpanel charges={tourcost} locationid={endPos} facilities={facilities} passenger={noofpeople} tourdata={data} />}

          <div className="flex flex-col py-5 md:py-10">
            <MapComponentInner startPos={[26.8536, 80.9890]} />
            <div />

          <div className="w-full max-w-xl mx-auto my-10 p-5 rounded-xl shadow-md bg-gray-50">

  <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
    Trip Cost Calculator
  </h1>

  {/* People Input */}
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

  {/* Facilities */}
  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">

    <div>
      <p className="font-medium">AC</p>
      <select
        className="w-full border rounded-md p-1 mt-1"
        onChange={(e) => handleFacilityChange("ac", e.target.value)}
      >
        <option>Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>

    <div>
      <p className="font-medium">Food</p>
      <select
        className="w-full border rounded-md p-1 mt-1"
        onChange={(e) => handleFacilityChange("food", e.target.value)}
      >
        <option>Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>

    <div>
      <p className="font-medium">Room</p>
      <select
        className="w-full border rounded-md p-1 mt-1"
        onChange={(e) => handleFacilityChange("room", e.target.value)}
      >
        <option>Select</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>

  </div>

  {/* Button */}
  <button
    onClick={Calculatecost}
    className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
  >
    Calculate Cost
  </button>

  {/* Result */}
  {displaydetail && (
    <div className="mt-4 p-3 border rounded-md bg-gray-50 animate-fadeIn">

      {facilities.ac && <p>AC: ₹{tourcost.accharges}</p>}
      {facilities.food && <p>Food: ₹{tourcost.foodingcharges}</p>}
      {facilities.room && <p>Room: ₹{tourcost.roomcharges}</p>}

      <hr className="my-2"/>

      <p className="font-semibold">
        Total: ₹{tourcost.totalcost} + ₹1000(GST + Charges)
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
          
            <div />
          </div>
          <div className='py-1'>
            <p className='text-xl font-semibold'>Important Notes</p>
            <div className='flex flex-wrap justify-center gap-5 pt-2 text-xs w-9/10'>
              ➢  All tour timings are in Pack & go platform. <br />
              ➢  For immigration clearance purposes, be sure to allocate 90 minutes before the tour and 60 minutes before your boarding time (upon the tour's completion). <br />
              ➢  Availability of seats is not guaranteed on same-day bookings, please visit the Discover Qatar Transit Tour desk as soon as possible to secure your preferred tour timings. <br />
              ➢  Please make sure to check the last departure time for this tour before moving forward.
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className='text-black font-semibold my-2'>Share this Tour on social Media</p>
            <div className='flex'>
              <Image src={assets.facebook_icon} width={50} alt='' />
              <Image src={assets.twitter_icon} width={50} alt='' />
              <Image src={assets.googleplus_icon} width={50} alt='' />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </> : <>
      <div className='flex p-5 text-5xl justify-center'>
        <h1 className='self-center'>No Tours Are Available</h1>
      </div>

    </>

  )
}

export default page
