'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

import img1 from '../assets/img1.jpg';
import img2 from '../assets/img2.webp';
import img3 from '../assets/img3.jpg';
import img4 from '../assets/img4.jpg';
import img5 from '../assets/img5.webp';

const slides = [
  {
    image: img1,
    title: 'Book Your Dream Journey',
    subtitle:
      'Explore the beauty of India with unforgettable destinations and curated travel experiences.',
  },
  {
    image: img2,
    title: 'Discover Incredible Places',
    subtitle:
      'From mountains to beaches, find the perfect escape for your next adventure.',
  },
  {
    image: img3,
    title: 'Travel With Comfort',
    subtitle:
      'Enjoy all-in-one travel packages including stays, food, transport, and activities.',
  },
  {
    image: img4,
    title: 'Create Beautiful Memories',
    subtitle:
      'Plan meaningful trips with family and friends and make every moment memorable.',
  },
  {
    image: img5,
    title: 'Start Your Journey Today',
    subtitle:
      'Search, explore, and book amazing tours across India with ease.',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative mx-auto h-[200px] w-4/5 overflow-hidden rounded-2xl shadow-xl md:w-3/4 lg:4/5 md:h-[250px] lg:h-[300px] z-0">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === current ? 'z-10 opacity-100' : 'z-0 opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/45" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white sm:px-6 md:px-10">
            <h1 className="max-w-4xl text-md font-bold leading-tight sm:text-xl md:text-5xl">
              {slide.title}
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-5 text-gray-200 sm:mt-4 sm:text-sm sm:leading-6 md:text-lg px-12">
              {slide.subtitle}
            </p>

            
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-sm text-white backdrop-blur transition hover:bg-white/30 sm:left-4 sm:p-3 sm:text-base"
        aria-label="Previous Slide"
      >
        ❮
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-sm text-white backdrop-blur transition hover:bg-white/30 sm:right-4 sm:p-3 sm:text-base"
        aria-label="Next Slide"
      >
        ❯
      </button>

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2 sm:bottom-5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-all sm:h-3 sm:w-3 ${
              index === current ? 'w-6 bg-white sm:w-8' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}