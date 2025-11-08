import "@/styles/globals.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import type { AppProps } from "next/app";
import {ThemeProvider} from 'next-themes';
import Thememenus from '../Components/Thememenus';
import { UserProvider } from '../context/UserContext';
export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Thememenus/>
      <UserProvider>
      <Component {...pageProps} />
      </UserProvider>
    </ThemeProvider>
  ) 
}
