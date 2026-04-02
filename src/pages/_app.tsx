import Head from "next/head";
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
    <>
      <Head>
        <title>PackForRide – Travel Packages with Food, Stay & Transport</title>
        <meta name="description" content="Book complete travel packages with PackForRide including transport, hotel stay and food. Affordable and hassle-free trips." />
        <meta name="keywords" content="travel packages, tour booking, hotel and transport package, PackForRide" />
        <link rel="icon" href="/icon.png" />
      </Head>
      <Authprovider>
        <UserProvider>
          <Component {...pageProps} />
          <ToastContainer position="top-right" />
        </UserProvider>
      </Authprovider>
    </>

  )
}
