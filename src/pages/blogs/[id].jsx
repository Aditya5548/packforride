; import Image from "next/image";
import { useRouter } from 'next/router';
import { assets } from '../../assets/assets';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const page = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter();
  const data = router.query;
  console.log(data);
  return (
    data ? <>
      <div className='bg-gray-300 pb-5'>
        <Navbar />
        <div className="text-center mb-20 mt-5">
          <h1 className="text-xl sm:text-2xl font-semibold max-w-[700px] mx-auto pb-2">{data.category} Tour</h1>
        </div>
      </div>
      <div className="flex flex-col items-center mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
        <Image src={null || data.image} width={400} height={300} alt='' className='border-4 border-white' />
        <div className='self-start text-justify'>
          <p className='text-xl sm:text-2xl font-semibold py-2'>{data.tourname}</p>
          <p className='pt-3'>{data.description}</p>
          <div className='py-3'>
            <p className='text-xl font-semibold'>Facilities Involved:</p>
            <div>
              <p>Tranport: {data.transport}</p>
              <p>Room: {data.room}</p>
              <p>Fooding: {data.fooding}</p>
              <p>No of Days: 5 Days </p>
            </div>
          </div>

          <div className='py-3'>
            <p className='text-xl font-semibold'>Traveling option:</p>
            <div className='flex flex-wrap justify-center gap-5 pt-2'>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Indivisual</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Family</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>friends</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Groups</button>
            </div>
          </div>
          <div className="flex flex-col pt-3">
            <p className='text-xl font-semibold py-1'>Calculate Cost & Distance: </p>
            <h1 className="my-1">Your Location: <input type="text" placeholder="Select starting location" className="w-3/5 border font-light border-gray-600 outline-0 p-1" /></h1>
            <h1 className="my-1">No of people: <input type="text" placeholder="Enter no of people" className="w-3/5 border font-light border-gray-600 outline-0 p-1" /></h1>
            <h1 className="my-1">Your Distance from selected Place: </h1>
            <h1 className="my-1">Total Cost:  </h1>
            <div />
          </div>
          <div className="flex flex-col py-3">
            <p className='text-xl font-semibold'>Cheak Availablablity: </p>
            <div className='flex flex-wrap flex-col justify-center pt-2'>
              <div className="flex  items-center gap-3">
              <h1 className="text-lg">Select Date:  </h1>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                className="border border-gray-300 p-2 rounded-md"
              />
              <button className='bg-gray-600 text-white font-bold py-1 px-3 rounded-sm text-lg'>Find</button>
              </div>
              <div className="flex justify-center">
                <h1>no available slots</h1>
              </div>
            </div>
            <div />
          </div>
          <div className='flex justify-center py-3'>
            <button className='bg-black text-white font-bold px-10 py-2 text-lg md:text-xl'>Book Now</button>
          </div>
          <div className='py-1'>
            <p className='text-xl font-semibold'>Important Notes</p>
            <div className='flex flex-wrap justify-center gap-5 pt-2 text-xs w-9/10'>
              ➢  All tour timings are in Pack & go platform. <br />
              ➢  For immigration clearance purposes, be sure to allocate 90 minutes before the tour and 60 minutes before your boarding time (upon the tour's completion). <br />
              ➢  Availability of seats is not guaranteed on same-day bookings, please visit the Discover Qatar Transit Tour desk as soon as possible to secure your preferred tour timings. <br />
              ➢  Please make sure to check the last departure time for this tour before moving forward.
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className='text-black font-semibold my-2'>Share this Tour on social Media</p>
            <div className='flex'>
              <Image src={assets.facebook_icon} width={50} alt='' />
              <Image src={assets.twitter_icon} width={50} alt='' />
              <Image src={assets.googleplus_icon} width={50} alt='' />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </> : <>
      <div className='flex p-5 text-5xl justify-center'>
        <h1 className='self-center'>No Tours Are Available</h1>
      </div>

    </>

  )
}

export default page
