import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MusicPlayer from './pages/MusicPlayer';
import LogoIcon from './assets/logo.jpg';
import useScrollTo from './utils/useScrollTo';
import { storage, firestore } from './utils/firebaseConfig.js';
import { Music } from 'lucide-react';

function App() {
  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedDarkMode = localStorage.getItem('darkMode');
    // Return the parsed value if it exists, otherwise default to false
    return savedDarkMode ? JSON.parse(savedDarkMode) : false;
  });

  // State to control music player visibility and minimized state
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Save audio playback state between player sessions
  const [playerState, setPlayerState] = useState({
    lastSongId: null,
    currentTime: 0,
    isPlaying: false
  });

  // Use a ref to store the latest player state to avoid state closure issues
  const playerStateRef = useRef(playerState);
  
  // Update ref whenever state changes
  useEffect(() => {
    playerStateRef.current = playerState;
  }, [playerState]);

  // Use our custom scroll hook
  const { handleLinkClick } = useScrollTo(64); // Assuming navbar height is 64px

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));

    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Prevent default hash behavior
  useEffect(() => {
    // Prevent the browser from jumping to the element when hash changes
    const preventScrollOnHashChange = (e) => {
      if (e.target.location.hash) {
        e.preventDefault();
      }
    };

    window.addEventListener('hashchange', preventScrollOnHashChange);

    return () => {
      window.removeEventListener('hashchange', preventScrollOnHashChange);
    };
  }, []);

  // Toggle music player visibility with improved state management
  const toggleMusicPlayer = () => {
    if (!showMusicPlayer) {
      // Opening the player from fully closed state
      setShowMusicPlayer(true);
      setIsMinimized(false);
    } else if (isMinimized) {
      // Expanding from minimized state - maintain playback
      setIsMinimized(false);
    } else {
      // Minimizing from expanded state - maintain playback
      setIsMinimized(true);
    }
  };

  // Handle minimize/maximize state with improved state preservation
  const handleMinimize = (minimized) => {
    // FIXED: Only update if the state is actually changing
    if (isMinimized !== minimized) {
      setIsMinimized(minimized);
    }
  };

  // Handle player state changes to persist between sessions
  const handlePlayerStateChange = (newState) => {
    // FIXED: Only update if something has actually changed
    if (JSON.stringify(playerStateRef.current) !== JSON.stringify(newState)) {
      setPlayerState(newState);
    }
  };

  // Close button handler for the modal
  const handleCloseModal = (e) => {
    e.stopPropagation();
    // Instead of closing completely, minimize to preserve audio state
    setIsMinimized(true);
  };

  // Create a unified component key that doesn't change during view transitions
  // This is crucial to prevent component remounting which interrupts audio
  const playerKey = "music-player";

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Navbar
        logo={LogoIcon}
        logoAlt="Portfolio Logo"
        menuItems={[
          { text: "Home", href: "#home", onClick: handleLinkClick },
          { text: "Projects", href: "#projects", onClick: handleLinkClick },
          { text: "Skills", href: "#skills", onClick: handleLinkClick },
          { text: "About", href: "#about", onClick: handleLinkClick },
          { text: "Contact", href: "#contact", onClick: handleLinkClick }
        ]}
        ctaButton={{ text: "Resume", href: "/resume" }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Music Player Toggle Button - Only show when player is not active or is minimized */}
      {(!showMusicPlayer || isMinimized) && (
        <button
          onClick={toggleMusicPlayer}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
          aria-label="Toggle Music Player"
        >
          <Music size={24} />
        </button>
      )}

      {/* 
        Main music player - rendered conditionally but with the same key
        Using the same key prevents React from unmounting and remounting
        which would interrupt audio playback
      */}
      {showMusicPlayer && (
        <>
          {/* Modal backdrop - only shown when player is expanded */}
          {!isMinimized && (
            <div 
              className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm" 
              onClick={handleCloseModal}
            >
              <div 
                className="w-full max-w-xl mx-4" 
                onClick={(e) => e.stopPropagation()}
              >
                <MusicPlayer
                  key={playerKey}
                  firestore={firestore}
                  songCollection="songs"
                  darkMode={darkMode}
                  onMinimize={handleMinimize}
                  initialState={playerState}
                  onStateChange={handlePlayerStateChange}
                  isMinimized={isMinimized} // FIXED: Pass down the current minimized state
                />
              </div>
            </div>
          )}
          
          {/* Minimized player - only shown when player is minimized */}
          {isMinimized && (
            <div className="fixed bottom-6 right-6 z-50 w-64 shadow-lg rounded-lg overflow-hidden">
              <MusicPlayer
                key={playerKey}
                firestore={firestore}
                songCollection="songs"
                darkMode={darkMode}
                onMinimize={handleMinimize}
                initialState={playerState}
                onStateChange={handlePlayerStateChange}
                isMinimized={isMinimized} // FIXED: Pass down the current minimized state
              />
            </div>
          )}
        </>
      )}

      <main className="pt-16">
        <section id="home" className="scroll-mt-16">
          <Hero darkMode={darkMode} />
        </section>
        <section id="projects" className="scroll-mt-16">
          <Projects darkMode={darkMode} />
        </section>
        <section id="skills" className="scroll-mt-16">
          <Skills darkMode={darkMode} />
        </section>
        <section id="about" className="scroll-mt-16">
          <About darkMode={darkMode} />
        </section>
        <section id="contact" className="scroll-mt-16">
          <Contact darkMode={darkMode} />
        </section>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}

export default App;