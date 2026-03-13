import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Mail, PhoneCall, Plus, User, Users, IndianRupee, Calendar } from 'lucide-react'
import { useUser } from '../../../context/UserContext'
const Tourdetailinfo = (props) => {
  const data = props.data
  const id = data?._id
  const { setTourdetailinfo } = useUser();
  console.log(data)
  const [tourstatus,setTourstatus] = useState(data.status)
  const updateStatus=async(e)=>{
    console.log("hii",e.target.value)
    const data={id:id ,status:e.target.value}
    try {
      const res= await axios.patch('/api/BookingTour',data)
      console.log(res.data)
    } catch (error) {
      console.log(error)
    }
    
  }
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-white/90 z-40'>
      <div className='flex justify-center items-center h-full'>
        <div className=' flex flex-col w-9/10 md:w-[300px]  py-2 bg-gray-100 shadow-lg'>
          <div className='flex flex-col gap-1 px-5 py-1'>
            <button className="text-2xl text-end cursor-pointer" onClick={() => { setTourdetailinfo(false) }}>X</button>
            <h1 className="text-2xl text-center font-bold">Trip Detail</h1>
          </div>
          <div className='flex flex-col px-3 py-2 gap-2'>
            <p className='flex items-center gap-2'><b>User Name :</b>  {data.name}</p>
            <p className='flex items-center gap-2'><b>Gender :</b> {data.gender} ({data.age} years)</p>
            <p className='flex items-center gap-2'><b>Schedule :</b> {data.tourstartdate} - {data.tourenddate}</p>
            <p className='flex items-center gap-2'><b>PhoneNo :</b> {data.phoneno}</p>
            <p className='flex items-center gap-2'><b>Email :</b> {data.email}</p>
            <p className='flex items-center gap-2'><b>Tour Name :</b> {data.tourname}</p>
            <p className='flex items-center gap-2'><b>Slot Id :</b> {data.tourslotid}</p>
            <p className='flex items-center gap-2'><b>VehicleType :</b> {data.vehicletype}</p>
            <p className='flex items-center gap-1'><b>Location : </b> {data.pickupaddress}</p>
            <p className='flex items-center gap-2'><b>Balance :</b> {data.remainingamount}</p>
            <p className='flex items-center gap-2'><b>Status :</b> 
            <select name="accessries" className="px-4 outline-none text-xl text-red-500" value={tourstatus} onChange={updateStatus}>
              <option value="pending">Pending</option>
              <option value="waiting">Waiting</option>
              <option value="confirm">Confirm</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            </p>
          </div>
          {/* <div className='flex gap-2 justify-center'>
            <button className='bg-red-500 px-5 text-white w-fit font-bold self-center rounded-md py-2 my-2 cursor-pointer'>Edit</button>
            <button className='bg-red-500 px-5 text-white w-fit font-bold self-center rounded-md py-2 my-2 cursor-pointer'>Delete</button>
          </div> */}
        </div>
      </div>

    </div>
  )
}

export default Tourdetailinfo
