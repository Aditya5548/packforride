"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaEye, FaStar } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";

const Recommended = ({ tourplaces = [], onTourClick }) => {
  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisibleCards(1);
      else if (window.innerWidth < 1024) setVisibleCards(2);
      else setVisibleCards(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCount = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return Math.floor(num / 1000000) + "M";
    if (num >= 1000) return Math.floor(num / 1000) + "K";
    return num;
  };
   const handleClick=async(response) =>{
    await axios.patch("/api/interactionupdate", { tourid:response._id ,actiontype:"views"});
    router.push({
      pathname: `/tourpanel/${response._id}`,
      
    });
  }


  const getImageUrl = (image) => {
    if (!image) return "/placeholder.jpg";
    if (image.startsWith("http")) return image;
    if (image.startsWith("/")) return image;
    return `/${image}`;
  };

  const recommendedTours = useMemo(() => {
    return [...tourplaces]
      .sort((a, b) => {
        const viewsA = a?.interactions?.[0]?.views || 0;
        const viewsB = b?.interactions?.[0]?.views || 0;
        return viewsB - viewsA;
      })
      .slice(0, 8);
  }, [tourplaces]);

  const maxIndex = Math.max(recommendedTours.length - visibleCards, 0);

  const nextSlide = () => {
    setIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    if (index > maxIndex) setIndex(maxIndex);
  }, [index, maxIndex]);

  if (recommendedTours.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto my-10 px-3 sm:px-5 lg:px-8">
      <div className="flex justify-between items-center gap-3 mb-4">
        <div>
          <h2 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900">
            Recommended Tours
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={prevSlide}
            disabled={index === 0}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
            flex items-center justify-center rounded-full bg-white shadow-md
            text-xs sm:text-sm transition
            ${
              index === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextSlide}
            disabled={index === maxIndex}
            className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
            flex items-center justify-center rounded-full bg-white shadow-md
            text-xs sm:text-sm transition
            ${
              index === maxIndex
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="overflow-hidden -mx-2">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${index * (100 / visibleCards)}%)`,
          }}
        >
          {recommendedTours.map((item) => (
            <div
              key={item._id}
              onClick={() => {onTourClick?.(item);handleClick(item);}}
              className="shrink-0 px-2"
              style={{ width: `${100 / visibleCards}%` }}
             
              
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl cursor-pointer overflow-hidden h-full">
                <div className="relative h-[145px] sm:h-[165px] lg:h-[175px] bg-gray-50">
                  <img
                    src={getImageUrl(item?.image)}
                    alt={item?.tourname || "Tour image"}
                    className="w-full h-[150px] object-cover"
                    onClick={() => handleClick(item)}
                  />

                  <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] sm:text-xs bg-white/90 px-2 py-1 rounded-full shadow-sm">
                    <FaEye />
                    {formatCount(item?.interactions?.[0]?.views || 0)}
                  </span>
                </div>

                <div className="p-3 pg-gray-50">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs sm:text-sm font-bold line-clamp-2 text-gray-900">
                      {item.tourname}
                    </h3>

                    <span className="flex items-center gap-1 text-xs sm:text-sm shrink-0">
                      <FaStar className="text-yellow-400" />
                      {item.rating ? Number(item.rating).toFixed(1) : "4.5"}
                    </span>
                  </div>

                  <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
                    {item.category}
                  </p>

                  <p className="text-[11px] sm:text-xs text-gray-700 mt-2 line-clamp-2 leading-relaxed">
                    {item.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Recommended;