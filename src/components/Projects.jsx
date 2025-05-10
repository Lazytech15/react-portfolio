import React, { useState, useEffect, useCallback } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ProjectTwo from '../assets/ProjectsImg/dclc.jpg'
import ProjectOne from '../assets/ProjectsImg/ecr.jpg'
import ProjectThree from '../assets/ProjectsImg/nextgen.jpg'
import ProjectFour from '../assets/ProjectsImg/traysikol.jpg'
import ProjectFive from '../assets/ProjectsImg/justsongstream.jpg'

const Projects = ({ darkMode }) => {
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
    {
      id: 5,
      title: "JustSongStream!",
      description: "a web application for streaming songs that can stream online and offline.",
      image: ProjectFive,
      tags: ["React", "Node.js", "Taiwind CSS", "Claudinary", "Firebase"],
      liveLink: "https://justsongstream.netlify.app/",
      githubLink: "https://github.com/Lazytech15/Just-Song",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Function to advance to next project
  const nextProject = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
  }, [projects.length]);

  // Function to go back to previous project
  const prevProject = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
  }, [projects.length]);

  // Toggle auto-play pause/play
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Auto-advance carousel every 5 seconds when not paused
  useEffect(() => {
    let intervalId;

    if (!isPaused) {
      intervalId = setInterval(() => {
        nextProject();
      }, 5000);
    }

    // Clean up interval on component unmount or when paused changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPaused, nextProject]);

  // Reset auto-play timer when manually changing slides
  const handleManualNav = (action) => {
    if (!isPaused) {
      setIsPaused(true);
      // Resume auto-play after 10 seconds of inactivity
      setTimeout(() => setIsPaused(false), 10000);
    }
    action();
  };

  return (
    <div className={`py-20 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold Rowdies mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>My Projects</h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto"></div>
          <p className={`mt-4 text-xl Open-San ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Check out some of my recent work
          </p>
        </div>

        {/* Project Showcase with Auto-Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center">
            <button
              onClick={() => handleManualNav(prevProject)}
              className={`absolute left-0 z-10 p-2 rounded-full shadow-md lg:-left-5 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                }`}
              aria-label="Previous project"
            >
              <ChevronLeft className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>

            <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="md:flex">
                <div className="md:w-1/2 relative">
                  <img
                    src={projects[currentIndex].image}
                    alt={projects[currentIndex].title}
                    className="h-64 w-full object-cover md:h-full transition-opacity duration-300"
                  />

                  {/* Play/Pause Button */}
                  <button
                    onClick={togglePause}
                    className={`absolute bottom-4 right-4 p-2 rounded-full opacity-70 hover:opacity-100 transition-opacity ${darkMode ? 'bg-gray-900' : 'bg-white'
                      }`}
                    aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
                  >
                    {isPaused ? (
                      <Play className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
                    ) : (
                      <Pause className={`h-4 w-4 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
                    )}
                  </button>
                </div>
                <div className="p-8 md:w-1/2 flex flex-col items-center md:items-start">
                  <h3 className={`text-2xl font-bold Rowdies mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontSize: window.innerWidth < 768 ? '1.5rem' : null, textAlign: 'center', width: '90%' }}>
                    {projects[currentIndex].title}
                  </h3>
                  <p className={`mb-6 Open-San text-center md:text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {projects[currentIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start Roboto-Slab">
                    {projects[currentIndex].tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-sm font-medium rounded-full ${darkMode
                            ? 'bg-blue-900 text-blue-200'
                            : 'bg-blue-100 text-blue-800'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <a
                      href={projects[currentIndex].liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 Open-Sans bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Live Demo <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                    <a
                      href={projects[currentIndex].githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center px-4 py-2 border-2 font-medium rounded-lg transition-colors Open-Sans ${darkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      Code <Github className="ml-2 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleManualNav(nextProject)}
              className={`absolute right-0 z-10 p-2 rounded-full shadow-md lg:-right-5 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                }`}
              aria-label="Next project"
            >
              <ChevronRight className={`h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  handleManualNav(() => setCurrentIndex(index));
                }}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? "bg-blue-600 w-6"
                    : darkMode ? "bg-gray-600" : "bg-gray-300"
                  }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/Lazytech15"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-6 py-3 border-2 font-medium rounded-lg transition-colors ${darkMode
                ? 'border-blue-600 text-blue-400 hover:bg-blue-900 hover:bg-opacity-30'
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
          >
            See More Projects <Github className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Projects;