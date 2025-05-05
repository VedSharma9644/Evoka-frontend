import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import WhyChooseEvoKa from './components/WhyChooseEvoKa';
import Footer from './components/Footer';
import Login from './pages/Login';
import './App.css'

function App() {
  const saved_language = localStorage.getItem('language') || 'English'
  const [language, setLanguage] = useState(saved_language);
  useEffect(()=>{
    localStorage.setItem('language',language);
  },[language])
 
  return (
    <>
     <Router>
     <Navbar language={language} setLanguage={setLanguage} />

      <Routes>
      <Route path="/" element={(
          <>
          <HomeHero language={language} />
          <WhyChooseEvoKa language={language} />
         
          </>
        )} />   
            <Route path="login" element={(
          <>
          <Login language={language} />
          
          </>
        )} />      

        </Routes>
        <Footer language={language} />
        </Router>
    </>
  )
}

export default App
