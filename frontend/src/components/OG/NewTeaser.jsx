import React, { useState, useEffect } from 'react';

const NewTeaser = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const slides = [];

  useEffect(() => {
    setIsVisible(true);
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [slides.length]);

  // If no slides, don't render anything
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-black via-red-900 to-black">
      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("${slide.image}")`,
              filter: 'brightness(0.4) contrast(1.2)'
            }}
          />
        </div>
      ))}
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70" />
      
      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`text-center text-white z-10 transform transition-all duration-1000 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="mb-4">
            <span className="text-red-500 text-sm font-bold tracking-widest uppercase">
              {slides[currentSlide]?.subtitle}
            </span>
          </div>
          <h1 className="text-7xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 drop-shadow-2xl">
            {slides[currentSlide]?.title}
          </h1>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {slides[currentSlide]?.description}
          </p>
          <button className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <span className="relative z-10">{slides[currentSlide]?.cta}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-red-500 scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 text-white text-sm font-medium">
        <div className="flex items-center space-x-2">
          <span>SCROLL</span>
          <div className="w-px h-8 bg-red-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default NewTeaser;