import React, { useState } from 'react';
import { Facebook } from 'lucide-react';
import getTranslation from '../languages';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from '.././axios';
 
const Login = ({language,checkIfLoggedIn}) => {
  const [activeTab, setActiveTab] = useState('signIn');
  const [accountType, setAccountType] = useState('private');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [signUpData,setSignUpData ] = useState({
    username:'',
    email:'',
    password:'',
    password_confirmation:'',
    telephone:'',
    companyName:'',
    vatNumber:'',
    address:'',
    invoicingCode:''

});
const [loginData,setLoginData ] = useState({
  username:'',
   
  password:''

});
const handleInputChangeLogin = (e)=>{
  const {name,value} = e.target;
 //  console.log(name,value)
 setLoginData((prevData)=>({
   ...prevData,[name]:value
  }));
   }
   const handleInputChangeSignUp = (e)=>{
    const {name,value} = e.target;
   //  console.log(name,value)
    setSignUpData((prevData)=>({
     ...prevData,[name]:value
    }));
     }
  const handleRegisterSubmit = async(e)=>{
    e.preventDefault();
    setIsLoading(true)
    try{
      
    const res = await axios.post('api/register',{...signUpData,accountType:accountType});
    toast.success(res.data.message);
    // navigate('/login')
 
  handleLogin22({
  username:signUpData.username,
   
  password:signUpData.password

}) 

    // console.log(loginData);
// handleLogin22();
    setSignUpData({
      username:'',
      email:'',
      password:'',
      password_confirmation:'',
      telephone:'',
      companyName:'',
      vatNumber:'',
      address:'',
      invoicingCode:''
    });
    setActiveTab('signIn');
    }catch(error){
      const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error registering account';
          toast.error(errorMessage);
    }finally{
      setIsLoading(false)

    }
  }
  const handleLogin22 = async(data22)=>{
      setIsLoading(true)
    try{
      
    const res = await axios.post('api/login',data22);
    localStorage.setItem('token',res.data.token);
    toast.success(res.data.message);
    checkIfLoggedIn();
    navigate('/')
    setActiveTab('signIn');
    }catch(error){
      const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error logining';
          toast.error(errorMessage);
    }finally{
      setIsLoading(false)

    }
  }
  const handleLoginSubmit = async(e)=>{
    e.preventDefault();
    setIsLoading(true)
    try{
      
    const res = await axios.post('api/login',loginData);
    localStorage.setItem('token',res.data.token);
    toast.success(res.data.message);
    checkIfLoggedIn();
    navigate('/')
    setActiveTab('signIn');
    }catch(error){
      const errorMessage =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : 'Error logining';
          toast.error(errorMessage);
    }finally{
      setIsLoading(false)

    }
  }
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl dark:shadow-gray-700 border border-indigo-100 dark:border-indigo-900">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
          <button
            className={`flex-1 py-4 text-lg font-semibold text-center rounded-t-lg transition-all duration-200 ${
              activeTab === 'signIn'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-4 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleTabChange('signIn')}
            aria-selected={activeTab === 'signIn'}
            aria-controls="sign-in-panel"
          >
            {getTranslation(language, 'auth.login')}
          </button>
          <button
            className={`flex-1 py-4 text-lg font-semibold text-center rounded-t-lg transition-all duration-200 ${
              activeTab === 'signUp'
                ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border-b-4 border-indigo-600 dark:border-indigo-400'
                : 'text-gray-500 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleTabChange('signUp')}
            aria-selected={activeTab === 'signUp'}
            aria-controls="sign-up-panel"
          >
            {getTranslation(language, 'auth.signup')}
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === 'signIn' && (
          <form onSubmit={handleLoginSubmit}>
            <div id="sign-in-panel" role="tabpanel" aria-labelledby="sign-in-tab">
              {/* Test Credentials Notice */}
              {window.location.hostname === 'localhost' && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>🧪 Test Mode:</strong> Use these credentials for local testing:
                    <br />
                    <strong>Username:</strong> testuser
                    <br />
                    <strong>Password:</strong> testpass
                  </div>
                </div>
              )}
              <div className="space-y-6">
                <div className="text-left">
                  <label htmlFor="signInUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.username')}/{getTranslation(language, 'auth.email')}
                  </label>
                  <input
                    id="signInUsername"
                    type="text"
                    name="username"
                    value={loginData.username}
                    onChange={handleInputChangeLogin}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Enter your username"
                    aria-required="true"
                  />
                </div>
                <div className="text-left">
                  <label htmlFor="signInPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.password')}
                  </label>
                  <input
                    id="signInPassword"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleInputChangeLogin}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Enter your password"
                    aria-required="true"
                  />
                </div>
                <button
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Sign in to your account"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    getTranslation(language, 'auth.login')
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signUp' && (
          <form onSubmit={handleRegisterSubmit}>
            <div id="sign-up-panel" role="tabpanel" aria-labelledby="sign-up-tab">
              <div className="space-y-6">
                {/* Account Type */}
                <div className="text-left">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {getTranslation(language, 'auth.accountType')}
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="private"
                        checked={accountType === 'private'}
                        onChange={handleAccountTypeChange}
                        className="hidden"
                        aria-label="Private Account (Free)"
                      />
                      <span
                        className={`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                          accountType === 'private'
                            ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {accountType === 'private' && (
                          <span className="w-3 h-3 bg-white dark:bg-gray-900 rounded-full"></span>
                        )}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                        {getTranslation(language, 'auth.private')}
                      </span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="accountType"
                        value="company"
                        checked={accountType === 'company'}
                        onChange={handleAccountTypeChange}
                        className="hidden"
                        aria-label="Company (Paid)"
                      />
                      <span
                        className={`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                          accountType === 'company'
                            ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {accountType === 'company' && (
                          <span className="w-3 h-3 bg-white dark:bg-gray-900 rounded-full"></span>
                        )}
                      </span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                        {getTranslation(language, 'auth.company')}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Username */}
                <div className="text-left">
                  <label htmlFor="signUpUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.username')}
                  </label>
                  <input
                    id="signUpUsername"
                    value={signUpData.username}
                    name="username"
                    onChange={handleInputChangeSignUp}
                    type="text"
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Enter your username"
                    aria-required="true"
                    required
                  />
                </div>

                {/* Telephone Number */}
                <div className="text-left">
                  <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.telephone')}
                  </label>
                  <input
                    id="telephone"
                    value={signUpData.telephone}
                    name="telephone"
                    onChange={handleInputChangeSignUp}
                    type="tel"
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Enter your telephone number"
                    aria-required="true"
                    required
                  />
                </div>

                {/* Email */}
                <div className="text-left">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={signUpData.email}
                    name="email"
                    onChange={handleInputChangeSignUp}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Enter your email"
                    aria-required="true"
                    required
                  />
                </div>

                {/* Password */}
                <div className="text-left">
                  <label htmlFor="signUpPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.password')}
                  </label>
                  <input
                    id="signUpPassword"
                    type="password"
                    value={signUpData.password}
                    name="password"
                    onChange={handleInputChangeSignUp}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Enter your password"
                    aria-required="true"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="text-left">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {getTranslation(language, 'auth.confirmPassword')}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={signUpData.password_confirmation}
                    name="password_confirmation"
                    onChange={handleInputChangeSignUp}
                    className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                    placeholder="Confirm your password"
                    aria-required="true"
                    required
                  />
                </div>

                {/* Separator for Company Details */}
                {accountType === 'company' && (
                  <div className="relative my-6">
                    <hr className="border-t border-gray-200 dark:border-gray-600" />
                    <span className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Details
                    </span>
                  </div>
                )}

                {/* Conditional Fields for Company */}
                {accountType === 'company' && (
                  <>
                    {/* Company Name */}
                    <div className="text-left">
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {getTranslation(language, 'auth.companyName')}
                      </label>
                      <input
                        id="companyName"
                        type="text"
                        value={signUpData.companyName}
                        name="companyName"
                        onChange={handleInputChangeSignUp}
                        className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                        placeholder="Enter your company name"
                        aria-required="true"
                        required
                      />
                    </div>

                    {/* VAT Number */}
                    <div className="text-left">
                      <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {getTranslation(language, 'auth.vatNumber')}
                      </label>
                      <input
                        id="vatNumber"
                        value={signUpData.vatNumber}
                        name="vatNumber"
                        onChange={handleInputChangeSignUp}
                        type="text"
                        maxLength="11"
                        className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                        placeholder="Enter your VAT number"
                        aria-required="true"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="text-left">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {getTranslation(language, 'auth.address')}
                      </label>
                      <input
                        id="address"
                        value={signUpData.address}
                        name="address"
                        onChange={handleInputChangeSignUp}
                        type="text"
                        className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                        placeholder="Enter your address"
                        aria-required="true"
                        required
                      />
                    </div>

                    {/* Electronic Invoicing Code */}
                    <div className="text-left">
                      <label htmlFor="invoicingCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {getTranslation(language, 'auth.invoicingCode')}
                      </label>
                      <input
                        id="invoicingCode"
                        value={signUpData.invoicingCode}
                        name="invoicingCode"
                        onChange={handleInputChangeSignUp}
                        type="text"
                        className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                        placeholder="Enter your invoicing code"
                        aria-required="true"
                        required
                      />
                    </div>
                  </>
                )}

                <button
                  className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2"
                  aria-label="Sign up for an account"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    getTranslation(language, 'auth.submit')
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
        <div className="flex items-center justify-between">
          <div className="border-t border-gray-200 dark:border-gray-600 flex-1"></div>
          <span className="px-3 text-gray-500 dark:text-gray-300 text-sm">or</span>
          <div className="border-t border-gray-200 dark:border-gray-600 flex-1"></div>
        </div>
        <div className="flex space-x-4">
          <button
            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-100 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex items-center justify-center transition-all duration-200"
            aria-label="Sign in with Google"
            onClick={() => {
              window.location.href = axios.defaults.baseURL + '/auth/google';
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="25px"
              height="25px"
              className="fill-current text-gray-700 dark:text-gray-100"
            >
              <path d="M 26 2 C 13.308594 2 3 12.308594 3 25 C 3 37.691406 13.308594 48 26 48 C 35.917969 48 41.972656 43.4375 45.125 37.78125 C 48.277344 32.125 48.675781 25.480469 47.71875 20.9375 L 47.53125 20.15625 L 46.75 20.15625 L 26 20.125 L 25 20.125 L 25 30.53125 L 36.4375 30.53125 C 34.710938 34.53125 31.195313 37.28125 26 37.28125 C 19.210938 37.28125 13.71875 31.789063 13.71875 25 C 13.71875 18.210938 19.210938 12.71875 26 12.71875 C 29.050781 12.71875 31.820313 13.847656 33.96875 15.6875 L 34.6875 16.28125 L 41.53125 9.4375 L 42.25 8.6875 L 41.5 8 C 37.414063 4.277344 31.960938 2 26 2 Z M 26 4 C 31.074219 4 35.652344 5.855469 39.28125 8.84375 L 34.46875 13.65625 C 32.089844 11.878906 29.199219 10.71875 26 10.71875 C 18.128906 10.71875 11.71875 17.128906 11.71875 25 C 11.71875 32.871094 18.128906 39.28125 26 39.28125 C 32.550781 39.28125 37.261719 35.265625 38.9375 29.8125 L 39.34375 28.53125 L 27 28.53125 L 27 22.125 L 45.84375 22.15625 C 46.507813 26.191406 46.066406 31.984375 43.375 36.8125 C 40.515625 41.9375 35.320313 46 26 46 C 14.386719 46 5 36.609375 5 25 C 5 13.390625 14.386719 4 26 4 Z"/>
            </svg>
              Google
          </button>
          <button
            className="flex-1 py-3 px-4 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 flex items-center justify-center transition-all duration-200"
            aria-label="Sign in with Facebook"
            onClick={() => {
              window.location.href = axios.defaults.baseURL + '/auth/facebook';
            }}
          >
            <Facebook className="w-5 h-5 mr-2 fill-current" aria-hidden="true" />
            Facebook
          </button>
        </div>
      </div>
    </section>
);
};

export default Login;