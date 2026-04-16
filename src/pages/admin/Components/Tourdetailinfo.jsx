"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../../context/UserContext';
import { toast } from 'react-toastify';

const Tourdetailinfo = ({ data }) => {
  const { setTourdetailinfo } = useUser();
  if (!data) return null;

  const id = data?._id;
  const [tourstatus, setTourstatus] = useState(data?.status || "pending");

  // Extra info fields
  const [startDate, setStartDate] = useState("");
  const [boardingTime, setBoardingTime] = useState("");
  const [vehicleType, setVehicleType] = useState(data?.vehicletype || "");
  const [days,setDays]=useState("");
  const [messages,setMessages]=useState("");
  const [tempStatus, setTempStatus] = useState(tourstatus);
  const [vehicleNumber, setVehicleNumber] = useState(data?.vehicletype || "");
  console.log(data)
  const handleStatusChange = (e) => {
    setTempStatus(e.target.value);
  };

  const handleUpdate = async () => {
      data = { startDate, days, boardingTime, vehicleType, messages,tempStatus,id:data._id,vehicleNumber:vehicleNumber };
    try {
      const res=await axios.patch('/api/BookingTour', data);
      toast.success('Status updated successfully!');
      setTourstatus(tempStatus);
      console.log(res)
      setTourdetailinfo(false)
    } 
    catch (error) {
      console.log(error)
      toast.error('Failed to update status');
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 overflow-auto'>
      <div className='bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row relative'>
        <div className='absolute top-0 left-0 w-full flex justify-between items-center bg-blue-600 px-5 py-3'>
          <h2 className='text-white text-xl font-bold'>Trip Details</h2>
          <button
            onClick={() => setTourdetailinfo(false)}
            className='text-white text-2xl font-bold hover:text-gray-200'
          >
            ×
          </button>
        </div>
        <div className='flex-1 p-5 mt-14 space-y-3 text-gray-700 text-sm'>
          <div className='flex gap-5'>
            <strong>Tour Id:</strong> <span>{data?._id}</span>
          </div>
          <div className='flex gap-5'>
            <strong>User Name:</strong> <span>{data?.name}</span>
          </div>
          <div className='flex gap-5'>
            <strong>Gender / Age:</strong> <span>{data?.gender} ({data?.age} yrs)</span>
          </div>
          <div className='flex  gap-5'>
            <strong>Phone:</strong> <span>{data?.phoneno}</span>
          </div>
          <div className='flex  gap-5'>
            <strong>Email:</strong> <span>{data?.email}</span>
          </div>
          <div className='flex  gap-5'>
            <strong>Tour Name:</strong> <span>{data?.tourname}</span>
          </div>
          <div className='flex '>
            <strong>Pickup Location:</strong> <span>{data?.pickupaddress}</span>
          </div>
          <div className='flex  gap-5'>
            <strong>Amount:</strong> <span>₹ {data?.totalamount}</span>
          </div>
          <div className='flex  gap-5'>
            <strong>No of People:</strong> <span>{data?.noofPeople}</span>
          </div>
          <div className='flex  gap-5'>
            <strong>Total Distance:</strong> <span>{data?.distance} Km</span>
          </div>
          <div className='flex gap-5 items-center mt-3'>
            <strong>Update Status:</strong>
            <select
              className={`px-3 py-1 border rounded font-semibold
                ${tempStatus === 'pending' && 'text-yellow-600'}
                ${tempStatus === 'waiting' && 'text-orange-500'}
                ${tempStatus === 'confirm' && 'text-green-600'}
                ${tempStatus === 'rejected' && 'text-red-600'}
                ${tempStatus === 'cancelled' && 'text-gray-500'}
              `}
              value={tempStatus}
              onChange={handleStatusChange}
            >
              <option value="pending">Pending</option>
              <option value="waiting">Waiting</option>
              <option value="confirm">Confirm</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        {["confirm", "rejected", "cancelled","waiting","pending"].includes(tempStatus) && (
          
          <div  className='flex-1 p-5 md:mt-14 space-y-3 text-gray-700 text-sm'>
            <label className='flex'>
                <span className='font-bold text-md pr-3'>Reason:</span>
                <p>{data?.messages}</p>

            </label>
            {tempStatus === "confirm" && (
              <>
                <label className='flex flex-col'>
                  <span className='font-semibold'>Tour Start Date:</span>
                  <input type="date" className='border px-2 py-1 rounded' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='font-semibold'>No of Days:</span>
                  <input type="text" className='border px-2 py-1 rounded' value={days} onChange={(e) => setDays(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='font-semibold'>Boarding Time:</span>
                  <input type="time" className='border px-2 py-1 rounded' value={boardingTime} onChange={(e) => setBoardingTime(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='font-semibold'>Vehicle Name:</span>
                  <input type="text" className='border px-2 py-1 rounded' value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='font-semibold'>Vehicle Number:</span>
                  <input type="text" className='border px-2 py-1 rounded' value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
                </label>
                <label className='flex flex-col'>
                  <span className='font-semibold'>Message:</span>
                  <input type="text" className='border px-2 py-1 rounded' value={messages} onChange={(e) => setMessages(e.target.value)} />
                </label>
                <button
              onClick={handleUpdate}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2'
            >
              Update
            </button>
              </>
            )}
            {["rejected", "cancelled","waiting"].includes(tempStatus) && (
              <>
              <label className='flex flex-col'>
                <span className='font-semibold'>Reason:</span>
                <textarea className='border px-2 py-1 rounded' value={messages} onChange={(e) => setMessages(e.target.value)} />
              </label>
              <button
              onClick={handleUpdate}
              className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2'
            >
              Update
            </button>
              </>
            )}

            
          </div>
        )}

      </div>
    </div>
  );
};

export default Tourdetailinfo;