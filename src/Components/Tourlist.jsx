"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { assets } from "../assets/assets";
import { format } from "timeago.js";
import Imgslider from '../Components/Imgslider';
import { FiSearch } from "react-icons/fi";
import Countdown
 from "./Countdown";
const Tourlist = ({ tourplaces }) => {
  const [menu, setMenu] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;
  const router = useRouter();

  function handleClick(response) {
    router.push({
      pathname: `/tourpanel/${response._id}`,
      query: response,
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
      <div className="my-10"><Imgslider/></div>
      <div className="text-center my-5 md:my-10">
            <form
      
      className="flex items-center w-4/5 md:w-1/3 mx-auto mt-4 bg-white shadow-md rounded-full overflow-hidden border border-gray-500 focus-within:ring-2 focus-within:ring-black transition"
    >
      {/* Icon */}
      <div className="pl-4 text-gray-500">
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
        className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-all duration-300 font-medium"
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
      <div className="flex flex-wrap justify-center gap-10 mb-16 xl:mx-24">
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

              <p className="absolute top-2 right-2 bg-black/80 text-white text-sm px-2 py-1 rounded-sm">
                {format(item.createdAt)}
              </p>
            </div>

            <p className="ml-5 mt-5 px-5 py-1 inline-block bg-black text-white text-sm">
              {item.category}
            </p>

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
        <div className="flex justify-center items-center gap-6 mb-10">
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

      <Countdown/>
    </div>
  );
};

export default Tourlist;