import React, { useState,useEffect, useRef } from 'react';
import getTranslation from ".././languages";
import { Link,useNavigate } from 'react-router-dom';

const Navbar = ({language,setLanguage}) => {
   const navigate = useNavigate();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleMobileMenu = () => {
      setMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleLanguageDropdown = () => {
      setLanguageDropdownOpen(!isLanguageDropdownOpen);
    };

    const changeLanguage = (lang) => {
      setLanguage(lang);
      setLanguageDropdownOpen(false); // Close dropdown after selection
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setLanguageDropdownOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <nav className="bg-white shadow-lg px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-3xl font-extrabold text-indigo-600 tracking-tight">
            EvoKa.
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {/* {['Home', 'Events', 'Expired Events', 'Create Events', 'Contacts'].map((item) => (
             
            ))} */}
                    <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200"  >
                        {getTranslation(language, 'navbar.home')}
                    </Link>
                    <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200"  >
                        {getTranslation(language, 'navbar.events')}
                    </Link>
                    <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200"  >
                        {getTranslation(language, 'navbar.expiredEvents')}
                    </Link>
                    <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200"  >
                        {getTranslation(language, 'navbar.createEvent')}
                    </Link>
                    <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200"  >
                        {getTranslation(language, 'navbar.contacts')}
                    </Link>
                    
          </div>

          {/* Right Options */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="px-5 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Sign In" onClick={()=>{ navigate('/login')}}
            >
             {getTranslation(language,'navbar.signIn')}
            </button>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleLanguageDropdown}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                aria-haspopup="true"
                aria-expanded={isLanguageDropdownOpen}
                aria-label={`Current language: ${language}`}
              >
                {language}
                <svg
                  className="w-4 h-4 inline-block ml-2 -mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isLanguageDropdownOpen && (
                <div className="absolute mt-2 bg-white border border-gray-200 shadow-xl rounded-lg w-32 z-100">
                  {['English', 'Italian'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium transition-colors duration-200 z-10000"
                      aria-label={`Change language to ${lang}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Icon */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-2 transition-all duration-200"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-3 px-2 animate-slide-down">
            {/* {['Home', 'Events', 'Expired Events', 'Create Events', 'Contacts'].map((item) => (
           
            ))} */}
                <Link to="/"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200" >
                {getTranslation(language,'navbar.home')}
              </Link>
              <Link to="/"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200" >
                {getTranslation(language,'navbar.events')}
              </Link>
              <Link to="/"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200" >
                {getTranslation(language,'navbar.expiredEvents')}
              </Link>
              <Link to="/"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200" >
                {getTranslation(language,'navbar.createEvent')}
              </Link>
              <Link to="/"
                className="block px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 font-medium text-sm uppercase tracking-wide transition-colors duration-200" >
                {getTranslation(language,'navbar.contacts')}
              </Link>
            <hr className="border-gray-200" />
            <button
              className="block w-full text-left px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-lg font-medium text-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
              aria-label="Sign In" onClick={()=>{ navigate('/login')}}
            >
              {getTranslation(language,'navbar.signIn')}
            </button>
            <div className="mt-2">
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 z-99999"
                aria-label="Select language"
              >
                <option value="English">English</option>
                <option value="Italian">Italian</option>
              </select>
            </div>
          </div>
        )}
      </nav>
    );
  };


export default Navbar;
