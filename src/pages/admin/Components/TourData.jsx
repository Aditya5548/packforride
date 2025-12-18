import axios from "axios";
import Image from "next/image";
import useSWR from "swr";
import { ClipLoader } from "react-spinners";
import { format } from "timeago.js";
import { assets } from '../../../assets/assets';
import { toast } from "react-toastify";
const fetcher = (url) => fetch(url).then(res => res.json())
const TourData = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkFkaXR5YTkzNzciLCJpYXQiOjE3NjA1MzM0NzN9.CqdnBoA0eNMwLa7U8dWtDhuw7QLa3tsgbL8Q8hxSvAo"
  const { data, error, isLoading, mutate } = useSWR(`/api/tours?token=${token}`, fetcher)
  if (isLoading) {return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col items-center gap-5">
        <h2 className="text-3xl">Please Wait...</h2>
        <ClipLoader size={50} color="#000000" loading />
      </div>
    </div>)
  }
  if (error) {
    return (
    <div className="flex justify-center items-center">
      <div className="text-2xl">
        <h2>OOPS....</h2>
        <h3>there is a connectivity Issue..</h3>
      </div>
    </div>)
  }

  const deletetour = async (blogid) => {
    const token = localStorage.getItem('token')
    const response = await axios.delete('/api/tours', { params: {id: blogid,token: token} });
    if(response.data.msg == "Tour Deleted"){
      toast.success('TOur Deleted Successfully..');
      mutate();
    }
    else{
      toast.error(response.data.msg)
    }
  }
  return (
    <div className="flex flex-col items-center pt-5 px-5 sm:pt-12 sm:pl-16">
      <div className='relative h-[80vh] max-w-[850px] overflow-x-auto border border-gray-400 scrolling'>
              <div className="hidden bg-black/90 text-white font-bold md:flex md:justify-around md:items-center">
                <p className="w-full md:w-2/5 px-6 py-4">tourname</p>
                <p className="w-full md:w-1/5 px-6 py-3">Category</p>
                <p className="w-full md:w-1/5 px-6 py-3">Posted</p>
                <p className="w-full md:w-1/5 px-6 py-3">Action</p>
              </div>
            {data.map((item) => (
              <div key={item._id} className="flex flex-wrap justify-around items-center border-b">
                <p className="w-full md:w-2/5 px-6 py-4">{item.tourname}</p>
                <p className="w-full md:w-1/5 px-6 py-3">{item.category}</p>
                <p className="w-full md:w-1/5 px-6 py-3">{format(item.createdAt)}</p>
                <div className="flex justify-center w-full md:w-1/5">
                  <button className="bg-red-500 w-full text-white px-3 py-2 m-2 cursor-pointer rounded-md" onClick={()=>deletetour(item._id)}>Remove</button>
                </div> 
              </div>
            ))}
      </div>
    </div>
  )
}

export default TourData
