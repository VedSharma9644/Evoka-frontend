import React from "react";
import { useSearchParams,useNavigate } from "react-router-dom";
function GoogleLogin ({checkIfLoggedIn}){
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navvigate = useNavigate();
    localStorage.setItem('token',token);
    checkIfLoggedIn();
    navvigate('/');
    return (   <div className="flex justify-center items-center h-screen">
        <div className="border-t-4 border-blue-500 border-solid w-16 h-16 rounded-full animate-spin"></div>
      </div>);
}
export default GoogleLogin;