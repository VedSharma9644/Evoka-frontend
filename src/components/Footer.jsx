import React, { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import getTranslation from './../languages';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from './../axios';
const Footer = ({ language }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await axios.post('api/newsletter', { email }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      toast.success(response.data.message);
    }catch(err){
      toast.error(err.response?.data?.message || 'Failed to subscribe. Please try again.');
    }
    setEmail('');
  };

  return (
    <footer className="bg-indigo-950 text-white py-12 mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* EvoKa Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">{getTranslation(language, 'footer.about')}</h3>
            <p className="text-gray-400 mb-4">
              {getTranslation(language, 'footer.aboutDescription')}
            </p>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
              <p className="text-gray-400">via meucci 27-47122 Forlì - Italy</p>
            </div>
            <div className="flex items-center mb-2">
              <Phone className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
              <p className="text-gray-400">+39 335 6150480</p>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
              <a
                href="mailto:info@evoka.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email us at info@evoka.com"
              >
                info@evoka.info
              </a>
            </div>
          </div>

          {/* About Us Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">{getTranslation(language, 'footer.links')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/events"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'navbar.events')}
                </Link>
              </li>
              <li>
                <Link
                  to="/create-event"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'navbar.createEvent')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contacts"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'navbar.contacts')}
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'navbar.signIn')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link
                   to="contacts"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'footer.termsOfService')}
                </Link>
              </li>
              {/* <li>
                <Link
                  to="cookie-policy"
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {getTranslation(language, 'footer.cookiePolicy')}
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">{getTranslation(language, 'footer.contact')}</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-6 h-6" aria-hidden="true" />
              </a>
            </div>
            <h4 className="text-lg font-semibold mb-3">{getTranslation(language, 'footer.newsletter')}</h4>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={getTranslation(language, 'footer.newsletterPlaceholder')}
                className="px-4 py-2 bg-indigo-900 text-white border border-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition-colors duration-200"
                aria-label="Email address for newsletter"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-white hover:text-indigo-950 transition-colors duration-200"
              >
                {getTranslation(language, 'footer.newsletterSubscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-indigo-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 EvoKa. {getTranslation(language, 'footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;