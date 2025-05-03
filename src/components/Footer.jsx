import React from 'react';
import { ArrowUp, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import LogoIcon from '../assets/logo.jpg';
import useScrollTo from '../utils/useScrollTo';

const Footer = ({ darkMode }) => {  // Added darkMode prop
  const { handleLinkClick } = useScrollTo();

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`py-21 h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}
      style={{
        textAlign: window.innerWidth < 768 ? 'center' : null,
      }}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${window.innerWidth < 768 ? 'text-center' : ''
          }`}
      >
        <div
          className={`grid gap-8 ${window.innerWidth < 768 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-4'
            }`}
        >
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <img
              src={LogoIcon}
              alt="Portfolio Logo"
              className="h-10 mb-4 rounded-4xl mx-auto md:mx-0"
            />
            <p className={`mb-6 max-w-md mx-auto md:mx-0 Open-Sans ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Creating beautiful, responsive websites and applications with
              modern technologies and clean, efficient code.
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <a
                href="https://github.com/Lazytech15"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a
                href="www.linkedin.com/in/emmanuel-ablao-06713b308"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
              <a
                href="mailto:emmanuelablao16@gmail.com"
                className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                aria-label="Email"
              >
                <Mail />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 Rowdies ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
            <ul className="space-y-2 Roboto-Slab">
              <li>
                <a
                  href="#home"
                  onClick={handleLinkClick}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={handleLinkClick}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  onClick={handleLinkClick}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={handleLinkClick}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={handleLinkClick}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 Rowdies ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
            <address className="not-italic Roboto-Slab">
              <p className={`mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pililla Rizal, Philippines</p>
              <div>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  <span className="block">
                    <strong>Globe:</strong>{' '}
                    <a
                      href="tel:+639955116005"
                      className="hover:text-blue-600 transition-colors"
                    >
                      +63 9955116005
                    </a>
                  </span>
                  <span className="block mt-2">
                    <strong>Smart:</strong>{' '}
                    <a
                      href="tel:+639519044954"
                      className="hover:text-blue-600 transition-colors"
                    >
                      +63 9519044954
                    </a>
                  </span>
                </p>
              </div>
              <p>
                <a
                  href="mailto:emmanuelablao16@gmail.com"
                  className={`${darkMode ? 'hover:text-white' : 'hover:text-gray-900'} transition-colors`}
                >
                  emmanuelablao16@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <hr className={`my-8 ${darkMode ? 'border-gray-800' : 'border-gray-300'}`} />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className={`text-sm mb-4 md:mb-0 National-Park ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {currentYear} Emmanuel S. Ablao. All rights reserved.
          </p>
          <button
            href="#home"
            onClick={handleLinkClick}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            aria-label="Scroll to top"
          >
            <span className="mr-2 Cal-Sans">Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;