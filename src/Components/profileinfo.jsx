"use client";
import React, { useState,useEffect } from 'react'
import axios from 'axios'
import { Mail, PhoneCall, Plus, User, Users, IndianRupee,Calendar } from 'lucide-react'
import { useUser } from "@/context/UserContext";
const profileinfo = (props) => {
    const [data, setData] = useState([])
    const { profilepanel,setProfilepanel } = useUser();
    const fetchdata = async () => {
      const token = localStorage.getItem("usertoken")
      var userinfo = await axios.get('/api/user', { params: { token: token } })
      setData(userinfo.data.user)
    }
    useEffect(() => {
      fetchdata()
    }, [])

  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-white/90 z-40'>
      <div className='flex justify-center items-center h-full'>
        <div className=' flex flex-col w-9/10 md:w-[300px] py-2 bg-gray-300 shadow-lg'>
          <div className='flex flex-col gap-1 px-5 py-1'>
            <button className="text-2xl text-end cursor-pointer" onClick={() => { setProfilepanel(false) }}>X</button>
            <h1 className="text-2xl text-center font-bold">Profile Detail</h1>
          </div>
          <div className='flex flex-col px-3 py-2 gap-2'>
            <p className='flex items-center gap-2 bg-white p-1 rounded-md'><User/> {data.name}</p>
            <p className='flex items-center gap-2 bg-white p-1 rounded-md'><Calendar/>{data.dob}</p>
            <p className='flex items-center gap-2 bg-white p-1 rounded-md'><Users/>{data.gender}</p>
            <p className='flex items-center gap-2 bg-white p-1 rounded-md'><PhoneCall/>{data.phoneno}</p>
            <p className='flex items-center gap-2 bg-white p-1 rounded-md'><Mail/>{data.email}</p>
          </div>
          
          <button className='bg-red-500 px-5 text-white w-fit font-bold self-center rounded-md py-2 my-2 cursor-pointer'>Update</button>
        </div>
      </div>

    </div>
  )
}

export default profileinfo
