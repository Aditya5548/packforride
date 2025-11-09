import React, { useEffect } from 'react';
import axios from 'axios';
import Userlogin from './Userlogin';
import UserReg from './UserReg';
import { useUser } from '../context/UserContext';
import { assets } from '@/assets/assets';
import Image from 'next/image';
const Navbar = () => {
    
    const { showhide, setShowhide } = useUser();
    const { showhideoptions, setShowhideoptions } = useUser();
    const { username, setUsername } = useUser(false);

    useEffect(() => {
        const token = localStorage.getItem("usertoken")
        if (token) {
            async function cheackuser() {
                var response = await axios.get('/api/user', { params: { token: token } })
                setUsername(response.data.username)
            }
            cheackuser()
        }
    })

    return (
        <div className='pt-5 px-5 md:px-12 lg:px-28'>
            {showhide ? showhideoptions == 1 ? <Userlogin /> : <UserReg /> : ""}

            <div className='flex justify-between items-center'>
                <p className='text-xl sm:text-4xl font-medium italic'>Pack For Ride</p>
                <div>
                    {
                        !username ?
                            <div className='flex gap-1  font-medium py-1 px-3 sm:py-3 sm:px-3 border border-solid border-black shadow-[-7px_7px_0px_#000000] text-black bg-white'>
                                <button onClick={() => { setShowhide(true); setShowhideoptions(1); }}>Login</button> /
                                <button onClick={() => { setShowhide(true); setShowhideoptions(2); }}>Signup</button>
                            </div> :
                            <div class="dropdown">
                                <button class="dropbtn">
                                    <p className="flex items-center text-xl md:text-2xl font-medium gap-1 md:gap-2">Hey, {username}<Image src={assets.dropdown} alt="Example image" className='w-[20px] h-[10px] md:w-[25px] md:h-[15px]'/> </p>
                                
                                </button>
                                <div class="dropdown-content">
                                    <button>profile</button>
                                    <button>Booked tours</button>
                                    <button onClick={()=>{setUsername('');localStorage.removeItem('usertoken')}}>Logout</button>
                                </div>
                            </div>
                    }
                </div>
            </div>
 
        </div>
    )
}

export default Navbar
