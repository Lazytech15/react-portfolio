import React from 'react';
import { ArrowUp, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import LogoIcon from '../assets/logo.jpg';
import useScrollTo from '../utils/useScrollTo';

const Footer = () => {
  const { handleLinkClick } = useScrollTo();

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-21 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <img 
              src={LogoIcon} 
              alt="Portfolio Logo" 
              className="h-10 mb-4 rounded-4xl"
            />
            <p className="text-gray-400 mb-6 max-w-md">
              Creating beautiful, responsive websites and applications with modern technologies and clean, efficient code.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter />
              </a>
              <a 
                href="mailto:your.email@example.com" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#projects" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Projects</a>
              </li>
              <li>
                <a href="#skills" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Skills</a>
              </li>
              <li>
                <a href="#about" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#contact" onClick={handleLinkClick} className="text-gray-400 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          {/* Contact info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-gray-400">
              <p className="mb-2">Pililla Rizal, Philippines</p>
              <div>
                    <p className="text-gray-400">
                    <span className="block">
                      <strong>Globe:</strong> <a href="tel:+639955116005" className="hover:text-blue-600 transition-colors">+63 9955116005</a>
                    </span>
                    <span className="block mt-2">
                      <strong>Smart:</strong> <a href="tel:+639519044954" className="hover:text-blue-600 transition-colors">+63 9519044954</a>
                    </span>
                    </p>
                  </div>
              <p>
                <a href="mailto:your.email@example.com" className="hover:text-white transition-colors">
                  emmanuelablao16@gmail.com
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <hr className="border-gray-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} Emmanuel S. Ablao. All rights reserved.
          </p>
          <button
            href="#home"
            onClick={handleLinkClick}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            aria-label="Scroll to top"
          >
            <span className="mr-2">Top</span>
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;