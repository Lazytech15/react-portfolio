import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';

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

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 w-full p-4 shadow-md Cal-Sans z-40 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            {logo && <img src={logo} alt={logoAlt || "Logo"} className="h-8 rounded-full" />}
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
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 focus:outline-none z-50"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMenu}
        ></div>

        {/* Mobile Menu - Slide from right */}
      <div 
        className={`fixed top-0 right-0 h-full w-64 z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-4">
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto text-center">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href || "#"}
                onClick={(e) => {
                  item.onClick && item.onClick(e);
                  setIsMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded hover:bg-opacity-20 ${
                  darkMode 
                    ? 'text-gray-200 hover:bg-gray-700' 
                    : 'text-gray-800 hover:bg-gray-200'
                } transition duration-300`}
              >
                {item.text}
              </a>
            ))}
          </div>
          
          {/* CTA Button at bottom of mobile menu */}
          {ctaButton && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={ctaButton.href || "#"}
                onClick={(e) => {
                  ctaButton.onClick && ctaButton.onClick(e);
                  setIsMenuOpen(false);
                }}
                className={`block px-4 py-3 rounded text-center ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 ' 
                    : 'bg-blue-500 hover:bg-blue-600 '
                } text-white transition duration-300`}
              >
                {ctaButton.text}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;