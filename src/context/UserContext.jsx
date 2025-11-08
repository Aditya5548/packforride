import { createContext, useState, useContext } from "react";
const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const [showhide, setShowhide] = useState(false);
  const [showhideoptions, setShowhideoptions] = useState(false);
  const [username, setUsername] = useState("");
  return (
    <UserContext.Provider value={{ showhide, setShowhide ,showhideoptions, setShowhideoptions,username, setUsername}}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => useContext(UserContext);
