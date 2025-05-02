import React, { useState } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight } from 'lucide-react';
import ProjectTwo from '../assets/ProjectsImg/dclc.jpg'
import ProjectOne from '../assets/ProjectsImg/ecr.jpg'
import ProjectThree from '../assets/ProjectsImg/nextgen.jpg'
import ProjectFour from '../assets/ProjectsImg/traysikol.jpg'

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "ECR Grade Management System",
      description: "A web application for showing grades directly to the students via email or student can access their grades through portal.",
      image: ProjectOne,
      tags: ["React", "Node.js", "Chart.js", "Sql", "php"],
      liveLink: "https://mailer.cyberdyne.top/",
      githubLink: "https://github.com/Lazytech15/ECR-SHOWGRADES",
    },
    {
      id: 2,
      title: "DCLC Healthcare Diagnostics Inc.",
      description: "A web application for managing patient records, appointments, and medical history.",
      image: ProjectTwo,
      tags: ["React", "php", "Chart.js", "Tailwind CSS"],
      liveLink: "https://dclc-healthcarediagnostic.cyberdyne.top/",
      githubLink: "https://github.com/Lazytech15/dclc-project",
    },
    {
      id: 3,
      title: "NextGen-pemss",
      description: "a web application focusing and monitoring events for the students to register and to be notified.",
      image: ProjectThree,
      tags: ["React", "Firebase", "Electron", "Taiwind CSS", "Node.js"],
      liveLink: "https://next-gen-pemss.netlify.app/",
      githubLink: "https://github.com/Lazytech15/NFC-CAPSTONE-PROJECT-FINAL",
    },
    {
      id: 4,
      title: "Traysikol",
      description: "a web application for managing and monitoring the tricycle just like grab and move-it.",
      image: ProjectFour,
      tags: ["React", "Laravel", "Taiwind CSS", "Node.js"],
      liveLink: "https://traysikol.cyberdyne.top/",
      githubLink: "https://github.com/Lazytech15/tricyhub",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  };

  const prevProject = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">
            Check out some of my recent work
          </p>
        </div>

        {/* Project Showcase */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <button 
              onClick={prevProject}
              className="absolute left-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 lg:-left-5"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={projects[currentIndex].image} 
                    alt={projects[currentIndex].title}
                    className="h-64 w-full object-cover md:h-full" 
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {projects[currentIndex].title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {projects[currentIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projects[currentIndex].tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4">
                    <a 
                      href={projects[currentIndex].liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                    <a 
                      href={projects[currentIndex].githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Code <Github className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={nextProject}
              className="absolute right-0 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 lg:-right-5"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          
          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a 
            href="https://github.com/Lazytech15"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
          >
            See More Projects <Github className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;