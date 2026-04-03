"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { assets } from "../assets/assets";
import { format } from "timeago.js";
import Imgslider from '../Components/Imgslider';
import { FiSearch } from "react-icons/fi";
import Countdown from "./Countdown";
import axios from "axios";
import {
  FaUsers,
  FaHeart,
  FaThumbsDown,
  FaEye,
  FaShareAlt,
  FaStar,
  FaEllipsisH,
  FaUserCircle
} from "react-icons/fa";
const Tourlist = ({ tourplaces }) => {
  const [menu, setMenu] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const router = useRouter();

 const handleClick=async(response) =>{
    await axios.patch("/api/interactionupdate", { tourid:response._id ,actiontype:"views"});
    router.push({
      pathname: `/tourpanel/${response._id}`,
      
    });
  }



  // Filter (Search + Category)
  const filteredTours = useMemo(() => {
    return (
      tourplaces?.filter((item) => {
        const name = item.tourname?.toLowerCase() || "";
        const desc = item.description?.toLowerCase() || "";
        const searchText = search.toLowerCase();

        const matchSearch =
          name.includes(searchText) || desc.includes(searchText);

        const matchCategory =
          menu === "All" ? true : item.category === menu;

        return matchSearch && matchCategory;
      }) || []
    );
  }, [tourplaces, search, menu]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTours.length / itemsPerPage);

  const currentTours = filteredTours.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const formatCount = (num) => {
    if (!num) return "0";

    if (num >= 1000000) {
      return Math.floor(num / 1000000) + "M";
    }
    if (num >= 1000) {
      return Math.floor(num / 1000) + "K";
    }
    return num;
  };

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, menu]);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <div className="my-10"><Imgslider /></div>
      <div className="text-center my-5 md:my-10 outline-none">
        <form

          className="flex items-center w-4/5 md:w-1/3 mx-auto mt-4 bg-white shadow-md rounded-md overflow-hidden border border-gray-500 focus-within:ring-2 focus-within:ring-black transition outline-none"
        >
          {/* Icon */}
          <div className="pl-4 text-gray-500 outline-none">
            <FiSearch size={20} />
          </div>

          {/* Input */}
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-3 outline-none text-gray-700 placeholder-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Button */}
          <button
            type="submit"
            className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-all duration-300 font-medium outline-none"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div className="flex justify-center gap-6 mb-5 flex-wrap">
        {["All", "Cultural", "Weekend", "Adventure"].map((cat) => (
          <button
            key={cat}
            onClick={() => setMenu(cat)}
            className={
              menu === cat
                ? "bg-black text-white py-1 px-4 rounded-sm"
                : ""
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-10 mb-8 xl:mx-24">
        {filteredTours.length <= 0 && (
          <div className="text-md font-bold md:text-xl">
            No Tour Available...
          </div>
        )}

        {currentTours.map((item) => (
          <div
            key={item._id}
            onClick={() => handleClick(item)}
            className="max-w-[330px] bg-white rounded-md shadow-md overflow-hidden hover:shadow-xxl cursor-pointer"
          >
            <div className="relative h-[150px]">
              <Image
                src={item.image}
                alt={item.tourname}
                width={330}
                height={150}
                className="w-[330px] h-[150px] object-cover rounded-t-md border-b border-gray-500"
              />

              <div className="flex gap-1 justify-between px-2 items-center w-full absolute top-2">
                <span className="flex items-center gap-1 text-sm md:text-md font-bold text-black bg-white/60 rounded-full p-1">
                  <FaEye/> {formatCount(item.interactions[0].views ?? 10)}
                </span>

                <span className="flex items-center gap-1 px-2 py-1 bg-black/80 rounded-md text-white text-sm">
                  <FaUserCircle />
                  {formatCount(item.bookingcount)} booked
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-5 px-5">
              <span className="px-5 py-1 inline-block bg-black text-white text-sm">{item.category}</span>
              <span className="flex items-center gap-2 text-md md:text-xl">
                <FaStar className="text-yellow-400" /> {item.rating?.toFixed(1) ?? "4.1"}
              </span>
            </div>

            <div className="p-5">
              <h2 className="font-bold">{item.tourname}</h2>

              <h5 className="mb-2 text-lg font-medium text-gray-900">
                {item.title}
              </h5>

              <p className="mb-3 text-sm text-gray-700">
                {item.description
                  ?.replace(/<[^>]*>/g, "")
                  .slice(0, 100)}
                ...
              </p>

              <button
                onClick={() => handleClick(item)}
                className="flex items-center px-3 py-1 text-black font-semibold"
              >
                View
                <Image
                  src={assets.arrow}
                  width={15}
                  height={3}
                  className="ml-2"
                  alt="arrow"
                />
              </button>
            </div>


          </div>
        ))}
      </div>

      {/* Pagination (ONLY Prev & Next) */}
      {filteredTours.length > 10 && (
        <div className="flex justify-center items-center gap-6 mb-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-6 py-2 border border-black rounded-md disabled:opacity-50  cursor-pointer"
          >
            ← Prev
          </button>

          <span className="font-medium">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-6 py-2 border border-black rounded-md disabled:opacity-50 cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}

      <Countdown />
    </div>
  );
};

export default Tourlist;