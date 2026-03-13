"use client";
import React, { useState } from 'react'
import axios from 'axios'
import { useUser } from '../../../context/UserContext'

const Tourdetailinfo = ({ data }) => {
  const { setTourdetailinfo } = useUser()
  if (!data) return null
  const id = data?._id
  const [tourstatus, setTourstatus] = useState(data?.status || "pending")
  const updateStatus = async (e) => {
    const status = e.target.value
    setTourstatus(status)
    const updatedData = {
      id: id,
      status: status
    }

    try {
      const res = await axios.patch('/api/BookingTour', updatedData)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-white/90 z-40'>
      <div className='flex justify-center items-center h-full'>

        <div className='flex flex-col w-9/10 md:w-[320px] py-2 bg-gray-100 shadow-lg rounded-lg'>

          <div className='flex flex-col gap-1 px-5 py-1'>
            <button
              className="text-2xl text-end cursor-pointer"
              onClick={() => setTourdetailinfo(false)}
            >
              X
            </button>

            <h1 className="text-2xl text-center font-bold">
              Trip Detail
            </h1>
          </div>

          <div className='flex flex-col px-3 py-2 gap-2 text-sm'>

            <p><b>User Name :</b> {data?.name}</p>

            <p>
              <b>Gender :</b> {data?.gender} ({data?.age} years)
            </p>

            <p>
              <b>Schedule :</b> {data?.tourstartdate} - {data?.tourenddate}
            </p>

            <p>
              <b>PhoneNo :</b> {data?.phoneno}
            </p>

            <p>
              <b>Email :</b> {data?.email}
            </p>

            <p>
              <b>Tour Name :</b> {data?.tourname}
            </p>

            <p>
              <b>Slot Id :</b> {data?.tourslotid}
            </p>

            <p>
              <b>Vehicle Type :</b> {data?.vehicletype}
            </p>

            <p>
              <b>Location :</b> {data?.pickupaddress}
            </p>

            <p>
              <b>Balance :</b> {data?.remainingamount}
            </p>

            <p className='flex items-center gap-2'>
              <b>Status :</b>

              <select
                className="px-3 py-1 outline-none border rounded text-red-500"
                value={tourstatus}
                onChange={updateStatus}
              >
                <option value="pending">Pending</option>
                <option value="waiting">Waiting</option>
                <option value="confirm">Confirm</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>

            </p>

          </div>

        </div>

      </div>
    </div>
  )
}

export default Tourdetailinfo