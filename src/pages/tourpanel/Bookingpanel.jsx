"use client";
import React, { useState } from "react";
import axios from "axios";
import { Mail, PhoneCall, Plus, User, Users, MapPin } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from 'next/router'

const Bookingpanel = ({ charges, passenger, tourdata, facilities ,locationid}) => {
  const { setPaymentPanel } = useUser();
  const { tourname, _id } = tourdata;
  const [address,setAddress]=useState("")
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
   const router = useRouter();

  const goHome = () => {
    router.push('/');
  };

  const regcode = async (e) => {
  e.preventDefault();
  setLoading(true);
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("usertoken")
      : null;
  try {
    const userinfo = await axios.get("/api/user", {
      params: { token: token },
    });
    const data = {
      name,
      age,
      gender,
      email,
      phoneno,
      totalamount:charges.totalcost+1000,
      passenger,
      tourname,
      tourid: _id,
      userid: userinfo.data.userid,
      locationid: locationid,
      pickupaddress: address,
      facilities: facilities,
    };

    const response = await axios.post("/api/BookingTour", data);

    // ⏳ 10 sec loader
    setTimeout(() => {
      setLoading(false);

      if (response.data.success) {
        setPaymentSuccess(true); // show success screen
      } else {
        toast.error("Payment Failed");
      }
    }, 4000);

  } catch (error) {
    setLoading(false);
    toast.error("Something went wrong");
  }
};

    const phonenofilter = (e) => {
    const value = e.target.value;

    if (value.length <= 10) {
      setPhoneno(value);
    }
  };

      const agefilter = (e) => {
    const value = e.target.value;

    if (value.length <= 2) {
      setAge(value);
    }
  };

  return (

    

    <div className="fixed top-0 left-0 w-screen h-screen bg-white/90 z-100">
      <div className="flex justify-center items-center h-full">

        <ToastContainer />

        <div className="flex flex-col w-9/10 md:w-[400px] py-3 bg-gray-200 rounded-lg">

          <div className="flex flex-col gap-2 px-5 py-1">
            <button
              className="text-2xl text-end cursor-pointer"
              onClick={() => setPaymentPanel(false)}
            >
              X
            </button>

            <h1 className="text-2xl text-center font-bold">
              Register Booking
            </h1>
          </div>

          <form className="pt-5" onSubmit={regcode}>

            <p className="flex gap-2 items-center mx-5 my-2 px-3 py-1">
              <b>Tourname:</b> {tourname}
            </p>
            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <User />
              <input
                className="outline-none px-5 py-1 w-full"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </p>

            <div className="flex gap-3 bg-white mx-5 my-2 px-3 py-1">
      <Users className="text-gray-500" />
      <label className="text-sm">
        <input type="radio" name="Gender" value="male" onChange={(e) => setGender(e.target.value)} /> Male
      </label>
      <label className="text-sm">
        <input type="radio" name="Gender" value="female" onChange={(e) => setGender(e.target.value)} /> Female
      </label>
      <label className="text-sm">
        <input type="radio" name="Gender" value="other" onChange={(e) => setGender(e.target.value)} /> Other
      </label>
            </div>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <Plus />
              <input
                className="outline-none px-5 py-1 w-full"
                type="number"
                placeholder="Age"
                value={age}
                min={18}
                max={70}
                onChange={agefilter}
                required
              />
            </p>
            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <MapPin />
              <input
                className="outline-none px-5 py-1 w-full"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e)=>{setAddress(e.target.value)}}
                required
              />
            </p>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <Mail />
              <input
                className="outline-none px-5 py-1 w-full"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </p>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <PhoneCall />
               <input type="number" pattern="[0-9]{10}" minLength={10} maxLength={10} placeholder='Phone No' className="outline-none px-5 py-1 w-full" name="phoneno" value={phoneno} onChange={phonenofilter} required />
            </p>
            <p className="flex gap-2 items-center mx-5 px-3 py-1 mt-4">
              <b>Total Amount:</b> ₹ {charges.totalcost+1000}
            </p>      
            <p className="flex justify-center">
    <button
      type="submit"
      className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition px-4 py-2 my-4"
    >
      Proceed For Payment →
    </button>
            </p>
            

          </form>

        </div>

{loading && (
  <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex flex-col justify-center items-center z-50 text-white">

    {/* Spinner */}
    <div className="relative flex justify-center items-center">
      <div className="w-20 h-20 border-4 border-white/30 rounded-full"></div>
      <div className="absolute w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>

    {/* Heading */}
    <h1 className="text-2xl font-bold mt-6 tracking-wide">
      Processing Payment
    </h1>

    {/* Sub text */}
    <p className="mt-2 text-blue-100 text-center px-6">
      Please wait while we confirm your payment...
    </p>

    {/* Progress Bar */}
    <div className="w-64 h-2 bg-white/30 rounded-full mt-6 overflow-hidden">
      <div className="h-full bg-white animate-[loading_10s_linear_forwards]"></div>
    </div>

    {/* Bottom Note */}
    <p className="text-sm mt-4 text-blue-200">
      Do not refresh or close this page
    </p>

    {/* Animation style */}
    <style jsx>{`
      @keyframes loading {
        from { width: 0%; }
        to { width: 100%; }
      }
    `}</style>

  </div>
)}

{paymentSuccess && (
  <div className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-green-300 to-green-400 flex flex-col justify-center items-center z-50 text-white">
    
    {/* Success Circle */}
    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg animate-bounce">
      <svg
        className="w-12 h-12 text-green-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>

    {/* Title */}
    <h1 className="text-3xl font-bold mt-6 tracking-wide">
      Payment Successful
    </h1>

    {/* Subtitle */}
    <p className="mt-2 text-lg text-green-50 text-center px-5">
      <span>Your booking has been confirmed 🎉</span> <br />
      <span>Booking Detail Will shared Shorting in your email and Mobile Number</span>
    </p>

    {/* Details Box */}
    <div className="bg-white/10 backdrop-blur-md mt-6 px-6 py-4 rounded-xl text-center">
      <p className="text-sm">Amount Paid</p>
      <h2 className="text-2xl font-bold mt-1">₹ {charges.totalcost+1000}</h2>
    </div>

    {/* Button */}
    <button
      className="mt-4 bg-white text-green-600 px-6 py-2 rounded-full font-semibold shadow-md hover:scale-105 transition"
      onClick={() => {
        setPaymentSuccess(false);
        setPaymentPanel(false);
        goHome();
      }}
    >
      Back to Home
    </button>

  </div>
)}

      </div>
    </div>



  );
};




export default Bookingpanel;