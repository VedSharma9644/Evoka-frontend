import React, { useState, useEffect, useRef } from 'react';
import getTranslation from ".././languages";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Toast Container
import axios from './../axios';
import { Sun, Moon } from 'lucide-react';

const Navbar = ({ language, setLanguage, isLoggedIn, user,checkIfLoggedIn,darkMode,handleDarkModeToggle }) => {
  console.log("User,",user)
  const navigate = useNavigate();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
  const languageDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const toggleUserDropdown = () => {
    setUserDropdownOpen(!isUserDropdownOpen);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setLanguageDropdownOpen(false);
  };

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear auth token, update state)
    localStorage.setItem('token','');
    checkIfLoggedIn();
    navigate('/login');
    setUserDropdownOpen(false);
     setMobileMenuOpen(false);

    toast.success('Successfully logged out!');
  };
  useEffect(()=>{
       const fetchOld = async ()=>{
                try{
                    const res = await    axios.get('api/subscription',{
                        headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
                    });
                    console.log(res.data.data);
                    // setcurrentPlan(res.data.data) ;
                }catch(error){
    const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error getting subscription';
          toast.error(errorMessage);  
          console.log(error);
          navigate('subscription');
                }
            }
            if(isLoggedIn && user && user.accountType=="company"){
            fetchOld();
            }
  },[user])
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setLanguageDropdownOpen(false);
      }
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-700 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
          EvoKa.
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.home')}
          </Link>
          <Link
            to="/events"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.events')}
          </Link>
          <Link
            to="/expired-events"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.expiredEvents')}
          </Link>
          <Link
            to="/create-event"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.createEvent')}
          </Link>
          <Link
            to="/contacts"
            className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.contacts')}
          </Link>
        </div>

        {/* Right Options */}
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={toggleUserDropdown}
                className="px-5 py-2 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 flex items-center"
                aria-haspopup="true"
                aria-expanded={isUserDropdownOpen}
                aria-label={`User menu for ${user?.name}`}
              >
                {user?.username || 'User'}
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
              {isUserDropdownOpen && (
                <div className="absolute mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-xl dark:shadow-gray-700 rounded-lg w-32 z-50 right-0">
                  <Link
                    to="/profile"
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    {getTranslation(language, 'navbar.profile')}
                  </Link>
                  <Link
                    to="/my-participation"
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    {getTranslation(language, 'navbar.my-participation')}
                  </Link>
                  <Link
                    to="/my-events"
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    {getTranslation(language, 'navbar.myEvent')}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
                  >
                    {getTranslation(language, 'navbar.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="px-5 py-2 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
              aria-label="Sign In"
              onClick={() => navigate('/login')}
            >
              {getTranslation(language, 'navbar.signIn')}
            </button>
          )}
          <div className="relative" ref={languageDropdownRef}>
            <button
              onClick={toggleLanguageDropdown}
              className="px-5 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 flex items-center"
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
              <div className="absolute mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 shadow-xl dark:shadow-gray-700 rounded-lg w-32 z-50">
                {['English', 'Italian'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm font-medium transition-colors duration-200"
                    aria-label={`Change language to ${lang}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Dark Mode Toggle for Desktop */}
          <button
            onClick={handleDarkModeToggle}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: darkMode ? '#ffffff' : '#000000', // White in dark mode, black in light mode
            }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>

        {/* Hamburger Icon */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 rounded-lg p-2 transition-all duration-200"
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
        <div className="md:hidden mt-4 space-y-3 px-2 animate-slide-down bg-white dark:bg-gray-800">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.home')}
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.events')}
          </Link>
          <Link
            to="/expired-events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.expiredEvents')}
          </Link>
          <Link
            to="/create-event"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.createEvent')}
          </Link>
          <Link
            to="/contacts"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
          >
            {getTranslation(language, 'navbar.contacts')}
          </Link>
          <hr className="border-gray-200 dark:border-gray-600" />
          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
              >
                {getTranslation(language, 'navbar.profile')}
              </Link>
              <Link
                to="/my-participation"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
              >
                {getTranslation(language, 'navbar.my-participation')}
              </Link>
              <Link
                to="/my-events"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
              >
                {getTranslation(language, 'navbar.myEvent')}
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm uppercase tracking-wide transition-colors duration-200"
              >
                {getTranslation(language, 'navbar.logout')}
              </button>
            </>
          ) : (
            <button
              className="block w-full text-left px-4 py-2 border-2 border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 rounded-lg font-medium text-sm hover:bg-indigo-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200"
              aria-label="Sign In"
              onClick={() => navigate('/login')}
            >
              {getTranslation(language, 'navbar.signIn')}
            </button>
          )}
          <div className="mt-2">
            <label
              htmlFor="language"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 z-99999"
              aria-label="Select language"
            >
              <option value="English">English</option>
              <option value="Italian">Italian</option>
            </select>
          </div>
          {/* Dark Mode Toggle for Mobile */}
          <button
            onClick={handleDarkModeToggle}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
              color: darkMode ? '#ffffff' : '#000000', // White in dark mode, black in light mode
              width: '100%',
              textAlign: 'left',
              padding: '8px 16px',
            }}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
      )}
    </nav>
);
};

export default Navbar;