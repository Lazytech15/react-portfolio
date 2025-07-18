"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Menu, X, Music, Wifi, WifiOff } from "lucide-react"
import useScrollTo from "../utils/useScrollTo"
import MusicPlayer from "../pages/MusicPlayer"

const Navbar = ({
  logo,
  logoAlt,
  menuItems,
  ctaButton,
  darkMode,
  setDarkMode,
  musicPlayerProps,
  playerState,
  handlePlayerStateChange,
  playerKey,
  audioRef,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { handleLinkClick } = useScrollTo()
  const [mobilePlayerExpanded, setMobilePlayerExpanded] = useState(false)

  // Add persistent player state
  const [mobilePlayerActive, setMobilePlayerActive] = useState(false)

  // Extract music player props
  const {
    toggleMusicPlayer,
    showMusicPlayer,
    isMinimized,
    songList,
    isLoadingSongs,
    songError,
    refetchSongs,
    networkStatus, // Extract network status from props
  } = musicPlayerProps || {}

  // Mobile-specific music player handlers
  const handleMobilePlayerToggle = () => {
    setMobilePlayerExpanded(!mobilePlayerExpanded)
    // When expanding the player, mark it as active
    if (!mobilePlayerExpanded) {
      setMobilePlayerActive(true)
    }
  }

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)

    // Don't reset music player state when closing menu
    // This is the key change - we keep the player active even when menu closes
  }

  // Toggle dark mode using the prop from parent
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full p-4 shadow-md Cal-Sans z-40 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            {logo && (
              <img
                href="#home"
                onClick={handleLinkClick}
                src={logo || "/placeholder.svg"}
                alt={logoAlt || "Logo"}
                className="h-8 rounded-full cursor-pointer"
              />
            )}

            {/* Network status indicator for mobile - visible on all screen sizes */}
            {/* <div className="ml-2 flex items-center">
              {networkStatus ? (
                <div className="flex items-center">
                  <Wifi size={14} className="text-green-500" />
                  <span className="ml-1 text-xs text-green-500 hidden xs:inline">Online</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <WifiOff size={14} className="text-orange-500" />
                  <span className="ml-1 text-xs text-orange-500 hidden xs:inline">Offline</span>
                </div>
              )}
            </div> */}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href || "#"}
                onClick={(e) => item.onClick && item.onClick(e)}
                className={`hover:text-blue-600 transition duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {item.text}
              </a>
            ))}

            {/* Dark Mode Toggle - Desktop */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700 transition duration-300"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* CTA Button */}
            {ctaButton && (
              <a
                href={ctaButton.href || "#"}
                onClick={(e) => ctaButton.onClick && ctaButton.onClick(e)}
                className={`px-4 py-2 rounded ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"} text-white transition duration-300`}
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
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Mobile Menu - Slide from right */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-50 shadow-lg transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        } ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        <div className="flex flex-col h-full pt-16 pb-6 px-4">
          <div className="flex-1 flex flex-col space-y-4 overflow-y-auto text-center Roboto-Slab">
            {/* Network status indicator in mobile menu - FIXED to always show correct status */}
            {/* <div
              className={`flex items-center justify-center p-2 rounded-md ${
                networkStatus 
                  ? "bg-green-100 dark:bg-green-900" 
                  : "bg-orange-100 dark:bg-orange-900"
              }`}
            >
              {networkStatus ? (
                <div className="flex items-center">
                  <Wifi size={16} className="text-green-500 dark:text-green-400" />
                  <span className="ml-2 text-sm text-green-700 dark:text-green-300">Online</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <WifiOff size={16} className="text-orange-500 dark:text-orange-400" />
                  <span className="ml-2 text-sm text-orange-700 dark:text-orange-300">Offline</span>
                </div>
              )}
            </div> */}

            {menuItems.map((item, index) => (
              <a
                key={index}
                href={item.href || "#"}
                onClick={(e) => {
                  item.onClick && item.onClick(e)
                  setIsMenuOpen(false)
                }}
                className={`block px-4 py-3 rounded hover:bg-opacity-20 ${
                  darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-200"
                } transition duration-300`}
              >
                {item.text}
              </a>
            ))}

            {/* Music Player Option in Mobile Menu */}
            {musicPlayerProps && (
              <>
                <button
                  onClick={handleMobilePlayerToggle}
                  className={`flex items-center justify-between px-4 py-3 rounded hover:bg-opacity-20 w-full ${
                    darkMode ? "text-gray-200 hover:bg-gray-700" : "text-gray-800 hover:bg-gray-200"
                  } transition duration-300`}
                >
                  <span className="flex items-center Rowdies">
                    <Music size={18} className="mr-2" />
                    Music Player
                  </span>
                  <div className="flex items-center">
                    {/* Network status indicator next to player status */}
                    {/* {networkStatus ? (
                      <Wifi size={14} className="text-green-500 mr-2" />
                    ) : (
                      <WifiOff size={14} className="text-orange-500 mr-2" />
                    )} */}
                    {mobilePlayerExpanded ? (
                      <X size={18} />
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white Open-Sans">
                        {playerState?.isPlaying ? "Playing" : "Open"}
                      </span>
                    )}
                  </div>
                </button>

                {/* Mobile Music Player Expansion */}
                {mobilePlayerExpanded && (
                  <div className="px-2 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg National-Park">
                    {/* Network status indicator above music player */}
                    <div className={`mb-2 flex items-center justify-center py-1 px-2 rounded-md text-xs ${
                      networkStatus 
                        ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" 
                        : "bg-orange-50 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                    }`}>
                      {networkStatus ? (
                        <><Wifi size={12} className="mr-1" /> Connected</>
                      ) : (
                        <><WifiOff size={12} className="mr-1" /> Offline Mode</>
                      )}
                    </div>
                  
                    {isLoadingSongs ? (
                      <div className="p-4 text-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm">Loading music...</p>
                      </div>
                    ) : songError ? (
                      <div className="p-4 text-center">
                        <p className="text-red-500 text-sm">Failed to load music</p>
                        <button
                          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded"
                          onClick={refetchSongs}
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <MusicPlayer
                        key={playerKey}
                        cloudinaryConfig={{ cloudName: "dnu0wlkoi" }}
                        songList={songList}
                        darkMode={darkMode}
                        onMinimize={() => setMobilePlayerExpanded(false)}
                        initialState={playerState}
                        onStateChange={handlePlayerStateChange}
                        isMinimized={false}
                        isMobile={true}
                        isOnlineStatus={networkStatus}
                        audioRef={audioRef}
                      />
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* CTA Button at bottom of mobile menu */}
          {ctaButton && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <a
                href={ctaButton.href || "#"}
                onClick={(e) => {
                  ctaButton.onClick && ctaButton.onClick(e)
                  setIsMenuOpen(false)
                }}
                className={`block px-4 py-3 rounded text-center ${
                  darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"
                } text-white transition duration-300`}
              >
                {ctaButton.text}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Persistent Mobile Music Player - Rendered outside of menu */}
      {mobilePlayerActive && !isMenuOpen && playerState?.isPlaying && (
        <div
          className={`fixed bottom-0 left-0 right-0 z-50 shadow-lg md:hidden ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
        >
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center flex-1 min-w-0">
              {/* Song cover or icon */}
              <div className="w-10 h-10 rounded-md flex items-center justify-center bg-blue-500 overflow-hidden">
                {songList?.find((s) => s.id === playerState?.lastSongId)?.coverPublicId ? (
                  <img
                    src={songList?.find((s) => s.id === playerState?.lastSongId)?.coverPublicId || "/placeholder.svg"}
                    alt="Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.parentElement.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
                    }}
                  />
                ) : (
                  <Music size={20} className="text-white" />
                )}
              </div>

              {/* Song info */}
              <div className="ml-3 flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {songList?.find((s) => s.id === playerState?.lastSongId)?.name || "Now Playing"}
                </p>
                <p className="text-xs truncate text-gray-500 dark:text-gray-400">
                  {songList?.find((s) => s.id === playerState?.lastSongId)?.artist || "Unknown"}
                </p>
              </div>
            </div>

            {/* Network status and expand button */}
            <div className="flex items-center">
              {/* Network status indicator with improved visual */}
              <div className={`mr-3 px-2 py-1 rounded-full text-xs ${
                networkStatus 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
              }`}>
                {networkStatus ? (
                  <div className="flex items-center">
                    <Wifi size={12} className="mr-1" />
                    <span className="hidden xs:inline">Online</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <WifiOff size={12} className="mr-1" />
                    <span className="hidden xs:inline">Offline</span>
                  </div>
                )}
              </div>

              {/* Expand button */}
              <button
                onClick={() => {
                  setIsMenuOpen(true)
                  setMobilePlayerExpanded(true)
                }}
                className={`p-2 rounded-full ${darkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}
              >
                <Music size={16} />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="h-1 bg-blue-500"
            style={{
              width:
                playerState?.currentTime && songList?.find((s) => s.id === playerState?.lastSongId)?.duration
                  ? `${(playerState.currentTime / songList.find((s) => s.id === playerState?.lastSongId).duration) * 100}%`
                  : "0%",
            }}
          ></div>
        </div>
      )}
    </>
  )
}

export default Navbar