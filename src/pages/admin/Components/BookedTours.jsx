"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Tourdetailinfo from "./Tourdetailinfo";
import { useUser } from "../../../context/UserContext";

const BookedTours = () => {
  const [data, setData] = useState([]);
  const [selecteddata, setSelecteddata] = useState(null);
  const { tourdetailinfo, setTourdetailinfo } = useUser();
  const fetchdata = async () => {
    try {
      const res = await axios.get("/api/BookingTour", { params: { fetchtype: "admin" } });
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="flex flex-col items-center pt-5 px-4 sm:pt-12 sm:px-8 lg:px-16 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Booked Tours</h2>

      {/* Desktop / Tablet Table */}
      <div className="hidden sm:block w-full overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        {/* Table Header */}
        <div className="min-w-[650px] flex bg-gray-800 text-white font-semibold text-center">
          <p className="w-1/5 py-3 px-4 border-r border-gray-600 text-left">Email</p>
          <p className="w-3/20 py-3 px-2 border-r border-gray-600">No of People</p>
          <p className="w-3/20 py-3 px-2 border-r border-gray-600">Amount</p>
          <p className="w-1/5 py-3 px-2 border-r border-gray-600">Address</p>
          <p className="w-3/20 py-3 px-2 border-r border-gray-600">Status</p>
          <p className="w-3/20 py-3 px-2">Action</p>
        </div>

        {/* Table Body */}
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="min-w-[650px] flex items-center border-b hover:bg-gray-50 transition-colors text-center"
            >
              <p className="w-1/5 py-3 px-4 border-r border-gray-200 text-left break-all">{item.email}</p>
              <p className="w-3/20 py-3 px-2 border-r border-gray-200">{item.noofPeople}</p>
              <p className="w-3/20 py-3 px-2 border-r border-gray-200">₹ {item.totalamount}</p>
              <p className="w-1/5 py-3 px-2 border-r border-gray-200">{item.pickupaddress}</p>
              <p
                className={`w-3/20 py-3 px-2 border-r border-gray-200 font-medium ${
                  item.status === "Pending"
                    ? "text-yellow-600"
                    : item.status === "Confirmed"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {item.status}
              </p>
              <div className="w-3/20 py-3 px-2 flex justify-center">
                <button
                  onClick={() => {
                    setTourdetailinfo(true);
                    setSelecteddata(item);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-md"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500 min-w-[650px]">No bookings available</p>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden w-full flex flex-col gap-4">
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-lg shadow-md p-4 flex flex-col gap-2"
            >
              <p className="font-semibold break-all">{item.email}</p>
              <span><strong>No of People: </strong>{item.noofPeople}</span>
              <span><strong>Amount:</strong> ₹{item.totalamount}</span>
              <span><strong>Address: </strong>{item.pickupaddress}</span>
              
              <div className="flex justify-between items-center">
                <span
                  className={`font-medium ${
                    item.status === "Pending"
                      ? "text-yellow-600"
                      : item.status === "Confirmed"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {item.status}
                </span>
                <button
                  onClick={() => {
                    setTourdetailinfo(true);
                    setSelecteddata(item);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No bookings available</p>
        )}
      </div>

      {/* Tour Detail Modal */}
      {tourdetailinfo && selecteddata && <Tourdetailinfo data={selecteddata} />}
    </div>
  );
};

export default BookedTours;