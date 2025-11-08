import { ToastContainer } from 'react-toastify';
import { useState } from "react"
import axios from "axios"
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
const UserReg = () => {
  const {showhide , setShowhide} = useUser();
  const {showhideoptions, setShowhideoptions} = useUser();
  const {username, setUsername} = useUser();
  const [name, SetName] = useState()
  const [gender, SetGender] = useState()
  const [dob, SetDob] = useState()
  const [email, SetEmail] = useState()
  const [phoneno, SetPhoneno] = useState()
  const [password, SetPassword] = useState()
  const data = {name, gender, dob, email, phoneno,password}
  const router = useRouter()
  const logcode = async (e) => {
    e.preventDefault();
    var response = await axios.post('/api/user',data)
    console.log(response.data)
    if (response.data.success == true) {
      SetName("")
      SetDob("")
      SetPassword("")
      SetPhoneno("")
      SetEmail("")
      SetGender("")
      localStorage.setItem("usertoken",response.data.usertoken)
      setUsername(response.data.username)
      setShowhide(false)
    }
    else {
      toast.error("All Field Are required")
    }
  }
  return (
    <>
      <div className='fixed top-0 left-0 z-5 flex justify-center items-center w-screen h-screen bg-gray-500/90'>
        <ToastContainer/>
        <div className='flex flex-col gap-2 w-[90%] md:w-[400px] border border-gray-400 shadow-lg px-10 py-5 bg-white'>
          <button  className="text-2xl text-end" onClick={()=>setShowhide(false)}>X</button> 
          <h1 className='text-2xl text-center font-bold'> SignUp </h1>
          <form className='flex flex-col gap-5 pt-3' onSubmit={logcode}>
            <input type="text" placeholder='Your Name' className='w-full outline-none border border-gray-200 px-3 py-1' name="name" value={name} onChange={(e) => { SetName(e.target.value) }} required />
            <div className="flex gap-2 text-lg">
              <label htmlFor="male"> Male</label>
              <input type="radio" name="Gender" value="Male" onChange={(e) => { SetGender(e.target.value) }} required />
              <label htmlFor="male">Female</label>
              <input type="radio" name="Gender" value="Female" onChange={(e) => { SetGender(e.target.value) }} required />
              <label htmlFor="male">Other</label>
              <input type="radio" name="Gender" value="other" onChange={(e) => { SetGender(e.target.value) }} required />
            </div>
            <div className="flex gap-5 items-center">
              <h1>Date of Birth: </h1>
               <input type="date" className='outline-none border border-gray-200 px-3 py-1' name="DOB" value={dob} onChange={(e) => { SetDob(e.target.value) }} required />
            </div>
            <input type="text" placeholder='Phone No' className='w-full outline-none border border-gray-200 px-3 py-1' name="phoneno" value={phoneno} onChange={(e) => { SetPhoneno(e.target.value) }} required />
            <input type="email" placeholder='Email Id' className='w-full outline-none border border-gray-200 px-3 py-1' name="email" value={email} onChange={(e) => { SetEmail(e.target.value) }} required />
            <input type="password" placeholder='Password' className='w-full outline-none border border-gray-200 px-3 py-1' name="password" value={password} onChange={(e) => { SetPassword(e.target.value) }} required />
            <button className="bg-black text-white py-2 cursor-pointer">Register</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default UserReg