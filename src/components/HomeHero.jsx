import React, { useState, useEffect } from 'react';
import getTranslation from ".././languages";

const HomeHero = ({language}) => {
 
  const slides = [
    {
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?fit=crop&w=1920&h=1080&q=80',
        title: getTranslation(language,'home_slider.1.title'),
      description: getTranslation(language,'home_slider.1.description'),
      buttonText: getTranslation(language,'home_slider.1.buttonText'),
      buttonLink: '#events',
    },
    {
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?fit=crop&w=1920&h=1080&q=80',
      title: getTranslation(language,'home_slider.2.title'),
      description: getTranslation(language,'home_slider.2.description'),
      buttonText: getTranslation(language,'home_slider.2.buttonText'),
      buttonLink: '#create',
    },
    {
      image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?fit=crop&w=1920&h=1080&q=80',
      title: getTranslation(language,'home_slider.3.title'),
      description: getTranslation(language,'home_slider.3.description'),
      buttonText: getTranslation(language,'home_slider.3.buttonText'),
      buttonLink: '#contacts',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const handleImageLoad = (e) => {
    console.log(`Image loaded successfully: ${e.target.src}`);
  };

  const handleImageError = (e) => {
    console.error(`Failed to load image: ${e.target.src}`);
    e.target.style.backgroundColor = '#4b5563'; // Fallback background color
  };

  return (
    <section className="mt-10 relative w-full h-[70vh] overflow-hidden bg-gray-200 ">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          role="region"
          aria-label={`Slide ${index + 1} of ${slides.length}`}
          aria-hidden={index !== currentSlide}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover absolute top-0 left-0"
            loading={index === 0 ? 'eager' : 'lazy'}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{ zIndex: 1 }}
          />
          <div
            className="relative z-20 h-full flex items-center justify-center bg-black/40"
            style={{ zIndex: 2 }}
          >
            <div className="text-center text-white px-4 sm:px-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                {slide.title}
              </h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl mx-auto">
                {slide.description}
              </p>
              <a
                href={slide.buttonLink}
                className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium text-base rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                aria-label={slide.buttonText}
              >
                {slide.buttonText}
              </a>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 bottom-0 transform -translate-y-1/2 bg-white bg-opacity-70 p-3 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 z-30"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4  bottom-0 transform -translate-y-1/2 bg-white bg-opacity-70 p-3 rounded-full hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 z-30"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-indigo-600 scale-125'
                : 'bg-white bg-opacity-70 hover:bg-opacity-90'
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide}
          />
        ))}
      </div>
    </section>
  );
};

export default HomeHero;