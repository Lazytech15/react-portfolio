import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ logo, logoAlt, menuItems, ctaButton, darkMode, setDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle dark mode using the prop from parent
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <nav className={`w-full p-4 shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          {logo && <img src={logo} alt={logoAlt || "Logo"} className="h-8 rounded-4xl" />}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href || "#"}
              onClick={(e) => item.onClick && item.onClick(e)}
              className={`hover:text-blue-600 transition duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              {item.text}
            </a>
          ))}
          
          {/* Dark Mode Toggle - Desktop */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* CTA Button */}
          {ctaButton && (
            <a
              href={ctaButton.href || "#"}
              onClick={(e) => ctaButton.onClick && ctaButton.onClick(e)}
              className={`px-4 py-2 rounded ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition duration-300`}
            >
              {ctaButton.text}
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Dark Mode Toggle - Mobile */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button
            onClick={toggleMenu}
            className="focus:outline-none"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden mt-4 py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="flex flex-col space-y-3">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href || "#"}
                onClick={(e) => {
                  item.onClick && item.onClick(e);
                  setIsMenuOpen(false);
                }}
                className={`hover:text-blue-600 transition duration-300 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {item.text}
              </a>
            ))}
            {ctaButton && (
              <a
                href={ctaButton.href || "#"}
                onClick={(e) => {
                  ctaButton.onClick && ctaButton.onClick(e);
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-2 rounded text-center ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition duration-300`}
              >
                {ctaButton.text}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;