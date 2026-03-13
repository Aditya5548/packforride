"use client";

import React, { useState } from "react";
import axios from "axios";
import { Mail, PhoneCall, Plus, User, Users } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { ToastContainer, toast } from "react-toastify";

const Bookingpanel = ({ totalamount, passenger, tourdata, tourslot }) => {

  const { setPaymentPanel } = useUser();

  if (!tourdata || !tourslot) return null;

  const { tourname, _id } = tourdata;

  const [paymenttype, setPaymentType] = useState("Full");
  const [orderamount, setOrderamount] = useState(totalamount);
  const [remainingamount, setRemainingamount] = useState(0);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phoneno, setPhoneno] = useState("");

  const regcode = async (e) => {
    e.preventDefault();

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("usertoken")
        : null;

    try {
      const userinfo = await axios.get("/api/user", {
        params: { token: token },
      });

      const data = {
        name,
        age,
        gender,
        email,
        phoneno,
        orderamount,
        remainingamount,
        passenger,
        tourname,
        tourid: _id,
        paymenttype,
        userid: userinfo.data.userid,
        tourstartdate: tourslot.tourStartDate,
        tourenddate: tourslot.tourEndDate,
        boardingtime: tourslot.boardingTime,
        pickupaddress: tourslot.location,
        vehicletype: tourslot.vehicleType,
        facilities: tourslot.facilities,
        slotid: tourslot.id,
      };

      const response = await axios.post("/api/BookingTour", data);

      if (response.data.success) {
        setPaymentPanel(false);
        toast.success("Tour Booked Successfully");
      } else {
        toast.error("Fill correct details");
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

    const phonenofilter = (e) => {
    const value = e.target.value;

    if (value.length <= 10) {
      setPhoneno(value);
    }
  };

      const agefilter = (e) => {
    const value = e.target.value;

    if (value.length <= 2) {
      setAge(value);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-white/90 z-40">
      <div className="flex justify-center items-center h-full">

        <ToastContainer />

        <div className="flex flex-col w-9/10 md:w-[400px] py-3 bg-gray-200 rounded-lg">

          <div className="flex flex-col gap-2 px-5 py-1">
            <button
              className="text-2xl text-end cursor-pointer"
              onClick={() => setPaymentPanel(false)}
            >
              X
            </button>

            <h1 className="text-2xl text-center font-bold">
              Register Booking
            </h1>
          </div>

          <form className="pt-5" onSubmit={regcode}>

            <p className="flex gap-2 items-center mx-5 my-2 px-3 py-1">
              <b>Tourname:</b> {tourname}
            </p>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <User />
              <input
                className="outline-none px-5 py-1 w-full"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </p>

            <div className="flex gap-3 bg-white mx-5 my-2 px-3 py-1">

              <Users />

              <label>
                Male
                <input
                  type="radio"
                  name="Gender"
                  value="male"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>

              <label>
                Female
                <input
                  type="radio"
                  name="Gender"
                  value="female"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>

              <label>
                Other
                <input
                  type="radio"
                  name="Gender"
                  value="other"
                  onChange={(e) => setGender(e.target.value)}
                />
              </label>

            </div>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <Plus />
              <input
                className="outline-none px-5 py-1 w-full"
                type="number"
                placeholder="Age"
                value={age}
                min={18}
                max={70}
                onChange={agefilter}
                required
              />
            </p>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <Mail />
              <input
                className="outline-none px-5 py-1 w-full"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </p>

            <p className="flex gap-2 items-center bg-white mx-5 my-2 px-3 py-1">
              <PhoneCall />
               <input type="number" pattern="[0-9]{10}" minLength={10} maxLength={10} placeholder='Phone No' className="outline-none px-5 py-1 w-full" name="phoneno" value={phoneno} onChange={phonenofilter} required />
            </p>

            <div className="flex gap-5 text-lg bg-white my-2 mx-10 rounded-lg px-2 py-2 justify-center items-center">

              <label>
                Full Payment
                <input
                  type="radio"
                  name="paymenttype"
                  value="Full"
                  checked={paymenttype === "Full"}
                  onChange={() => {
                    setPaymentType("Full");
                    setOrderamount(totalamount);
                    setRemainingamount(0);
                  }}
                />
              </label>

              <label>
                Registration
                <input
                  type="radio"
                  name="paymenttype"
                  value="registration"
                  checked={paymenttype === "registration"}
                  onChange={() => {
                    setPaymentType("registration");
                    setOrderamount(500);
                    setRemainingamount(totalamount);
                  }}
                />
              </label>

            </div>

            <p className="flex gap-2 items-center mx-5 my-2 px-3 py-1">
              <b>Rupees:</b>
              {paymenttype === "Full"
                ? `${totalamount} + GST (18%)`
                : "500"}
            </p>
            <p className="flex justify-center">
            <button
              type="submit"
              className="bg-red-600 px-5 text-white font-bold self-center rounded-lg py-2 my-3 cursor-pointer"
            >
              Proceed For Payment
            </button>
            </p>
            

          </form>

        </div>

      </div>
    </div>
  );
};

export default Bookingpanel;