import React from 'react';
import { ArrowRight } from 'lucide-react';
import profile from '../assets/profile.jpg'; // Placeholder for your profile image

const Hero = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-100 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
        {/* Text content */}
        <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hi, I'm <span className="text-blue-600">Emman</span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6">
            Frontend & Back-end Developer
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            I create engaging, responsive web experiences with modern technologies.
            Passionate about clean code and intuitive user interfaces.
          </p>
          <div className="flex flex-wrap gap-4">
            <a 
              href="#projects" 
              className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Work <ArrowRight className="ml-2 h-4 w-4" />
            </a>
            <a 
              href="#contact" 
              className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
        
        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur-md opacity-75"></div>
            <div className="relative bg-white p-2 rounded-full">
              <img 
                src={profile} 
                alt="Your Portrait" 
                className="w-64 h-64 rounded-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;