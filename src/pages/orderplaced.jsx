import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from "../Components/Navbar";
import Footer from '../Components/Footer';
import { AirVent, ArrowRight, BedSingle, BusFront, Clock, MapPin, PlugZap, User, Wifi } from 'lucide-react';
const orderplaced = () => {
  const [data, setData] = useState([])
  console.log(data.length)
  const fetchdata = async () => {
    const token = localStorage.getItem("usertoken")
    var userinfo = await axios.get('/api/user', { params: { token: token } })
    const res = await axios.get('api/BookingTour', { params: { userid: userinfo.data.userid, fetchtype: "user" } })
    setData(res.data)
  }
  console.log(data)
  useEffect(() => {
    fetchdata()
  }, [])
  return (
    <div>
      <Navbar />
      <div>
        <h1 className='text-md md:text-2xl px-2 py-4 font-bold'>My Tour List:</h1>
        <div className='flex flex-wrap justify-center'>
          {data.length > 0 ?
            data.map((order, index) => {
              return (
                <div key={index} className='p-2'>

                  <div className='flex flex-col justify-center bg-gray-50 max-w-[400px] min-h-[310px] px-4 py-2 rounded-md shadow-gray-700 shadow-md'>
                    <p> <b>Tourname: </b> {order.tourname}</p>
                    <p><b>name: </b> {order.name}</p>
                    <p><b>No of Peoples:  </b>{order.noofPeople}</p>
                    <div>
                      <p><b>schedule: </b>{order.tourstartdate} - {order.tourenddate}</p>
                      <p><b>pickup Time: </b>{order.boardingtime}</p>
                      <p><b>email Id: </b>{order.email}</p>

                    </div>
                    <p><b>pickup Address: </b>  {order.pickupaddress}</p>
                    <p className="flex gap-2 py-1 font-bold"><b>Faclities: </b>{order.facilities.wifi && <Wifi className="text-gray-600" />} {order.facilities.charging && <PlugZap className="text-gray-600" />} {order.facilities.ac && <AirVent className="text-gray-600" />}{order.facilities.bed && <BedSingle className="text-gray-600" />}</p>

                    <div className='flex gap-1 items-center md:text-xl font-bold'>Status: <p className={order.status==="pending"?"text-orange-600":order.status==="rejected"?"text-red-600":order.status==="waiting"?"text-yellow-500":order.status==="cancelled"?"text-amber-900":"text-green-600"}>{order.status}</p></div>

                    {order.remainingamount > "0" && <div className='flex flex-wrap items-center gap-5'><p><b>Balance Amount: </b>{order.remainingamount} </p> <button className='bg-red-600 rounded-md text-white border-none font-bold px-2 py-1 cursor-pointer'>Pay Now</button></div>}
                    <div className='flex flex-wrap justify-around gap-1'>
                      <button className='border-none bg-black text-white px-5 py-2 my-2 cursor-pointer w-fit'>Track </button>
                      <button className='border-none bg-black text-white px-2 py-2 my-2 cursor-pointer w-fit '>Request For Cancelation</button>

                    </div></div>
                </div>
              )
            })
            : <div className='flex text-red-600 justify-center items-center w-full'><p>No Booking Found</p></div>
          }
        </div>
      </div>
    </div>
  )
}

export default orderplaced
