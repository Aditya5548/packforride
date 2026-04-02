"use client";
import axios from "axios";
import { format } from "timeago.js";
import useSWR from "swr";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useState } from "react";
const fetcher = (url) => fetch(url).then((res) => res.json());

const TourData = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFkaXR5YTkzNzciLCJpYXQiOjE3NjA1MzM0NzN9.CqdnBoA0eNMwLa7U8dWtDhuw7QLa3tsgbL8Q8hxSvAo";
  const { data, error, isLoading, mutate } = useSWR(`/api/tours?token=${token}`, fetcher);

  // const [status, setStatus] = useState(item.status || "active");
  const [status, setStatus] = useState("active");
  const handleChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      const token = localStorage.getItem("token"); // Or pass as prop
      const res = await axios.patch("/api/tours/status", {
        id: item._id,
        status: newStatus,
        token,
      });

      if (res.data.success) {
        toast.success("Status updated successfully");
        mutate(); // Refresh SWR data
      } else {
        toast.error(res.data.msg || "Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const deletetour = async (tourId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete("/api/tours", { params: { id: tourId, token } });
      if (res.data.msg === "Tour Deleted") {
        toast.success("Tour Deleted Successfully!");
        mutate();
      } else {
        toast.error(res.data.msg);
      }
    } catch (err) {
      toast.error("Error deleting tour");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-3xl">Please Wait...</h2>
          <ClipLoader size={50} color="#000000" loading />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-2xl text-center">
          <h2>OOPS....</h2>
          <h3>There is a connectivity issue.</h3>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center pt-5 px-4 sm:pt-12 sm:px-8 lg:px-16 w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Tours</h2>

      {/* Desktop/Table View */}
      <div className="hidden sm:block w-full overflow-x-auto border border-gray-300 rounded-lg shadow-sm">
        {/* Header */}
        <div className="min-w-[800px] flex bg-gray-800 text-white font-semibold text-center">
          <p className="w-[120px] py-3 px-4 border-r border-gray-600 text-left">Host_Id</p>
          <p className="w-[280px] py-3 px-4 border-r border-gray-600 text-left">Tour Name</p>
          <p className="w-[100px] py-3 px-2 border-r border-gray-600">Category</p>
          <p className="w-[100px] py-3 px-2 border-r border-gray-600">Posted</p>
          <p className="w-[100px] py-3 px-2 border-r border-gray-600">Location</p>
          <p className="w-[150px] py-3 px-2 border-r border-gray-600">Status</p>
          <p className="w-[50px] py-3 px-2">Action</p>
        </div>

        {/* Body */}
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              className="min-w-[800px] flex items-center border-b hover:bg-gray-50 transition-colors text-center"
            >
              <p className="w-[120px] py-3 px-4 border-r border-gray-200 text-left break-all">{item.hostId}</p>
              <p className="w-[280px] py-3 px-4 border-r border-gray-200 text-left break-all">{item.tourname}</p>
              <p className="w-[100px] py-3 px-2 border-r border-gray-200">{item.category}</p>
              <p className="w-[100px] py-3 px-2 border-r border-gray-200">{format(item.createdAt)}</p>
              <p className="w-[100px] py-3 px-2 border-r border-gray-200">{item.city}</p>
              <p className="w-[150px] py-3 px-2 border-r border-gray-200 font-medium">    <select
                value={status}
                onChange={handleChange}
                className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
              >
                <option value="active">Active</option>
                <option value="deactive">Deactive</option>
              </select></p>
              <div className="w-[50px] py-3 px-2">
                <button
                  onClick={() => deletetour(item._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500 min-w-[800px]">No tours available</p>
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
              <p className="font-semibold break-all">{item.tourname}</p>
               <span> <strong>Category: </strong> {item.category}</span>
                <span><strong>Location:</strong> {item.city}</span>
                <span><strong>Posted: </strong> {format(item.createdAt)}</span>
                <select
                  value={item.status}
                  onChange={handleChange}
                  className="border border-gray-300 rounded px-2 py-1 bg-white text-sm"
                >
                  <option value="active">Active</option>
                  <option value="deactive">Deactive</option>
                </select>
              <button
                onClick={() => deletetour(item._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm mt-2"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-center py-6 text-gray-500">No tours available</p>
        )}
      </div>
    </div>
  );
};

export default TourData;