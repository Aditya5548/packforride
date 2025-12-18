import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { toast } from "react-toastify";
import { ToastContainer } from 'react-toastify';
import { useRouter } from "next/router";
import { useUser } from "@/context/UserContext";
import { assets } from "@/assets/assets";
import { signIn} from "next-auth/react";
const Userlogin = () => {
  const [email,SetEmail] = useState();
  const [password,SetPassword] = useState();
  const {showhide , setShowhide} = useUser();
  const {showhideoptions, setShowhideoptions} = useUser();
  const {username, setUsername} = useUser();
  const data ={email,password}
  const router = useRouter()
  const logcode = async(e)=>{
    e.preventDefault();
    var response =await axios.get('/api/user',{params:data})
    if(response.data.success==true){
      SetEmail("")
      SetPassword("")
      localStorage.setItem("usertoken",response.data.usertoken)
      setUsername(response.data.username)
      setShowhide(false)
    }
    else{
      toast.error(response.data.msg)
    }
  }
  return (
    <>
    <div className='fixed top-0 left-0 z-5 flex justify-center items-center w-screen h-screen bg-gray-100/90'>
      <ToastContainer/>
      <div className='flex flex-col gap-2 w-[90%] md:w-[400px] border border-gray-400 shadow-lg px-10 py-3 bg-white'>
          <button className="text-2xl text-end " onClick={()=>setShowhide(false)}>X</button> 
          <h1 className="text-2xl text-center font-bold">Login</h1>  
         <div className="pt-2">
          <h1 className="flex text-sm md:text-lg">Don't have an account ?<button className="text-blue-600 px-0.5 italic" onClick={()=>{setShowhideoptions("signup")}}> SignUp</button></h1>
         </div>
         <form className='flex flex-col gap-3 pt-3' onSubmit={logcode}>
          <input type="email" placeholder='email Id' className='w-full outline-none border border-gray-200 px-3 py-1' name="email" value={email} onChange={(e)=>{SetEmail(e.target.value)}} required />
          <input type="password" placeholder='Password' className='w-full outline-none border border-gray-200 px-3 py-1' name="password" value={password} onChange={(e)=>{SetPassword(e.target.value)}} required />
          <button className="bg-black text-white py-2 cursor-pointer">Submit</button>
         </form>
         <div className="flex justify-end"><u className="text-blue-600 mr-2 text-lg">Forgot password</u></div>
          <div className="flex flex-col items-center gap-2 py-1">
            <h1>Or </h1>
            <button className="flex gap-3 items-center justify-center w-full border border-gray-400 rounded-lg py-2 cursor-pointer" onClick={() => signIn('google')}>
              <p className='text-xl'>Continue with </p>
              <Image src={assets.google_icon} width={25} height={25} alt="no image not" />
            </button>
          </div>
      </div>
    </div>
    </>
  )
}

export default Userlogin
