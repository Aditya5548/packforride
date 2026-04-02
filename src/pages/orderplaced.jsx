"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useRouter } from "next/navigation";
import {
  AirVent,
  BedSingle,
  PlugZap,
  Wifi,
} from "lucide-react";

const OrderPlaced = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH DATA
  const fetchdata = async () => {
    try {
      const token = localStorage.getItem("usertoken");

      const userinfo = await axios.get("/api/user", {
        params: { token },
      });

      const res = await axios.get("/api/BookingTour", {
        params: {
          userid: userinfo.data.userid,
          fetchtype: "user",
        },
      });

      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


    const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("usertoken");

    if (!token) {
      router.push("/"); // 🔥 redirect to home
    }
  }, []);
  useEffect(() => {
    fetchdata();
  }, []);
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <Navbar />

      <div className="px-4 md:px-8 pb-2">
        <h1 className="text-xl md:text-3xl font-bold mb-4">
          My Bookings
        </h1>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow animate-pulse"
              >
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mt-3"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            🚫 No Bookings Found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md p-4 border hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
              
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">
                    {order.tourname}
                  </h2>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "pending"
                        ? "bg-orange-100 text-orange-600"
                        : order.status === "rejected"
                        ? "bg-red-100 text-red-600"
                        : order.status === "waiting"
                        ? "bg-yellow-100 text-yellow-600"
                        : order.status === "cancelled"
                        ? "bg-gray-200 text-gray-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* INFO */}
                <div className="text-sm text-gray-600 space-y-[2px]">
                  <p><b>Name:</b> {order.name}</p>
                  <p><b>People:</b> {order.noofPeople}</p>
                  <p><b>Phone:</b> {order.phoneno}</p>
                  <p><b>Email:</b> {order.email}</p>
                  <p><b>Address:</b> {order.pickupaddress}</p>
                  {order.startdate && <p><b>Tour Start Date:</b> {order.startdate}</p>}
                  {order.startdate && <p><b>Days Required:</b> {order.days}</p>}
                  {order.startdate && <p><b>Boarding Time</b> {order.boardingtime}</p>}
                </div>

                {/* FACILITIES */}
                <div className="flex gap-2 mt-2 text-gray-600">
                  {<Wifi size={18} />}
                  {<PlugZap size={18} />}
                  {order.facilities?.ac && <AirVent size={18} />}
                  {order.facilities?.bed && <BedSingle size={18} />}
                </div>
                {/* 🔥 STATUS MESSAGE */}
                <div className="mt-3 text-xs text-gray-500 bg-gray-100 p-2 rounded">
                 <strong className="font-bold">Message:  </strong> {order.messages}
                </div>
                {/* <div className="flex gap-1 mt-3">
                  <button className="flex-1 bg-black text-white py-1.5 rounded-lg hover:bg-gray-800 text-xs">
                    Track
                  </button>
                  <button className="flex-1 bg-gray-700 text-white py-1.5 rounded-lg hover:bg-gray-800 text-xs">
                    Cancel
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderPlaced;