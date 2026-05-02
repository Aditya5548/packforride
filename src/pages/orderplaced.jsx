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
  X,
  CheckCircle,
  Clock,
  XCircle,
  CircleDot,
} from "lucide-react";

const getStatus = (order) => {
  return order?.status || order?.statusHistory?.[order.statusHistory.length - 1]?.status || "pending";
};

const getMessage = (order) => {
  return order?.messages || order?.statusHistory?.[order.statusHistory.length - 1]?.message || "";
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyle = {
  pending: "bg-orange-100 text-orange-600",
  waiting: "bg-yellow-100 text-yellow-700",
  confirm: "bg-green-100 text-green-600",
  rejected: "bg-red-100 text-red-600",
  cancelled: "bg-gray-200 text-gray-600",
};

const statusIcon = {
  pending: <Clock size={14} />,
  waiting: <CircleDot size={14} />,
  confirm: <CheckCircle size={14} />,
  rejected: <XCircle size={14} />,
  cancelled: <XCircle size={14} />,
};

const OrderPlaced = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackOrder, setTrackOrder] = useState(null);

  const router = useRouter();

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

  const cancelBooking = async (id) => {
    try {
      await axios.patch("/api/BookingTour", {
        id,
        tempStatus: "cancelled",
        messages: "Booking cancelled by user",
      });

      fetchdata();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    if (!token) router.push("/");
  }, []);

  useEffect(() => {
    fetchdata();
  }, []);

  return (
    <div className="flex flex-col justify-between min-h-screen bg-gray-50">
      <Navbar />

      <div className="px-4 md:px-8 py-4">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow animate-pulse">
                <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-2 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 bg-gray-200 rounded mb-1"></div>
                <div className="h-2 bg-gray-200 rounded mb-1"></div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-xs">
            No Bookings Found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.map((order, index) => {
              const currentStatus = getStatus(order);
              const currentMessage = getMessage(order);

              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-3 border hover:shadow-md transition text-xs"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h2 className="font-semibold text-sm truncate">
                      {order.tourname}
                    </h2>

                    <span
                      className={`px-2 py-[2px] rounded-full text-[10px] ${
                        statusStyle[currentStatus] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>

                  <div className="text-gray-600 space-y-[2px]">
                    <p><b>Name:</b> {order.name}</p>
                    <p><b>People:</b> {order.noofPeople}</p>
                    <p><b>Phone:</b> {order.phoneno}</p>
                    <p className="truncate"><b>Email:</b> {order.email}</p>
                  </div>

                  <div className="flex gap-2 mt-2 text-gray-500">
                    <Wifi size={14} />
                    <PlugZap size={14} />
                    {order.facilities?.ac && <AirVent size={14} />}
                    {order.facilities?.bed && <BedSingle size={14} />}
                  </div>

                  <div className="mt-2 text-[10px] bg-gray-100 p-2 rounded">
                    <strong>Msg:</strong> {currentMessage || "-"}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setTrackOrder(order)}
                      className="flex-1 bg-gray-800 text-white py-1 rounded-md text-[10px] hover:bg-black transition"
                    >
                      Track
                    </button>

                    {currentStatus !== "cancelled" && currentStatus !== "rejected" && (
                      <button
                        onClick={() => cancelBooking(order._id)}
                        className="flex-1 bg-red-500 text-white py-1 rounded-md text-[10px] hover:bg-red-600 transition"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {trackOrder && (
        <TrackPopup order={trackOrder} onClose={() => setTrackOrder(null)} />
      )}

      <Footer />
    </div>
  );
};

const TrackPopup = ({ order, onClose }) => {
  const currentStatus = getStatus(order);
  const history = order?.statusHistory || [];

return (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3">
    
    {/* Popup Box */}
    <div className="w-[600px] max-w-[calc(100vw-20px)] bg-white rounded-xl shadow-xl overflow-hidden text-xs">

      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-900 text-white">
        <div>
          <h2 className="text-sm font-semibold">Booking Tracking</h2>
          <p className="text-[10px] text-gray-300">{order.tourname}</p>
        </div>

        <button onClick={onClose} className="hover:text-gray-300">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 max-h-[75vh] overflow-auto">

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 border rounded-lg p-3 mb-4">
          <Info label="Booking Date" value={formatDate(order.bookingdate || order.createdAt)} />
          <Info label="Required Date" value={formatDate(order.reqdate)} />
          <Info label="People" value={order.noofPeople} />
          <Info label="Amount" value={`₹ ${order.totalamount || 0}`} />
        </div>

        {/* Confirm Details */}
        {currentStatus === "confirm" && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <h3 className="text-xs font-semibold text-green-700 mb-2">
              Confirmed Trip Details
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <Info label="Start Date" value={formatDate(order.startdate)} />
              <Info label="No. of Days" value={order.days || "-"} />
              <Info label="Boarding Time" value={order.boardingtime || "-"} />
              <Info label="Vehicle Type" value={order.vehicletype || "-"} />
              <Info label="Vehicle Number" value={order.vehiclenumber || "-"} />
            </div>
          </div>
        )}

        {/* Timeline Title */}
        <h3 className="text-xs font-semibold text-gray-700 mb-3">
          Status Timeline
        </h3>

        {/* Timeline */}
        <div>
          {history.length === 0 ? (
            <p className="text-gray-500 text-xs">No tracking history found.</p>
          ) : (
            history.map((item, index) => {
              const isLast = index === history.length - 1;

              return (
                <div key={index} className="flex gap-3">
                  
                  {/* Left Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border ${
                        statusStyle[item.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {statusIcon[item.status] || <CircleDot size={14} />}
                    </div>

                    {!isLast && <div className="w-[1px] h-10 bg-gray-300"></div>}
                  </div>

                  {/* Right Content */}
                  <div className="pb-4 flex-1">
                    <div className="flex justify-between">
                      <p className="font-semibold capitalize text-gray-800">
                        {item.status}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {formatDateTime(item.date)}
                      </p>
                    </div>

                    <p className="text-[11px] text-gray-600 mt-1">
                      {item.message || "Status updated"}
                    </p>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  </div>
);
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-gray-400">{label}</p>
    <p className="text-[11px] font-medium text-gray-700 break-words">
      {value || "-"}
    </p>
  </div>
);

export default OrderPlaced;