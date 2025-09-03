import { useState,useEffect, use } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import WhyChooseEvoKa from './components/WhyChooseEvoKa';
import Footer from './components/Footer';
import GoogleLogin from './components/GoogleLogin';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './ProtectedRoute';
import './App.css'
 import { Toaster } from 'react-hot-toast'; // Toast Container
import axiosClient from './axios';
import CreateEvent from './pages/CreateEvent';
import MyEvents from "./pages/MyEvents";
import ExpiredEvents from "./pages/ExpiredEvents";
import ScrollToTop from './ScrollToTop';
import AllEvents from "./pages/AllEvents";
import SingleEvent from "./pages/SingleEvent";
import PaymentCancel from "./pages/PaymentCancel";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyParticipation from "./pages/MyParticipation";
import EventChat from "./pages/EventChat";
import ContactPage from "./pages/ContactPage";
import Subscription from "./pages/Subscription";
import FeaturedEvent from "./pages/FeaturedEvent";
import PrivacyPolicy from "./components/PrivacyPolicy";

function App() {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true' || false);
    useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
 useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);
  const saved_language = localStorage.getItem('language') || 'Italian'
  const [language, setLanguage] = useState(saved_language);
  useEffect(()=>{
    localStorage.setItem('language',language);
  },[language])
  const [isLoginChecking,setIsLoginChecking] = useState(true);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [user,setUser] = useState({});
  const checkIfLoggedIn = async (e)=>{
    setIsLoginChecking(true)
    try{
      const token = localStorage.getItem('token');
      if(token==""){
        setIsLoggedIn(false);;
        setUser({});;
return;
      }
       const response = await axiosClient.get('api/user',{
        headers:{
          Authorization:`Bearer ${token}`
        }
       });
       setUser(response.data)
      //  console.log(user);
      setIsLoggedIn(true);
    }catch(error){
      setIsLoggedIn(false);

    }finally{
    setIsLoginChecking(false)

    }
  }
  useEffect(()=>{ checkIfLoggedIn() },[])
  const handleDarkModeToggle = () => {
  console.log("Dark Mode",darkMode)
  setDarkMode(!darkMode);

};
  return (
    <>
     <Router>
      
      <ScrollToTop />
     <Navbar darkMode={darkMode} setDarkMode={setDarkMode} handleDarkModeToggle={handleDarkModeToggle} language={language} setLanguage={setLanguage} isLoggedIn={isLoggedIn} user={user} checkIfLoggedIn={checkIfLoggedIn}  />

      <Routes>
      <Route path="/" element={(
          <>
          <HomeHero language={language} />
          <WhyChooseEvoKa language={language} />
          <FeaturedEvent user={user} language={language} />
          </>
        )} />   
            <Route path="login" element={(
          <>
          <Login language={language} checkIfLoggedIn={checkIfLoggedIn} />
          
          </>
        )} />      
  <Route
            path="/profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoginChecking={isLoginChecking}>
                <Sidebar  user={user}  language={language} checkIfLoggedIn={checkIfLoggedIn}>
               <Profile user={user}  language={language} checkIfLoggedIn={checkIfLoggedIn} />
               </Sidebar>
              </ProtectedRoute>
            }
          />
            <Route
            path="/subscription"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoginChecking={isLoginChecking}>
               <Subscription user={user}  language={language} checkIfLoggedIn={checkIfLoggedIn} />
              </ProtectedRoute>
            }
          />
  
            <Route
            path="/create-event"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoginChecking={isLoginChecking}>
                <Sidebar user={user}  language={language} checkIfLoggedIn={checkIfLoggedIn}>

               <CreateEvent user={user}  language={language} />
               </Sidebar>
              </ProtectedRoute>
            }
          />
                <Route
            path="/my-events"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoginChecking={isLoginChecking}>
                <Sidebar user={user}  language={language} checkIfLoggedIn={checkIfLoggedIn}>

               <MyEvents user={user}  language={language} />
               </Sidebar>
              </ProtectedRoute>
            }
          />
               <Route
            path="/my-participation"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} isLoginChecking={isLoginChecking}>
                <Sidebar user={user}  language={language} checkIfLoggedIn={checkIfLoggedIn}>

               <MyParticipation user={user}  language={language} />
               </Sidebar>
              </ProtectedRoute>
            }
          />
          
                <Route
            path="/events"
            element={
              
               <AllEvents user={user}  language={language} />
           
            }
          />
                 <Route
            path="/expired-events"
            element={
              
               <ExpiredEvents user={user}  language={language} expired={true}/>
           
            }
          />
                  <Route
            path="/events/:id"
            element={
              
               <SingleEvent isLoggedIn={isLoggedIn} user={user}  language={language} />
           
            }
          />

     <Route
            path="/events/:id/chat"
            element={
              
               <EventChat isLoggedIn={isLoggedIn} user={user}  language={language} />
           
            }
          />



          <Route path='/google_auth' element={<GoogleLogin checkIfLoggedIn={checkIfLoggedIn} />}/>
          <Route path='/payment/canceled' element={<PaymentCancel checkIfLoggedIn={checkIfLoggedIn} />}/>
          <Route path='/payment/success' element={<PaymentSuccess checkIfLoggedIn={checkIfLoggedIn} />}/>
          <Route path='/contacts' element={<ContactPage checkIfLoggedIn={checkIfLoggedIn} />}/>
          <Route path='/privacy-policy' element={<PrivacyPolicy checkIfLoggedIn={checkIfLoggedIn} />}/>
          
        </Routes>
        
        <Footer language={language} />
        <Toaster position="bottom-right" reverseOrder={false} />
        </Router>
    </>
  )
}

export default App
