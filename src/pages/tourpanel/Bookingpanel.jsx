import React, { useState } from 'react'
import axios from 'axios'
import { Mail, PhoneCall, Plus, User, Users, IndianRupee } from 'lucide-react'
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from 'react-toastify';
const Bookingpanel = (props) => {
  const { totalamount, passenger } = props
  const { tourname, _id } = props.tourdata
  const {tourslot} = props
  console.log(tourslot)
  const { paymentpanel, setPaymentPanel } = useUser();
  const [orderamount, setOrderamount] = useState();
  const [remainingamount, setRemainingamount] = useState();
  let [paymenttype, setPaymentType] = useState("Full");
  let [name, setName] = useState();
  let [age, setAge] = useState();
  let [gender, setGender] = useState();
  let [email, setEmail] = useState();
  let [phoneno, setPhoneno] = useState();

  const regcode = async (e) => {
    const token = localStorage.getItem("usertoken")
    var userinfo = await axios.get('/api/user', { params: { token: token } })
    const data = {
      name,
      age,
      gender,
      email,
      phoneno,
      orderamount,
      remainingamount,
      passenger,
      tourname,
      tourid: _id,
      paymenttype,
      userid: userinfo.data.userid,
      tourstartdate: tourslot.tourStartDate,
      tourenddate: tourslot.tourEndDate,
      boardingtime: tourslot.boardingTime,
      pickupaddress: tourslot.location ,
      vehicletype: tourslot.vehicleType,
      facilities:tourslot.facilities,
      slotid:tourslot.id
    }
    var response = await axios.post('/api/BookingTour', data)
    if (response.data.success){
      setPaymentPanel(false)
      toast.success("Tour Booked Successfully.....")
    }
    else{
      toast.error("fill correct Details")
    }

  };
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-white/90 z-40'>
      <div className='flex justify-center items-center h-full'>
        <ToastContainer />
        <div className=' flex flex-col w-9/10 md:w-[400px]  py-2 bg-gray-200'>
          <div className='flex flex-col gap-2 px-5 py-1'>
            <button className="text-2xl text-end cursor-pointer" onClick={() => { setPaymentPanel(false) }}>X</button>
            <h1 className="text-2xl text-center font-bold">Register Booking</h1>
          </div>
          <form className='pt-5'>
            <p className='flex gap-2 items-center  mx-5 my-2 px-3 py-1'> <b>Tourname:</b> {props.tourdata.tourname}</p>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><User className='text-gray-600' /><input className="outline-none bg-white px-5 py-1" type="text" placeholder='Name' value={name} onChange={(e) => { setName(e.target.value) }} required /></p>
            <div className="flex gap-2 text-lg bg-white mx-5 my-2 px-3 py-1">
              <Users className='text-gray-600' />
              <label htmlFor="male"> Male</label>
              <input type="radio" name="Gender" value="male" onChange={(e) => { setGender(e.target.value) }} required />
              <label htmlFor="male">Female</label>
              <input type="radio" name="Gender" value="female" onChange={(e) => { setGender(e.target.value) }} required />
              <label htmlFor="male">Other</label>
              <input type="radio" name="Gender" value="other" onChange={(e) => { setGender(e.target.value) }} required />
            </div>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><Plus className='text-gray-600' /><input className="outline-none px-5 py-1 w-1/1" type="number" name="age" value={age} onChange={(e) => { setAge(e.target.value) }} placeholder='Age' min={18} max={70} required /></p>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><Mail className='text-gray-600' /><input className="outline-none px-5 py-1" type="text" placeholder='Email Id' value={email} onChange={(e) => { setEmail(e.target.value) }} required /></p>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><PhoneCall className='text-gray-600' /><input className="outline-none px-5 py-1" type="text" placeholder='Phone No' value={phoneno} onChange={(e) => { setPhoneno(e.target.value) }} required /></p>
          </form>
          <div className="flex gap-2 text-lg bg-white my-2 mx-10 rounded-lg px-1 py-1 justify-center">
            <label htmlFor="paymenttype" className='flex gap-2'> Full Payment
              <input type="radio" name="paymenttype" value="Full" onChange={(e) => { setPaymentType(e.target.value); setOrderamount(totalamount + 500); setRemainingamount(0) }} required default />
            </label>
            <label htmlFor="paymenttype" className='flex gap-2'>Registration
              <input type="radio" name="paymenttype" value="registration" onChange={(e) => { setPaymentType(e.target.value); setOrderamount(500); setRemainingamount(totalamount) }} required />
            </label>

          </div>
          <p className='flex gap-2 items-center  mx-5 my-2 px-3 py-1'> <b>Rupees: </b> {paymenttype == "Full" ? totalamount + "+ GST (18% included)" : "500"}</p>
          <button className='bg-red-600 px-5 text-white w-fit font-bold self-center rounded-lg py-2 my-2 cursor-pointer' onClick={() => { regcode() }}>Proceed For Payment </button>
        </div>
      </div>

    </div>
  )
}

export default Bookingpanel
