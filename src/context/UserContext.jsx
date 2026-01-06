import { createContext, useState, useContext } from "react";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [showhide, setShowhide] = useState(false);
  const [showhideoptions, setShowhideoptions] = useState(false);
  const [username, setUsername] = useState("");
  const [paymentpanel,setPaymentPanel]=useState(false)
  return (
    <UserContext.Provider value={{ showhide, setShowhide ,showhideoptions, setShowhideoptions,username, setUsername,paymentpanel,setPaymentPanel}}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
