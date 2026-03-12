import { useState ,useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import Adminlogin from './Components/Adminlogin.jsx';
import DashBoard from './Components/DashBoard.jsx';
import Waiting from './Components/Waiting.jsx';

const index = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const secretkey=process.env.NEXT_PUBLIC_API_URL;
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);
        setToken(true);
      } catch (error) {
        setToken(false)
        localStorage.removeItem('token')
      }
    } 
    else {
      setToken(false)
    } 
  },[]);
  return (
    <>
    <ToastContainer/>
    {token==true ?<DashBoard/>:token==false?<Adminlogin/>:<Waiting/>}
    </>
  )
}

export default index
