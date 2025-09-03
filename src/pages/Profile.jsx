import { useState } from 'react';
import toast from 'react-hot-toast';
 import getTranslation from '.././languages';
 import axios from '.././axios';
const Profile = ({ user, language ,checkIfLoggedIn}) => {
  const [formData, setFormData] = useState({
     name: user.name || '',
     telephone: user.telephone || '',
    accountType: user.accountType || 'private',
    companyName: user.companyName || '',
    vatNumber: user.vatNumber || '',
    address: user.address || '',
    invoicingCode: user.invoicingCode || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, accountType: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const token = localStorage.getItem('token');

      const res = await axios.post('api/update-profile', formData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
       });
       checkIfLoggedIn();
      toast.success(res.data.message || getTranslation(language, 'profile.updated'));
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Error updating profile';
      toast.error(errorMessage);
      console.log(error)
    } finally {
      setIsLoading(false);
    }
  };

 return (
    <section className="min-h-screen flex items-center justify-center py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl dark:shadow-gray-700 border border-indigo-100 dark:border-indigo-900">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 text-left">
          {getTranslation(language, 'profile.edit')}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="text-left">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {getTranslation(language, 'auth.username')}
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={user.username}
              readOnly
              className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
              placeholder={getTranslation(language, 'auth.username')}
              aria-required="true"
              required
            />
          </div>

          {/* Name */}
          <div className="text-left">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {getTranslation(language, 'profile.name')}
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
              placeholder={getTranslation(language, 'profile.name')}
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
              name="email"
              value={user.email}
              readOnly
              className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
              placeholder={getTranslation(language, 'auth.email')}
              aria-required="true"
              required
            />
          </div>

          {/* Telephone */}
          <div className="text-left">
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {getTranslation(language, 'auth.telephone')}
            </label>
            <input
              id="telephone"
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
              placeholder={getTranslation(language, 'auth.telephone')}
              aria-required="true"
              required
            />
          </div>

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
                  checked={formData.accountType === 'private'}
                  onChange={handleAccountTypeChange}
                  className="hidden"
                  aria-label="Private Account"
                />
                <span
                  className={`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                    formData.accountType === 'private'
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {formData.accountType === 'private' && (
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
                  checked={formData.accountType === 'company'}
                  onChange={handleAccountTypeChange}
                  className="hidden"
                  aria-label="Company Account"
                />
                <span
                  className={`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded-full transition-all duration-200 ${
                    formData.accountType === 'company'
                      ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-600 dark:bg-indigo-400'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {formData.accountType === 'company' && (
                    <span className="w-3 h-3 bg-white dark:bg-gray-900 rounded-full"></span>
                  )}
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                  {getTranslation(language, 'auth.company')}
                </span>
              </label>
            </div>
          </div>

          {/* Separator for Company Details */}
          {formData.accountType === 'company' && (
            <div className="relative my-6">
              <hr className="border-t border-gray-200 dark:border-gray-600" />
              <span className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Details
              </span>
            </div>
          )}

          {/* Conditional Company Fields */}
          {formData.accountType === 'company' && (
            <>
              {/* Company Name */}
              <div className="text-left">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {getTranslation(language, 'auth.companyName')}
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                  placeholder={getTranslation(language, 'auth.companyName')}
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
                  type="text"
                  name="vatNumber"
                  value={formData.vatNumber}
                  onChange={handleChange}
                  maxLength="11"
                  className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                  placeholder={getTranslation(language, 'auth.vatNumber')}
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
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                  placeholder={getTranslation(language, 'auth.address')}
                  aria-required="true"
                  required
                />
              </div>

              {/* Invoicing Code */}
              <div className="text-left">
                <label htmlFor="invoicingCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {getTranslation(language, 'auth.invoicingCode')}
                </label>
                <input
                  id="invoicingCode"
                  type="text"
                  name="invoicingCode"
                  value={formData.invoicingCode}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400 sm:text-sm transition-all duration-200"
                  placeholder={getTranslation(language, 'auth.invoicingCode')}
                  aria-required="true"
                  required
                />
              </div>
            </>
          )}

          {/* Account Created (Read-only) */}
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {getTranslation(language, 'profile.created')}
            </label>
            <p className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 sm:text-sm">
              {new Date(user.created_at).toLocaleDateString() || 'N/A'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-indigo-800 dark:hover:from-indigo-600 dark:hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-all duration-200 flex items-center justify-center gap-2"
            aria-label="Save profile changes"
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
                Updating...
              </>
            ) : (
              getTranslation(language, 'profile.save')
            )}
          </button>
        </form>
      </div>
    </section>
);
};

export default Profile;