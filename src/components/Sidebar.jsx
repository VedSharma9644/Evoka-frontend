  import React, { useState ,useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import getTranslation from './../languages';
    const Sidebar = ({ language,children }) => {
       const navigate = useNavigate();
      const [isOpen, setIsOpen] = useState(true);
        const [isMobile, setIsMobile] = useState(false);
      const navItems = [
        { name: getTranslation(language, 'navbar.home'), link:'/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: getTranslation(language, 'navbar.profile'),link:'/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: getTranslation(language, 'navbar.my-participation'),link:'/my-participation', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
        { name: getTranslation(language, 'navbar.myEvent'),link:'/my-events', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
        { name: getTranslation(language, 'navbar.logout'),link:'/login', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' },
      ];
 useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobile2 = mobileRegex.test(userAgent.toLowerCase());

      setIsOpen(!isMobile2); // true if desktop
      setIsMobile(isMobile2);
    };

    checkMobile();
  }, []);
      return (
        !isMobile?(
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-1">
            {/* Sidebar */}
            <div
              className={`${
                isOpen ? 'w-64' : 'w-16'
              } bg-gray-800 text-white transition-all duration-300 flex flex-col`}
            >
              {/* Toggle Button */}
              <div className="p-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 rounded-md hover:bg-gray-700 focus:outline-none w-full text-left"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1">
           {navItems.map((item) => {
  const isLogout = item.name === getTranslation(language, 'navbar.logout');
  const isLogin = item.link === '/login';

  const handleClick = () => {
    if (isLogout) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return isLogin ? (
    <a
      key={item.name}
      href={item.link}
      onClick={handleClick}
      className="flex items-center p-4 hover:bg-gray-700"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={item.icon}
        />
      </svg>
      {isOpen && <span className="ml-4">{item.name}</span>}
    </a>
  ) : (
    <Link
      key={item.name}
      to={item.link}
     
      className="flex items-center p-4 hover:bg-gray-700"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={item.icon}
        />
      </svg>
      {isOpen && <span className="ml-4">{item.name}</span>}
    </Link>
  );
})}

              </nav>
            </div>

            {/* Main Content Area */}
            <div
              className={`flex-1 transition-all duration-300   `}
            >
              <div className="p-6">
                {children || (
                  <>
                    <h1 className="text-2xl font-bold mb-4">Welcome</h1>
                    <p>Your app content goes here.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        ):(
           children 
        )
      );
    };
export default Sidebar;