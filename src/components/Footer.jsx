import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import getTranslation from '../languages';
const Footer = ({language}) => {
  return (
    <footer className="bg-indigo-950 text-white py-12 mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* EvoKa Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">{getTranslation(language,'footer.about')}</h3>
            <p className="text-gray-400 mb-4">
            {getTranslation(language,'footer.aboutDescription')}
            </p>
            <div className="flex items-center mb-2">
              <MapPin className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
              <p className="text-gray-400">123 Event Street, Milan, Italy</p>
            </div>
            <div className="flex items-center mb-2">
              <Phone className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
              <p className="text-gray-400">+39 123 456 7890</p>
            </div>
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
              <a
                href="mailto:info@evoka.com"
                className="text-gray-400 hover:text-white transition-colors duration-200"
                aria-label="Email us at info@evoka.com"
              >
                info@evoka.com
              </a>
            </div>
          </div>

          {/* About Us Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">{getTranslation(language,'footer.links')}</h3>
            <ul className="space-y-2">
              
            <li >
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    
                  >
                    {getTranslation(language,'navbar.events')}
                  </a>
                </li>
                <li >
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    
                  >
                    {getTranslation(language,'navbar.createEvent')}
                  </a>
                </li>
                <li >
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    
                  >
                    {getTranslation(language,'navbar.contacts')}
                  </a>
                </li>
                <li >
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    
                  >
                    {getTranslation(language,'navbar.signIn')}
                  </a>
                </li>
            
            </ul>
          </div>

          {/* Legal Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
            
            <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                   
                  >
                    {getTranslation(language,'footer.privacyPolicy')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                   
                  >
                    {getTranslation(language,'footer.termsOfService')}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                   
                  >
                    {getTranslation(language,'footer.cookiePolicy')}
                  </a>
                </li>
              
            </ul>
          </div>

          {/* Connect With Us Section */}
          <div className="text-left">
            <h3 className="text-xl font-bold mb-4">{getTranslation(language,'footer.contact')}</h3>
            <div className="flex space-x-4">
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
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-indigo-800 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 EvoKa. {getTranslation(language,'footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;