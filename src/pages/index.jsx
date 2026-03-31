import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import useSWR from 'swr';
import Image from 'next/image';
import Navbar from "../Components/Navbar";
import Footer from '../Components/Footer';
import Tourlist from '../Components/Tourlist';
import weblogo from '../assets/weblogo.png';
import Countdown from '../Components/Countdown.jsx';
const fetcher = (url) => axios.get(url).then(res => res.data);

export default function Home() {
  const [city, setCity] = useState("");
  if (!city && typeof window !== "undefined") {

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(async (position) => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );

        const locationData = await res.json();

        setCity(locationData.city);

      });

    }
  }

  const { data, error, isLoading } = useSWR(`/api/tours?city=${city}`,fetcher);
  if(isLoading){
    return      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#f8f8f8]">
      <div className="flex flex-col items-center text-center">

        {/* Image */}
        <Image
          src={weblogo}
          alt="Loading"
          priority
          className="w-[320px] h-auto object-contain"
        />

        {/* Text */}
        <h2 className="mt-6 text-3xl md:text-4xl font-medium text-sky-400">
          Ready for the Journey
        </h2>

        {/* Dots */}
        <div className="flex gap-2 mt-6">
          <span className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0s]"></span>
          <span className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
          <span className="w-2.5 h-2.5 bg-gray-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>

      </div>
    </div>
  }
  console.log(data)
  return (
    <div className='flex flex-col justify-between h-[100vh]'>
      <ToastContainer />
      <Navbar />

      <Tourlist tourplaces={!data?[]:data} />
      <Footer />
    </div>
  );
}