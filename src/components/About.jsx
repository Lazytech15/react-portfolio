import React from 'react';
import { Calendar, MapPin, Briefcase, GraduationCap, Home } from 'lucide-react';
import avatar from '../assets/avatar.jpg';

const About = ({ darkMode }) => {
  return (
    <div className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold Rowdies mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>About Me</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          <p className={`mt-4 text-xl Open-Sans ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get to know me better
          </p>
        </div>

        <div className="md:flex items-center">
          {/* Photo */}
          <div className="md:w-1/3 mb-8 md:mb-0 hidden sm:block">
            <div className="relative">
              <img
                src={avatar}
                alt="About Me"
                className={`relative h-auto rounded-lg shadow-lg w-60 ml-20 ${darkMode ? 'ring-1 ring-gray-700' : ''}`}
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:w-2/3 Open-Sans">
            <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              I'm <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'} Cal-Sans`}>Emman</span>, an IT Student Developer
            </h3>
            <p className={`mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              I'm currently pursuing a Bachelor of Science in Information Technology at ICCT Colleges - Antipolo Branch.
              I'm passionate about web and mobile development, focusing on creating responsive, user-friendly interfaces
              that deliver exceptional user experiences.
            </p>
            <p className={`mb-8 leading-relaxed  ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              As an aspiring developer, I'm constantly learning new technologies and building projects to enhance my skills.
              I enjoy working with React, Flutter, and various web technologies. I'm enthusiastic about solving problems through
              code and creating applications that provide value to users.
            </p>

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 Open-Sans">
              <div className="flex items-center ">
                <Calendar className={`h-5 w-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Born: January 10, 1998</span>
              </div>
              <div className="flex items-center">
                <MapPin className={`h-5 w-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>From: Capalonga, Camarines Norte</span>
              </div>
              <div className="flex items-center">
                <Home className={`h-5 w-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Currently: Pililla, Rizal</span>
              </div>
              <div className="flex items-center">
                <GraduationCap className={`h-5 w-5 mr-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-700'}>Studying: BS Information Technology</span>
              </div>
            </div>

            {/* Timeline */}
            <div className={`border-l-2 border-blue-600 pl-4 space-y-6 ${darkMode ? 'border-blue-500' : ''}`}>
              <div>
                <div className="flex items-center">
                  <div className={`absolute -ml-6 p-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className={`h-3 w-3 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                  </div>
                  <h4 className={`text-lg font-semibold Rowdies ${darkMode ? 'text-white' : 'text-gray-900'}`}>BS Information Technology</h4>
                </div>
                <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Present | ICCT Colleges - Antipolo Branch</p>
                <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Currently pursuing my degree with focus on web and mobile development.</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className={`absolute -ml-6 p-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className={`h-3 w-3 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                  </div>
                  <h4 className={`text-lg font-semibold Rowdies ${darkMode ? 'text-white' : 'text-gray-900'}`}>Self-taught Web Development</h4>
                </div>
                <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Ongoing</p>
                <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Learning React, Firebase, Tailwind CSS and other modern web technologies.</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className={`absolute -ml-6 p-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                    <div className={`h-3 w-3 rounded-full ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                  </div>
                  <h4 className={`text-lg font-semibold Rowdies ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mobile App Development</h4>
                </div>
                <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-500 text-sm'}>Ongoing</p>
                <p className={`mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Exploring Flutter for cross-platform mobile application development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;