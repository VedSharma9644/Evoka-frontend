import React from "react";
import axios from "./../axios";
import toast from "react-hot-toast";
import getTranslation from "./../languages";
  const Subscription = ({language}) => {
            const [promoCode, setPromoCode] = React.useState('');
            const [shopCode, setShopCode] = React.useState('');
            const [current,setcurrentPlan] = React.useState({});
            const handlePromoSubmit = () => {
              handlePlan(promoCode.toLowerCase());
            };
                const fetchOld = async ()=>{
                try{
                    const res = await    axios.get('api/subscription',{
                        headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
                    });
                    setcurrentPlan(res.data.data) ;
                }catch(error){
    const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error getting subscription';
          toast.error(errorMessage);  
                }
            }
            React.useEffect(()=>{
        
            fetchOld();
            },[])
            const handlePlan = async(plan)=>{
                try{
                    const token = localStorage.getItem('token');
                    const res = await axios.post('api/subscription/buy',{plan:plan},{
                        headers:{
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                }
                    });
                    if(res.data.redirect && res.data.redirect!=""){
                        window.location=res.data.redirect;
                        return;
                    }
                    fetchOld();
                    toast.success(res.data.message);
                }catch(error){
                   const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : 'Error buying subscription';
          toast.error(errorMessage);  
                }
            }
          
return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-8">
            {getTranslation(language, "Choose Your Subscription Plan")}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {/* Active Plan */}
            {current && current.price ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 text-center hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        {getTranslation(language, "Active Plan")}
                    </h2>
                    <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">€{current.price}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                        {getTranslation(language, "event.Start")}: {current.start_date} <br />
                        {getTranslation(language, "event.End")}: {current.end_date}
                    </p>
                    <button
                        className="mt-4 bg-gray-600 dark:bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-700 dark:hover:bg-gray-400 transition"
                    >
                        {getTranslation(language, "Active")}
                    </button>
                </div>
            ) : null}
            {/* 3-Month Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 text-center hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    3 {getTranslation(language, "Months")}
                </h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">€30</p>
                <button
                    className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    onClick={() => handlePlan('3month')}
                >
                    {getTranslation(language, "Subscribe")}
                </button>
            </div>
            {/* 6-Month Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 text-center hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    6 {getTranslation(language, "Months")}
                </h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">€50</p>
                <button
                    className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    onClick={() => handlePlan('6month')}
                >
                    {getTranslation(language, "Subscribe")}
                </button>
            </div>
            {/* 12-Month Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-700 p-6 text-center hover:shadow-xl dark:hover:shadow-gray-600 transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    12 {getTranslation(language, "Months")}
                </h2>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">€90</p>
                <button
                    className="mt-4 bg-blue-600 dark:bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                    onClick={() => handlePlan('12month')}
                >
                    {getTranslation(language, "Subscribe")}
                </button>
            </div>
        </div>
        {/* Promo Code Section */}
        <div className="mt-10 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {getTranslation(language, "Apply Promo Code")}
            </h3>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code (e.g., FREE1MONTH)"
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400"
                />
                <button
                    onClick={handlePromoSubmit}
                    className="bg-green-600 dark:bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
                >
                    Apply
                </button>
            </div>
        </div>
    </div>
);
        };
export default Subscription;