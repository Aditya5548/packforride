import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import useSWR from 'swr';
import Navbar from "../Components/Navbar";
import Footer from '../Components/Footer';
import Tourlist from '../Components/Tourlist';

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
    return <div>Data is loading</div>
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