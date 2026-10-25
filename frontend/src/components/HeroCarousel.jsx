import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Discover the Magic of Bali",
    subtitle: "Tropical beaches, ancient temples, and vibrant culture await.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    badge: "Most Popular"
  },
  {
    id: 2,
    title: "Experience the Swiss Alps",
    subtitle: "Majestic snow peaks, scenic glacier trains, and alpine luxury.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1600&q=80",
    badge: "Trending"
  },
  {
    id: 3,
    title: "Explore Neon & Heritage in Japan",
    subtitle: "Futuristic metropolises alongside serene ancient shrines.",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80",
    badge: "Best Value"
  }
];

export default function HeroCarousel({ onExploreClick }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover brightness-75 scale-105 transform transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center items-start max-w-7xl mx-auto px-6 lg:px-12 text-white">
            <span className="bg-sky-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
              {slide.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 max-w-2xl leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-xl">
              {slide.subtitle}
            </p>
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-3 rounded-lg transition duration-200 shadow-lg shadow-sky-500/30 cursor-pointer"
            >
              Explore Destinations <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition cursor-pointer"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition cursor-pointer"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-sky-400' : 'w-2.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}