import React, { useState } from 'react';

const Navbar = ({ logo, logoAlt, menuItems, ctaButton }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="#home" className="flex items-center">
          <img src={logo} alt={logoAlt} className="h-10 w-auto rounded-4xl" />
        </a>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {menuItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              onClick={item.onClick}
              className="text-gray-600 hover:text-blue-600 transition duration-300"
            >
              {item.text}
            </a>
          ))}
          {ctaButton && (
            <a
              href={ctaButton.href}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              {ctaButton.text}
            </a>
          )}
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-md p-6 z-20">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => {
                    item.onClick(e);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-blue-600 transition duration-300"
                >
                  {item.text}
                </a>
              ))}
              {ctaButton && (
                <a
                  href={ctaButton.href}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300 text-center"
                >
                  {ctaButton.text}
                </a>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;