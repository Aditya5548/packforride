import React, { useEffect } from 'react';
import axios from 'axios';
import Userlogin from './Userlogin';
import UserReg from './UserReg';
import Profileinfo from './profileinfo';
import { useUser } from '../context/UserContext';
import { assets } from '@/assets/assets';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
const Navbar = () => {   
    const { showhide, setShowhide } = useUser();
    const { showhideoptions, setShowhideoptions } = useUser();
    const { profilepanel,setProfilepanel } = useUser();
    const { username, setUsername } = useUser(false);
    const session = useSession();
    const router = useRouter();
    const fetchbooking = async ()=>{
        const token = localStorage.getItem("usertoken")
        var response = await axios.get('/api/user', { params: { token: token } })
        router.push({
            pathname:"/orderplaced",
        })
    }

    useEffect(() => {
        const token = localStorage.getItem("usertoken")
        if (token) {
            async function cheackuser() {
                var response = await axios.get('/api/user', { params: { token: token } })
            
                setUsername(response.data.username)
            }
            cheackuser()
        }
        if(session.status==="authenticated"){
        setShowhide(false)
        const username=session.data.user.name
        const userfirstname=username.split(" ")[0];
        setUsername(userfirstname)
      }
    })
    function logout(){
        const token = localStorage.getItem("usertoken")
        if(token){
            setUsername('')
            localStorage.removeItem('usertoken')
            window.location.href = "/"; 
        }
        if(session.status=="authenticated"){
            setUsername('')
            signOut()
            window.location.href = "/"; 
        }
    }

    return (
        <div className='pt-5 px-5 md:px-12 lg:px-28'>
            {showhide ? showhideoptions == "login" ? <Userlogin /> :showhideoptions == "signup" ? <UserReg /> : "":""}

            <div className='flex justify-between items-center'>
                <p className='text-xl sm:text-4xl font-medium italic'>Pack For Ride</p>
                <div>
                    {
                        !username ?
                            <div className='flex gap-1  font-medium py-1 px-3 sm:py-3 sm:px-3 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>
                                <button onClick={() => { setShowhide(true); setShowhideoptions("login"); }}>Login</button> /
                                <button onClick={() => { setShowhide(true); setShowhideoptions("signup"); }}>Signup</button>
                            </div> :
                            <div className="dropdown">
                                <button className="dropbtn">
                                    <p className="flex items-center text-xl md:text-2xl font-medium gap-1 md:gap-2">Hey, {username}<Image src={assets.dropdown} alt="Example image" className='w-[20px] h-[10px] md:w-[25px] md:h-[15px]'/> </p>
                                
                                </button>
                                <div className="dropdown-content z-50">
                                    <button onClick={()=>{setProfilepanel(true)}}>profile</button>
                                    <button onClick={fetchbooking} className='cursor-pointer'>Booked tours</button>
                                    <button onClick={()=>{logout()}} className='cursor-pointer'>Logout</button>
                                </div>
                            </div>
                    }
                    { profilepanel && <Profileinfo/> }
                    <div className='flex fixed flex-col bottom-2 right-2 items-center z-50'>
                        
                        <Link href="tel:+917376219758"><Image src={assets.call_icon} alt="Example image" className='w-[50px] h-[40px] md:w-[65px] md:h-[50px]'/></Link>
                        <Link href="https://wa.me/+919005825347"><Image src={assets.whatsapp_icon} alt="Example image" className='w-[60px] h-[40px] md:w-[80px] md:h-[50px]'/></Link>
                        
                    </div>
                </div>
            </div>
 
        </div>
    )
}

export default Navbar
