"use client";

import React, { useState } from "react";
import axios from "axios";
import {
  Mail,
  PhoneCall,
  Plus,
  User,
  Users,
  MapPin,
  X,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  Home,
  CalendarDays,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";

const Bookingpanel = ({
  charges,
  passenger,
  tourdata,
  facilities,
  locationid,
  distance,
  boardingdate,
}) => {
  const { setPaymentPanel } = useUser();
  const { tourname, _id } = tourdata || {};

  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const router = useRouter();

  const regcode = async (e) => {
    e.preventDefault();

    if (!gender) {
      toast.error("Please select gender");
      return;
    }

    if (phoneno.length !== 10) {
      toast.error("Enter valid 10 digit phone number");
      return;
    }

    setLoading(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("usertoken") : null;

    try {
      const userinfo = await axios.get("/api/user", {
        params: { token },
      });

      const bookingData = {
        name,
        age,
        gender,
        email,
        phoneno,
        totalamount: charges,
        passenger,
        tourname,
        tourid: _id,
        userid: userinfo.data.userid,
        locationid,
        pickupaddress: address,
        facilities,
        distance,
        boardingdate,
      };

      const response = await axios.post("/api/BookingTour", bookingData);

      setTimeout(() => {
        setLoading(false);

        if (response.data.success) {
          setPaymentSuccess(true);
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
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) setPhoneno(value);
  };

  const agefilter = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 2) setAge(value);
  };

  const inputClass =
    "w-full bg-transparent outline-none text-xs text-slate-700 placeholder:text-slate-400";

  const fieldClass =
    "flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3 py-2.5 focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100 transition";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-sm flex items-center justify-center px-4 py-5"
      >
        <ToastContainer />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.96 }}
          className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-[28px] border border-gray-100 bg-gradient-to-br from-white via-rose-50/30 to-white shadow-[0_25px_70px_rgba(127,29,29,0.16)]"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b  bg-white/70 backdrop-blur">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-900">
                Secure Booking
              </p>
              <h2 className="text-base font-bold text-slate-900">
                Register Booking
              </h2>
            </div>

            <button
              onClick={() => setPaymentPanel(false)}
              className="w-8 h-8 rounded-full bg-rose-50 border border-gray-100 text-gray-500 flex items-center justify-center transition"
            >
              <X size={15} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <section className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-2xl bg-rose-50 border border-gray-100 flex items-center justify-center text-gray-500">
                  <CreditCard size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Booking Summary
                  </h3>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-2xl  border border-gray-100 p-3">
                  <p className="text-[10px] text-slate-500">Tour Name</p>
                  <p className="mt-1 font-semibold text-slate-900 line-clamp-2">
                    {tourname || "Tour"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white border border-gray-100 p-3">
                    <p className="text-[10px] text-slate-500">Passenger</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {passenger || "--"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white border border-gray-100 p-3">
                    <p className="text-[10px] text-slate-500">Distance</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {distance ? `${distance} km` : "--"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white border border-gray-100 p-3">
                  <div className="flex items-center gap-2">
                    <CalendarDays size={14} className="text-gray-500" />
                    <div>
                      <p className="text-[10px] text-slate-500">
                        Boarding Date
                      </p>
                      <p className="font-semibold text-slate-900">
                        {boardingdate || "--"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl to-red-50 border border-gray-100 p-4">
                  <p className="text-[10px] text-slate-500">Payable Amount</p>
                  <p className="mt-1 text-2xl font-bold">
                    ₹ {charges}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[22px] border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Traveler Details
                </h3>
                <p className="text-[10px] text-slate-500 mt-1">
                  Enter correct details for booking confirmation.
                </p>
              </div>

              <form onSubmit={regcode} className="space-y-2.5">
                <div className={fieldClass}>
                  <User size={14} className="text-gray-500 shrink-0" />
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="rounded-xl border border-gray-100 bg-white px-3 py-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={14} className="text-gray-500 shrink-0" />
                    <p className="text-xs font-medium text-slate-700">Gender</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["male", "female", "other"].map((item) => (
                      <label
                        key={item}
                        className={`cursor-pointer rounded-lg border px-2 py-1.5 text-center text-[10px] capitalize transition ${
                          gender === item
                            ? "border-gray-100 bg-gray-200 text-black font-semibold"
                            : "border-gray-100  text-slate-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="Gender"
                          value={item}
                          className="hidden"
                          onChange={(e) => setGender(e.target.value)}
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className={fieldClass}>
                    <Plus size={14} className="text-gray-500 shrink-0" />
                    <input
                      className={inputClass}
                      type="text"
                      inputMode="numeric"
                      placeholder="Age"
                      value={age}
                      onChange={agefilter}
                      required
                    />
                  </div>

                  <div className={fieldClass}>
                    <PhoneCall size={14} className="text-gray-500 shrink-0" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Phone"
                      className={inputClass}
                      value={phoneno}
                      onChange={phonenofilter}
                      required
                    />
                  </div>
                </div>

                <div className={fieldClass}>
                  <Mail size={14} className="text-gray-500 shrink-0" />
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className={fieldClass}>
                  <MapPin size={14} className="text-gray-500 shrink-0" />
                  <input
                    className={inputClass}
                    type="text"
                    placeholder="Pickup address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white py-2.5 text-xs font-semibold shadow-md shadow-rose-100 transition"
                >
                  Proceed Payment
                  <ArrowRight size={14} />
                </button>
              </form>
            </section>
          </div>
        </motion.div>

        {loading && (
          <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-blue-400 px-5 text-white">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 rounded-full border-4 border-white/25"></div>
              <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
              <CreditCard size={20} className="absolute" />
            </div>

            <h1 className="mt-5 text-lg font-bold">Processing Payment</h1>
            <p className="mt-2 max-w-sm text-center text-xs leading-5 text-rose-50">
              Please wait, confirming your booking...
            </p>
          </div>
        )}

        {paymentSuccess && (
          <div className="fixed inset-0 z-[130] flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 px-5 text-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
            </div>

            <h1 className="mt-5 text-center text-xl font-bold">
              Payment Successful
            </h1>

            <p className="mt-2 max-w-sm text-center text-xs leading-5 text-emerald-50">
              Your booking is confirmed. Details will be shared shortly.
            </p>

            <div className="mt-5 rounded-2xl border border-white/20 bg-white/15 px-6 py-3 text-center">
              <p className="text-[10px]">Amount Paid</p>
              <h2 className="mt-1 text-2xl font-bold">₹ {charges}</h2>
            </div>

            <button
              className="mt-5 flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-emerald-600 shadow-md"
              onClick={() => {
                setPaymentSuccess(false);
                setPaymentPanel(false);
                router.push("/");
              }}
            >
              <Home size={14} />
              Back to Home
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Bookingpanel;