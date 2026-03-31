import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { AppProps } from "next/app";
import { UserProvider } from '../context/UserContext';
import Authprovider from '../Components/Authprovider/Authprovider'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function App({ Component, pageProps }: AppProps) {
  
  return (
    
      <Authprovider>
      <UserProvider>
      <Component {...pageProps} />
      <ToastContainer position="top-right" />
      </UserProvider>
      </Authprovider>
  ) 
}
