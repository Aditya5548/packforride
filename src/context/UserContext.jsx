import { createContext, useState, useContext } from "react";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [showhide, setShowhide] = useState(false);
  const [tourdetailinfo, setTourdetailinfo] = useState(false);
  const [showhideoptions, setShowhideoptions] = useState(false);
  const [username, setUsername] = useState("");
  const [profilepanel,setProfilepanel] = useState(false);
  const [paymentpanel,setPaymentPanel]=useState(false);
  const [distance, setDistance] = useState(null);
  const [endPos, setEndPos]=useState(null);
  return (
    <UserContext.Provider value={{ showhide, setShowhide ,showhideoptions, setShowhideoptions,username, setUsername,paymentpanel,setPaymentPanel,profilepanel,setProfilepanel,tourdetailinfo, setTourdetailinfo,distance,setDistance,endPos, setEndPos}}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
