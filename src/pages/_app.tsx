import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { AppProps } from "next/app";
import {ThemeProvider} from 'next-themes';
import Thememenus from '../Components/Thememenus';
import { UserProvider } from '../context/UserContext';
import Authprovider from '../Components/Authprovider/Authprovider'

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Thememenus/>
      <Authprovider>
      <UserProvider>
      <Component {...pageProps} />
      </UserProvider>
      </Authprovider>
    </ThemeProvider>
  ) 
}
