import React, { useState } from 'react'
import {  Mail, PhoneCall, Plus, User, Users, IndianRupee } from 'lucide-react'
import { useUser } from "@/context/UserContext";
import { ToastContainer,toast } from 'react-toastify';
const Bookingpanel = () => {
  const {paymentpanel,setPaymentPanel} = useUser();
  let [PaymentType,setPaymentType] = useState();
  let [amount , setAmount] = useState(false);

  const regcode = (e) => {
    if(!amount){
      toast.error("Enter Amount")
    }
    else{
      toast.success(amount)
    }
  };
  return (
    <div className='fixed top-0 left-0 w-screen h-screen bg-white/90 z-40'>
      <ToastContainer/>
      <div className='flex justify-center items-center h-full'>
        <div className=' flex flex-col w-9/10 md:w-[400px]  py-2 bg-gray-200'>
        <div className='flex flex-col gap-2 px-5 py-1'>
          <button className="text-2xl text-end cursor-pointer" onClick={()=>{setPaymentPanel(false)}}>X</button> 
          <h1 className="text-2xl text-center font-bold">Register Booking</h1>
        </div>

          <form className='pt-5'>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><User className='text-gray-600' /><input className="outline-none bg-white px-5 py-1" type="text" placeholder='Name' required /></p>
            <div className="flex gap-2 text-lg bg-white mx-5 my-2 px-3 py-1">
              <Users className='text-gray-600' />
              <label htmlFor="male"> Male</label>
              <input type="radio" name="Gender" required />
              <label htmlFor="male">Female</label>
              <input type="radio" name="Gender" required />
              <label htmlFor="male">Other</label>
              <input type="radio" name="Gender" required />
            </div>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><Plus className='text-gray-600' /><input className="outline-none px-5 py-1 w-1/1" type="number" placeholder='Age' min={18} max={70} required /></p>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><Mail className='text-gray-600' /><input className="outline-none px-5 py-1" type="text" placeholder='Email Id' required /></p>
            <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><PhoneCall className='text-gray-600' /><input className="outline-none px-5 py-1" type="text" placeholder='Phone No' required /></p>
          </form>
           <div className="flex gap-2 text-lg bg-white my-2 mx-10 rounded-lg px-1 py-1 justify-center">
              <label htmlFor="paymenttype" className='flex gap-2'> Full Payment
              <input type="radio" name="paymenttype" value="Full" onChange={(e) => { setPaymentType(e.target.value) }}  required />
              </label>
              <label htmlFor="paymenttype" className='flex gap-2'>Partial Payment
              <input type="radio" name="paymenttype" value="Partial" onChange={(e) => { setPaymentType(e.target.value) }}  required />
              </label>
          </div>
          {PaymentType=="Partial" && <p className='flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1'><IndianRupee className='text-gray-600' /><input className="outline-none px-5 py-1 w-1/1" type="number" placeholder='Enter Partial Amount' required value={amount} onChange={(e) => { setAmount(e.target.value) }} /></p>}
         
             
          <button className='bg-black px-5 text-white w-fit font-bold self-center rounded-lg py-2 my-2' onClick={()=>{regcode(amount)}}>Go For Payment</button>
        </div>
      </div>

    </div>
  )
}

export default Bookingpanel
