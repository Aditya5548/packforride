; import Image from "next/image";
import { useRouter } from 'next/router';
import { assets } from '../../assets/assets';
import Footer from '../../Components/Footer';
import Navbar from '../../Components/Navbar';
import Bookingpanel from './Bookingpanel';
import { useState } from "react";
import Userlogin from "../../Components/Userlogin";
import UserReg from "../../Components/UserReg";
import { useUser } from "@/context/UserContext";
import DatePicker from "react-datepicker";
import { ToastContainer,toast } from 'react-toastify';
import { AirVent, ArrowRight, BedSingle, BusFront, Clock, MapPin, PlugZap, User, Wifi } from 'lucide-react';

import "react-datepicker/dist/react-datepicker.css";
const page = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalcost, setTotalCost] = useState(false);
  const [noofpeople, setNoofPeople] = useState();
  const { paymentpanel, setPaymentPanel } = useUser();
      const { showhide, setShowhide } = useUser();
      const { showhideoptions, setShowhideoptions } = useUser();
  const router = useRouter();
  const data = router.query;
  const Calculatecost = async (cost) => {
    const calculating = Number(cost) * noofpeople
    console.log(calculating)
    setTotalCost(calculating)
  }
  const paymentdashopen = (e) => {
      if(!showhide){
        setShowhide(true)
        setShowhideoptions("login")
      }
      else{
        if(!totalcost){
          toast.error("Calculate Cost")
        }
        else{
          setPaymentPanel(true)
        }
      }
    };

  return (
    data ? <>
      <div className='bg-gray-300 pb-5'>
        <Navbar />
        <ToastContainer/>
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
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Family</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Friends</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Indivisual</button>
              <button className='bg-gray-300 px-4 py-2 md:text-lg rounded-sm'>Groups</button>
            </div>
          </div>
          <div className="flex flex-col pt-3 items-center w-full bg-gray-50 rounded-lg">
            <p className='text-xl font-semibold py-1'>Calculate Trip Cost: </p>
            <div className="flex flex-col gap-2 pt-3">
              <h1><span className="w-1/2 font-bold">No of Peoples : </span><input type="number" placeholder="No. of People" className="border border-gray-200 outline-none px-2 bg-white" name="noofpeople" value={noofpeople} onChange={(e) => { setNoofPeople(e.target.value) }} /></h1>
              <div className="flex">
                <h1 className="w-1/2 font-bold">Fooding : </h1>
                <select name="accessries" className="px-4 outline-none">
                 <option value="no">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex">
                <h1 className="w-1/2 font-bold">Room :</h1>
                <select name="accessries" className="px-4 outline-none">
                <option value="no">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="flex">
                <h1 className="w-1/2 font-bold">Accessries :</h1>
                <select name="accessries" className="px-4 outline-none">
                <option value="no">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <button className='bg-black text-white font-bold py-1' onClick={() => { Calculatecost(data.cost) }}>Calculate Cost</button>
            </div>
            <h1 className="py-2 text-xl text-red-600 font-bold">{totalcost && `Total Cost:  ${totalcost}`}</h1>
            <div />
          </div>
          {paymentpanel && <Bookingpanel />}
          {showhide ? showhideoptions == "login" ? <Userlogin /> :showhideoptions == "signup" ? <UserReg /> : "":""}
          <div className="flex flex-col py-3 ">
            <p className='text-xl font-semibold'>Cheak Availablablity: </p>
            <div className='flex flex-wrap flex-col justify-center pt-2'>
              <div className="flex  items-center flex-wrap gap-3">
                <h1 className="text-lg">Select Date:  </h1>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  className="border border-gray-300 p-2 rounded-md"
                />
                <button className='bg-gray-600 text-white font-bold py-1 px-3 rounded-sm text-lg'>Find</button>
              </div>
              <div className='flex py-3 flex-wrap gap-2 justify-between'>
                <div className="bg-gray-200 rounded-md px-4 py-2 flex flex-col gap-2 w-9/10 md:w-[250px]">
                  <p className="flex gap-2 py-1 font-bold"><BusFront className="text-gray-600" /> Standard BUS</p>
                  <p className="flex gap-2 py-1"> <Clock className="text-gray-600" /> 9:30 pm - 11:00pm</p>
                  <p className="flex gap-3 py-1">27/12/2025 <ArrowRight className="text-gray-600" /> 31/12/2025</p>
                  <p className="flex"><MapPin className="text-gray-600 text-xl" /> <span className=" px-2 text-sm">Vineet-Khand Gomti nagar Lucknow - 226028</span></p>
                  <div className="w-full py-1">
                    <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${70}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{50} Booked</span>
                      <span>{30} Seats Left</span>
                    </div>
                  </div>
                  <p className="flex gap-2 py-1 font-bold">Faclities: <Wifi className="text-gray-600" /> <PlugZap className="text-gray-600" /> <AirVent className="text-gray-600" /> <BedSingle className="text-gray-600" /></p>
                  <button onClick={() => {paymentdashopen()}} className='bg-gray-900 self-center text-white font-bold px-3 py-1 text-md rounded-lg md:text-lg'>Book Now</button>
                </div>

                <div className="bg-gray-200 rounded-md px-4 py-2 flex flex-col gap-2 w-9/10 md:w-[250px]">
                  <p className="flex gap-2 py-1 font-bold"><BusFront className="text-gray-600" /> Mini BUS</p>
                  <p className="flex gap-2 py-1"> <Clock className="text-gray-600" /> 9:30 pm - 11:00pm</p>
                  <p className="flex gap-3 py-1">27/12/2025 <ArrowRight className="text-gray-600" /> 31/12/2025</p>
                  <p className="flex"><MapPin className="text-gray-600 text-xl" /> <span className=" px-2 text-sm">Vineet-Khand Gomti nagar Lucknow - 226028</span></p>
                  <div className="w-full py-1">
                    <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${25}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{30} Booked</span>
                      <span>{90} Seats Left</span>
                    </div>
                  </div>
                  <p className="flex gap-2 py-1 font-bold">Faclities: <Wifi className="text-gray-600" /> <PlugZap className="text-gray-600" /> <AirVent className="text-gray-600" /> <BedSingle className="text-gray-600" /></p>
                  <button onClick={() => {paymentdashopen()}} className='bg-gray-900 self-center text-white font-bold px-3 py-1 text-md rounded-lg md:text-lg'>Book Now</button>
                </div>

                <div className="bg-gray-200 rounded-md px-4 py-2 flex flex-col gap-2 w-9/10 md:w-[250px]">
                  <p className="flex gap-2 py-1 font-bold"><BusFront className="text-gray-600" /> AC BUS</p>
                  <p className="flex gap-2 py-1"> <Clock className="text-gray-600" /> 9:30 pm - 11:00pm</p>
                  <p className="flex gap-3 py-1">27/12/2025 <ArrowRight className="text-gray-600" /> 31/12/2025</p>
                  <p className="flex"><MapPin className="text-gray-600 text-xl" /> <span className=" px-2 text-sm">Vineet-Khand Gomti nagar Lucknow - 226028</span></p>
                  <div className="w-full py-1">
                    <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${50}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{70} Booked</span>
                      <span>{70} Seats Left</span>
                    </div>
                  </div>
                  <p className="flex gap-2 py-1 font-bold">Faclities: <Wifi className="text-gray-600" /> <PlugZap className="text-gray-600" /> <AirVent className="text-gray-600" /> <BedSingle className="text-gray-600" /></p>
                  <button onClick={() => {paymentdashopen()}} className='bg-gray-900 self-center text-white font-bold px-3 py-1 text-md rounded-lg md:text-lg'>Book Now</button>
                </div>

                <div className="bg-gray-200 rounded-md px-4 py-2 flex flex-col gap-2 w-9/10 md:w-[250px]">
                  <p className="flex gap-2 py-1 font-bold"><BusFront className="text-gray-600" /> Campher VAN</p>
                  <p className="flex gap-2 py-1"> <Clock className="text-gray-600" /> 9:30 pm - 11:00pm</p>
                  <p className="flex gap-3 py-1">27/12/2025 <ArrowRight className="text-gray-600" /> 31/12/2025</p>
                  <p className="flex"><MapPin className="text-gray-600 text-xl" /> <span className=" px-2 text-sm">Vineet-Khand Gomti nagar Lucknow - 226028</span></p>
                  <div className="w-full py-1">
                    <div className="h-3 w-full bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${20}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{30} Booked</span>
                      <span>{90} Seats Left</span>
                    </div>
                  </div>
                  <p className="flex gap-2 py-1 font-bold">Faclities: <Wifi className="text-gray-600" /> <PlugZap className="text-gray-600" /> <AirVent className="text-gray-600" /> <BedSingle className="text-gray-600" /></p>
                  <button onClick={() => {paymentdashopen()}} className='bg-gray-900 self-center text-white font-bold px-3 py-1 text-md rounded-lg md:text-lg'>Book Now</button>
                </div>


              </div>
            </div>
            <div />
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
