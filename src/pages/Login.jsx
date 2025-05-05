import React, { useState } from 'react';
import { Facebook, Chrome } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('signIn');
  const [accountType, setAccountType] = useState('private');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleAccountTypeChange = (e) => {
    setAccountType(e.target.value);
  };

  return (
    <section className="min-h-screen flex items-center justify-center py-12   ">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-indigo-100">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <button
            className={`flex-1 py-4 text-lg font-semibold text-center rounded-t-lg transition-all duration-200 ${
              activeTab === 'signIn'
                ? 'bg-white text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange('signIn')}
            aria-selected={activeTab === 'signIn'}
            aria-controls="sign-in-panel"
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 text-lg font-semibold text-center rounded-t-lg transition-all duration-200 ${
              activeTab === 'signUp'
                ? 'bg-white text-indigo-600 border-b-4 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-500 hover:bg-gray-100'
            }`}
            onClick={() => handleTabChange('signUp')}
            aria-selected={activeTab === 'signUp'}
            aria-controls="sign-up-panel"
          >
            Sign Up
          </button>
        </div>

        {/* Sign In Form */}
        {activeTab === 'signIn' && (
          <div id="sign-in-panel" role="tabpanel" aria-labelledby="sign-in-tab">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-left">
              Sign In to EvoKa
            </h2>
            <div className="space-y-6">
              <div className="text-left">
                <label htmlFor="signInUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="signInUsername"
                  type="text"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your username"
                  aria-required="true"
                />
              </div>
              <div className="text-left">
                <label htmlFor="signInPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="signInPassword"
                  type="password"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                  aria-required="true"
                />
              </div>
              <button
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                aria-label="Sign in to your account"
              >
                Sign In
              </button>
              <div className="flex items-center justify-between">
                <div className="border-t border-gray-200 flex-1"></div>
                <span className="px-3 text-gray-500 text-sm">or</span>
                <div className="border-t border-gray-200 flex-1"></div>
              </div>
              <div className="flex space-x-4">
                <button
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center transition-all duration-200"
                  aria-label="Sign in with Google"
                >
                  <Chrome className="w-5 h-5 mr-2 text-gray-600" aria-hidden="true" />
                  Google
                </button>
                <button
                  className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center transition-all duration-200"
                  aria-label="Sign in with Facebook"
                >
                  <Facebook className="w-5 h-5 mr-2" aria-hidden="true" />
                  Facebook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sign Up Form */}
        {activeTab === 'signUp' && (
          <div id="sign-up-panel" role="tabpanel" aria-labelledby="sign-up-tab">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-left">
              Sign Up for EvoKa
            </h2>
            <div className="space-y-6">
              {/* Account Type */}
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Account Type
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
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {accountType === 'private' && (
                        <span className="w-3 h-3 bg-white rounded-full"></span>
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                      Private Account (Free)
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
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}
                    >
                      {accountType === 'company' && (
                        <span className="w-3 h-3 bg-white rounded-full"></span>
                      )}
                    </span>
                    <span className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors duration-200">
                      Company (Paid)
                    </span>
                  </label>
                </div>
              </div>

              {/* Username */}
              <div className="text-left">
                <label htmlFor="signUpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="signUpUsername"
                  type="text"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your username"
                  aria-required="true"
                />
              </div>

              {/* Telephone Number */}
              <div className="text-left">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone Number
                </label>
                <input
                  id="telephone"
                  type="tel"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your telephone number"
                  aria-required="true"
                />
              </div>

              {/* Email */}
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your email"
                  aria-required="true"
                />
              </div>

              {/* Password */}
              <div className="text-left">
                <label htmlFor="signUpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="signUpPassword"
                  type="password"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Enter your password"
                  aria-required="true"
                />
              </div>

              {/* Confirm Password */}
              <div className="text-left">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                  placeholder="Confirm your password"
                  aria-required="true"
                />
              </div>

              {/* Separator for Company Details */}
              {accountType === 'company' && (
                <div className="relative my-6">
                  <hr className="border-t border-gray-200" />
                  <span className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white px-3 text-sm font-medium text-gray-700">
                    Company Details
                  </span>
                </div>
              )}

              {/* Conditional Fields for Company */}
              {accountType === 'company' && (
                <>
                  {/* Company Name */}
                  <div className="text-left">
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                      placeholder="Enter your company name"
                      aria-required="true"
                    />
                  </div>

                  {/* VAT Number */}
                  <div className="text-left">
                    <label htmlFor="vatNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      VAT Number (11 digits)
                    </label>
                    <input
                      id="vatNumber"
                      type="text"
                      maxLength="11"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                      placeholder="Enter your VAT number"
                      aria-required="true"
                    />
                  </div>

                  {/* Address */}
                  <div className="text-left">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                      placeholder="Enter your address"
                      aria-required="true"
                    />
                  </div>

                  {/* Electronic Invoicing Code */}
                  <div className="text-left">
                    <label htmlFor="invoicingCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Electronic Invoicing Code
                    </label>
                    <input
                      id="invoicingCode"
                      type="text"
                      className="block w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-200"
                      placeholder="Enter your invoicing code"
                      aria-required="true"
                    />
                  </div>
                </>
              )}

              <button
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                aria-label="Sign up for an account"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Login;