"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "./components/navbar"
import Hero from "./components/Hero"
import Projects from "./components/Projects"
import Skills from "./components/Skills"
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import MusicPlayer from "./pages/MusicPlayer"
import LogoIcon from "./assets/logo.jpg"
import useScrollTo from "./utils/useScrollTo"
import { Music } from "lucide-react"
// Import the cloudinary music service and offline utilities
import { cloudinaryConfig, useMusicData } from "./utils/cloudinaryMusicService"
import { registerServiceWorker, isOnline, setupOnlineOfflineHandlers } from "./utils/offline-music-service"

function App() {
  // Initialize dark mode from localStorage or default to false
  const [darkMode, setDarkMode] = useState(() => {
    // Check if we have a saved preference in localStorage
    const savedDarkMode = localStorage.getItem("darkMode")
    // Return the parsed value if it exists, otherwise default to false
    return savedDarkMode ? JSON.parse(savedDarkMode) : false
  })

  // State to control music player visibility and minimized state
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [networkStatus, setNetworkStatus] = useState(isOnline())

  // Save audio playback state between player sessions
  const [playerState, setPlayerState] = useState({
    lastSongId: null,
    currentTime: 0,
    isPlaying: false,
  })

  // Use the music data hook from our service
  const {
    songs: songList,
    isLoading: isLoadingSongs,
    error: songError,
    refetch: refetchSongs,
    isOnline: musicServiceOnline,
  } = useMusicData()

  // Use a ref to store the audio element
  const audioRef = useRef(null)

  // Use a ref to store the latest player state to avoid state closure issues
  const playerStateRef = useRef(playerState)

  // Update ref whenever state changes
  useEffect(() => {
    playerStateRef.current = playerState
  }, [playerState])

  // Update just the service worker registration part in useEffect
  // Register service worker on mount
  useEffect(() => {
    const registerSW = async () => {
      try {
        const registration = await registerServiceWorker()
        if (registration) {
          console.log("Service worker registered successfully")
        }
      } catch (error) {
        console.error("Failed to register service worker:", error)
      }
    }

    registerSW()
  }, [])

  // Set up online/offline event handlers
  useEffect(() => {
    const cleanup = setupOnlineOfflineHandlers((online) => {
      setNetworkStatus(online)
      // Show a notification when network status changes
      if (online) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Music Player", {
            body: "You are now online. Music will stream from the cloud.",
            icon: "/logo.png",
          })
        }
      } else {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Music Player", {
            body: "You are now offline. Using cached music.",
            icon: "/logo.png",
          })
        }
      }
    })

    return cleanup
  }, [])

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }, [])

  // Use our custom scroll hook
  const { handleLinkClick } = useScrollTo(64) // Assuming navbar height is 64px

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))

    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Prevent default hash behavior
  useEffect(() => {
    // Prevent the browser from jumping to the element when hash changes
    const preventScrollOnHashChange = (e) => {
      if (e.target.location.hash) {
        e.preventDefault()
      }
    }

    window.addEventListener("hashchange", preventScrollOnHashChange)

    return () => {
      window.removeEventListener("hashchange", preventScrollOnHashChange)
    }
  }, [])

  // Toggle music player visibility with improved state management
  const toggleMusicPlayer = () => {
    if (!showMusicPlayer) {
      // Opening the player from fully closed state
      setShowMusicPlayer(true)
      setIsMinimized(false)
    } else if (isMinimized) {
      // Expanding from minimized state - maintain playback
      setIsMinimized(false)
    } else {
      // Minimizing from expanded state - maintain playback
      setIsMinimized(true)
    }
  }

  // Handle minimize/maximize state with improved state preservation
  const handleMinimize = (minimized) => {
    // Only update if the state is actually changing
    if (isMinimized !== minimized) {
      setIsMinimized(minimized)
    }
  }

  // Handle player state changes to persist between sessions
  const handlePlayerStateChange = (newState) => {
    // Only update if something has actually changed
    if (JSON.stringify(playerStateRef.current) !== JSON.stringify(newState)) {
      setPlayerState(newState)

      // Update the audio ref if provided by the MusicPlayer component
      if (newState.audioElement && audioRef.current !== newState.audioElement) {
        audioRef.current = newState.audioElement
      }
    }
  }

  // Create a unified component key that doesn't change during view transitions
  // This is crucial to prevent component remounting which interrupts audio
  const playerKey = "music-player"

  return (
    <div className={darkMode ? "dark" : ""}>
      <Navbar
        logo={LogoIcon}
        logoAlt="Portfolio Logo"
        menuItems={[
          { text: "Home", href: "#home", onClick: handleLinkClick },
          { text: "Projects", href: "#projects", onClick: handleLinkClick },
          { text: "Skills", href: "#skills", onClick: handleLinkClick },
          { text: "About", href: "#about", onClick: handleLinkClick },
          { text: "Contact", href: "#contact", onClick: handleLinkClick },
        ]}
        ctaButton={{ text: "Resume", href: "/resume" }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        // Pass music player props to Navbar
        musicPlayerProps={{
          toggleMusicPlayer,
          showMusicPlayer,
          isMinimized,
          songList,
          isLoadingSongs,
          songError,
          refetchSongs,
          darkMode,
          networkStatus,
        }}
        // Pass player state management functions
        playerState={playerState}
        handlePlayerStateChange={handlePlayerStateChange}
        playerKey={playerKey}
        audioRef={audioRef}
      />

      {/* Music Player Toggle Button - Only show when player is not active or is minimized */}
      {/* Only show on desktop devices (hidden on mobile) */}
      {(!showMusicPlayer || isMinimized) && (
        <button
          onClick={toggleMusicPlayer}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all hidden md:block"
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
              onClick={() => handleMinimize(false)}
            >
              <div className="w-full max-w-xl mx-4" onClick={(e) => e.stopPropagation()}>
                {isLoadingSongs ? (
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">Loading music...</p>
                  </div>
                ) : songError ? (
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
                    <p className="text-red-500">{songError}</p>
                    <button
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={refetchSongs}
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <MusicPlayer
                    key={playerKey}
                    cloudinaryConfig={cloudinaryConfig}
                    songList={songList}
                    darkMode={darkMode}
                    onMinimize={handleMinimize}
                    initialState={playerState}
                    onStateChange={handlePlayerStateChange}
                    audioRef={audioRef}
                    isOnlineStatus={networkStatus}
                  />
                )}
              </div>
            </div>
          )}

          {/* Minimized player - only shown when player is minimized */}
          {isMinimized && (
            <div className="fixed bottom-6 right-6 z-50 w-64 shadow-lg rounded-lg overflow-hidden hidden md:block">
              {isLoadingSongs ? (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : songError ? (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-center">
                  <p className="text-red-500 text-xs">Failed to load music</p>
                </div>
              ) : (
                <MusicPlayer
                  key={playerKey}
                  cloudinaryConfig={cloudinaryConfig}
                  songList={songList}
                  darkMode={darkMode}
                  onMinimize={handleMinimize}
                  initialState={playerState}
                  onStateChange={handlePlayerStateChange}
                  isMinimized={isMinimized}
                  audioRef={audioRef}
                  isOnlineStatus={networkStatus}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Hidden audio element for maintaining playback state */}
      <div style={{ display: "none" }} id="persistent-audio-container"></div>

      <main className="pt-16">
        <section id="home" className="scroll-mt-16">
          <Hero darkMode={darkMode} audioRef={audioRef} playerState={playerState} />
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
  )
}

export default App
