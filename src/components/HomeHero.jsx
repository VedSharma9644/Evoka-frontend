import React, { useState, useEffect } from 'react';
import getTranslation from ".././languages";
import image1 from '.././assets/image1.jpg';
import image2 from '.././assets/image2.jpg';
import image3 from '.././assets/image3.jpg';
import image4 from '.././assets/image4.jpg';
import image5 from '.././assets/image5.jpg';
import image6 from '.././assets/image6.jpg';
import image7 from '.././assets/image7.jpg';
import image8 from '.././assets/image8.jpg';

import image9 from '.././assets/image9.jpg';

 const HomeHero = ({ language = 'en' }) => {
      const slides = [
        {
          image: image1,
          title: getTranslation(language, 'home_slider.1.title'),
          description: getTranslation(language, 'home_slider.1.description'),
          buttonText: getTranslation(language, 'home_slider.1.buttonText'),
          buttonLink: '#events',
        },
        {
          image: image2,
          title: getTranslation(language, 'home_slider.2.title'),
          description: getTranslation(language, 'home_slider.2.description'),
          buttonText: getTranslation(language, 'home_slider.2.buttonText'),
          buttonLink: '#create',
        },
        {
          image: image3,
          title: getTranslation(language, 'home_slider.3.title'),
          description: getTranslation(language, 'home_slider.3.description'),
          buttonText: getTranslation(language, 'home_slider.3.buttonText'),
          buttonLink: '#contacts',
        },
        {
          image: image4,
          title: getTranslation(language, 'home_slider.1.title'),
          description: getTranslation(language, 'home_slider.1.description'),
          buttonText: getTranslation(language, 'home_slider.1.buttonText'),
          buttonLink: '#contacts',
        },
        {
          image: image5,
          title: getTranslation(language, 'home_slider.2.title'),
          description: getTranslation(language, 'home_slider.2.description'),
          buttonText: getTranslation(language, 'home_slider.2.buttonText'),
          buttonLink: '#contacts',
        },
         {
          image: image6,
          title: getTranslation(language, 'home_slider.3.title'),
          description: getTranslation(language, 'home_slider.3.description'),
          buttonText: getTranslation(language, 'home_slider.3.buttonText'),
          buttonLink: '#contacts',
        },{
          image: image7,
          title: getTranslation(language, 'home_slider.1.title'),
          description: getTranslation(language, 'home_slider.1.description'),
          buttonText: getTranslation(language, 'home_slider.1.buttonText'),
          buttonLink: '#contacts',
        },
        {
          image: image8,
          title: getTranslation(language, 'home_slider.2.title'),
          description: getTranslation(language, 'home_slider.2.description'),
          buttonText: getTranslation(language, 'home_slider.2.buttonText'),
          buttonLink: '#contacts',
        },
         {
          image: image9,
          title: getTranslation(language, 'home_slider.3.title'),
          description: getTranslation(language, 'home_slider.3.description'),
          buttonText: getTranslation(language, 'home_slider.3.buttonText'),
          buttonLink: '#contacts',
        },
      ];
      const [isMobile, setIsMobile] = useState(false);
       useEffect(() => {
          const checkMobile = () => {
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
            const isMobile2 = mobileRegex.test(userAgent.toLowerCase());
      
             setIsMobile(isMobile2);
          };
      
          checkMobile();
        }, []);
      const [currentSlide, setCurrentSlide] = useState(0);

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
        e.target.style.backgroundColor = '#4b5563';
      };

      return (
        <div className="relative w-full">
          {/* Slider Section */}
          <section className="relative w-full h-[70vh] sm:h-[70vh] overflow-hidden bg-gray-200">
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
                />
                <div className="relative z-20 h-full flex  justify-center bg-black/50">
                  <div className={`text-center text-white px-4 sm:px-6 ${isMobile?'mt-25':'mt-10'}  `}>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                      {slide.title}
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevSlide}
              className="absolute left-4 bottom-1 transform -translate-y-1/2 bg-white/70 p-3 rounded-full hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 z-40"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNextSlide}
              className="absolute right-4 bottom-1 transform -translate-y-1/2 bg-white/70 p-3 rounded-full hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 z-40"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3 z-40">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-indigo-600 scale-125' : 'bg-white/70 hover:bg-white/90'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentSlide}
                />
              ))}
            </div>

            {/* Search Form Overlay for Desktop */}
            <form action={`/events`} method="GET">
            <div className="hidden sm:flex absolute inset-0 items-center justify-center z-30 mt-30">
              <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-4xl w-full mx-auto">
                <div className="flex flex-row gap-4 justify-center items-center">
                  <div className="flex-1 w-full">
                    <label className="text-sm text-white mb-1 block">{getTranslation(language, 'form.location')}</label>
                    <input name='city'
                     className="w-full p-3 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder={getTranslation(language, 'form.location')}
                     />
                     
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-sm text-white mb-1 block">{getTranslation(language, 'form.date')}</label>
                    <input
                      type="text"
                      name='date'
                      placeholder="Select dates"
                      className="w-full p-3 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-sm text-white mb-1 block">{getTranslation(language, 'form.keyword')}</label>
                    <input
                      type="text"
                      name='title'
                      placeholder="Search events..."
                      className="w-full p-3 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <button type='submit' className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200">
                    {getTranslation(language, 'form.search')}
                  </button>
                </div>
              </div>
            </div>
            </form>
          </section>

          {/* Search Form Below Slider for Mobile */}
               <form action={`/events`} method="GET"> 
          <div className="sm:hidden bg-gray-900 p-6 ">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg max-w-4xl w-full mx-auto ">
              <div className="flex flex-col gap-4 justify-center items-center">
                <div className="w-full">
                  <label className="text-sm text-white mb-1 block">{getTranslation(language, 'form.location')}</label>
                  <input name='city'
                     className="w-full p-3 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                     placeholder={getTranslation(language, 'form.location')}
                     />
                </div>
                <div className="w-full">
                  <label className="text-sm text-white mb-1 block">{getTranslation(language, 'form.date')}</label>
                 <input
                      type="text"
                      name='date'
                      placeholder="Select dates"
                      className="w-full p-3 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <div className="w-full">
                  <label className="text-sm text-white mb-1 block">{getTranslation(language, 'form.keyword')}</label>
                  <input
                      type="text"
                      name='title'
                      placeholder="Search events..."
                      className="w-full p-3 rounded-lg bg-white/80 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 w-full">
                  {getTranslation(language, 'form.search')}
                </button>
              </div>
            </div>
          </div>
            </form>
        </div>
      );
    };
export default HomeHero;