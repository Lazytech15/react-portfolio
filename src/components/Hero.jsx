import React from 'react';
import { ArrowRight } from 'lucide-react';
import profile from '../assets/profile.jpg';

const Hero = ({ darkMode }) => {
  return (
    <div className={`py-20 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Text content */}
        <div className="md:w-1/2 mt-10 md:mt-0">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Hi, I'm Emman
          </h1>
          
          <h2 className={`text-2xl md:text-3xl font-medium mb-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Frontend & Back-end Developer
          </h2>
          
          <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            I create engaging, responsive web experiences with modern technologies.
            Passionate about clean code and intuitive user interfaces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#projects" 
              className={`px-6 py-3 rounded flex items-center justify-center gap-2 transition duration-300 ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium`}
            >
              View My Work <ArrowRight size={16} />
            </a>
            
            <a 
              href="#contact" 
              className={`px-6 py-3 rounded flex items-center justify-center gap-2 transition duration-300 ${
                darkMode ? 'border-white text-white hover:bg-gray-800' : 'border-blue-500 text-blue-500 hover:bg-gray-100'
              } border`}
            >
              Get In Touch
            </a>
          </div>
        </div>
        
        {/* Image */}
        <div className="md:w-2/5">
          <div className={`rounded-full w-64 h-64 mx-auto overflow-hidden border-4 ${
            darkMode ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-400 shadow-lg'
          }`}>
            <img 
              src={profile}
              alt="Emman - Developer" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;