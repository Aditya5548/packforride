"use client";
import React, { useEffect, useState } from "react"
import axios from "axios"
import Tourdetailinfo from './Tourdetailinfo'
import { useUser} from '../../../context/UserContext'
const BookedTours = () => {
    const [data, setData] = useState([])
    const [selecteddata, setSelecteddata]=useState()
    const {tourdetailinfo, setTourdetailinfo} = useUser();
    const fetchdata = async () => {
      const res = await axios.get('api/BookingTour',{params:{fetchtype:"admin"}})
      setData(res.data)
    }
    useEffect(() => {
      fetchdata()
    }, [])
  return (
   <div className="flex flex-col items-center pt-5 px-5 sm:pt-12 sm:pl-16">
      <div className='relative h-[80vh] max-w-[850px] overflow-x-auto border border-gray-400 scrolling'>
              <div className="hidden bg-black/90 text-white font-bold md:flex md:justify-around md:items-center">
                <p className="w-full md:w-1/3 px-6 py-3">Location</p>
                <p className="w-full md:w-1/3 px-6 py-3">Trip Date</p>
                <p className="w-full md:w-1/3 px-6 py-3">Action</p>
              </div>
            {data.map((item) => (
              <div key={item._id} className="flex flex-wrap justify-around items-center border-b">
                <p className="w-full md:w-1/3 px-6 py-3">{item.pickupaddress}</p>
                <p className="w-full md:w-1/3 px-6 py-3">{item.tourstartdate}</p>
                <div className="flex justify-center w-full md:w-1/3">
                  <button className="bg-red-500 w-full text-white px-3 py-2 m-2 cursor-pointer rounded-md" onClick={()=>{setTourdetailinfo(true);setSelecteddata(item)}}>View</button>
                </div> 
              </div>
            ))}
            {tourdetailinfo && <Tourdetailinfo data={selecteddata}/>}
      </div>
    </div>
  )
}

export default BookedTours
