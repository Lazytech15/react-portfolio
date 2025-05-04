"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle, Music, Minimize2, Maximize2, Wifi, WifiOff } from 'lucide-react'

/**
 * MusicPlayer - A React music player component with offline support
 */
const MusicPlayer = ({
  cloudinaryConfig = {
    cloudName: "dnu0wlkoi",
    musicFolder: "musics",
    coverFolder: "covers",
  },
  songList: initialSongList = [],
  onMinimize = () => {},
  initialState = null,
  onStateChange = () => {},
  darkMode = false,
  isMinimized = false,
  isOnlineStatus = true,
  isMobile = false, // New prop to detect mobile view
}) => {
  // Player states
  const [isPlaying, setIsPlaying] = useState(initialState?.isPlaying || false)
  const [currentSong, setCurrentSong] = useState(null)
  const [songList, setSongList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(initialState?.currentTime || 0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [songDurations, setSongDurations] = useState({})
  const [durationsLoaded, setDurationsLoaded] = useState(false)
  const [networkStatus, setNetworkStatus] = useState(isOnlineStatus)

  // Refs
  const audioRef = useRef(null)
  const durationAudioRef = useRef(null) // Ref for duration preloading
  const progressBarRef = useRef(null)
  const currentPlaybackTime = useRef(initialState?.currentTime || 0)
  const isInitialLoadRef = useRef(true)
  const lastSongIdRef = useRef(initialState?.lastSongId || null)

  // Update network status when prop changes
  useEffect(() => {
    setNetworkStatus(isOnlineStatus)
  }, [isOnlineStatus])

  // Process songs on initial load
  useEffect(() => {
    const processSongs = () => {
      try {
        setIsLoading(true)

        if (initialSongList.length > 0) {
          // Use the URLs directly from the song list
          setSongList(initialSongList)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error processing songs:", error)
        setIsLoading(false)
      }
    }

    processSongs()
  }, [initialSongList])

  // Create a new improved function to preload song durations
  const preloadAllDurations = async () => {
    if (songList.length === 0) return

    // Create a new audio element specifically for preloading
    const preloadAudio = new Audio()
    const tempDurations = { ...songDurations }
    let loadedCount = 0

    // Create a promise-based function to load each song's duration
    const loadDuration = (song) => {
      return new Promise((resolve) => {
        // Skip if we already have the duration
        if (tempDurations[song.id] && tempDurations[song.id] > 0) {
          resolve()
          return
        }

        const handleLoaded = () => {
          if (preloadAudio.duration && !isNaN(preloadAudio.duration)) {
            tempDurations[song.id] = preloadAudio.duration
          }
          preloadAudio.removeEventListener("loadedmetadata", handleLoaded)
          preloadAudio.removeEventListener("error", handleError)
          resolve()
        }

        const handleError = () => {
          console.error(`Failed to load duration for: ${song.name}`)
          preloadAudio.removeEventListener("loadedmetadata", handleLoaded)
          preloadAudio.removeEventListener("error", handleError)
          resolve()
        }

        preloadAudio.addEventListener("loadedmetadata", handleLoaded)
        preloadAudio.addEventListener("error", handleError)

        // Set a timeout to prevent hanging on problematic files
        const timeoutId = setTimeout(() => {
          preloadAudio.removeEventListener("loadedmetadata", handleLoaded)
          preloadAudio.removeEventListener("error", handleError)
          resolve()
        }, 3000)

        preloadAudio.src = song.cloudinaryId
        preloadAudio.load()
      })
    }

    // Load durations one by one
    for (const song of songList) {
      await loadDuration(song)
      loadedCount++
    }

    // Update state with all durations at once
    setSongDurations(tempDurations)
    setDurationsLoaded(true)

    // Clean up
    preloadAudio.src = ""
    preloadAudio.load()
  }

  // Call the preload function when song list is ready
  useEffect(() => {
    if (songList.length > 0 && !durationsLoaded) {
      preloadAllDurations()
    }
  }, [songList, durationsLoaded])

  // Set initial song
  useEffect(() => {
    if (songList.length > 0 && !currentSong) {
      if (lastSongIdRef.current) {
        const previousSong = songList.find((song) => song.id === lastSongIdRef.current)
        if (previousSong) {
          setCurrentSong(previousSong)
        } else {
          setCurrentSong(songList[0])
        }
      } else {
        setCurrentSong(songList[0])
      }
    }
  }, [songList, currentSong])

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
      currentPlaybackTime.current = audio.currentTime

      // Update parent component with current state
      onStateChange({
        currentTime: audio.currentTime,
        isPlaying,
        lastSongId: currentSong?.id,
      })
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)

      // Update the duration in songDurations for the current song
      if (currentSong) {
        setSongDurations((prev) => ({
          ...prev,
          [currentSong.id]: audio.duration,
        }))
      }

      // Restore playback position after metadata is loaded
      if (currentPlaybackTime.current > 0) {
        audio.currentTime = currentPlaybackTime.current

        if (isPlaying || (isInitialLoadRef.current && initialState?.isPlaying)) {
          playAudio()
          if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false
          }
        }
      }
    }

    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0
        playAudio()
      } else {
        // Play next song
        playNextSong()
      }
    }

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const loadedPercentage = (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100
        setLoadingProgress(loadedPercentage)
      }
    }

    // Add event listeners
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("progress", handleProgress)

    // Remove event listeners on cleanup
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("progress", handleProgress)
    }
  }, [isRepeat, currentSong, initialState, isPlaying, onStateChange])

  // Safe audio playback functions
  const playAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch((error) => {
          console.error("Playback error:", error)
          setIsPlaying(false)
        })
    }
  }

  const pauseAudio = () => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    setIsPlaying(false)
  }

  // Effect for playing/pausing
  useEffect(() => {
    if (isPlaying) {
      playAudio()
    } else {
      pauseAudio()
    }
  }, [isPlaying])

  // Effect for loading a new song
  useEffect(() => {
    if (currentSong && audioRef.current) {
      // Reset time only when song changes
      if (audioRef.current.src !== currentSong.cloudinaryId && currentSong.cloudinaryId) {
        currentPlaybackTime.current = 0
        setCurrentTime(0)
      }
    }
  }, [currentSong])

  // Effect for volume changes
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Play/pause toggle
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Seek in the song
  const handleSeek = (e) => {
    if (!progressBarRef.current) return

    const seekTime = (e.nativeEvent.offsetX / progressBarRef.current.clientWidth) * duration
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime
      setCurrentTime(seekTime)
      currentPlaybackTime.current = seekTime
    }
  }

  // Toggle mute
  const handleMuteToggle = () => {
    setIsMuted(!isMuted)
  }

  // Format time in MM:SS
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  // Handle minimize/maximize
  const toggleMinimize = () => {
    onMinimize(!isMinimized)
  }

  // Play next song
  const playNextSong = () => {
    if (songList.length <= 1) return

    let nextIndex

    if (isShuffle) {
      // Play a random song that's not the current one
      let randomIndex
      do {
        randomIndex = Math.floor(Math.random() * songList.length)
      } while (songList.length > 1 && songList[randomIndex].id === currentSong?.id)
      nextIndex = randomIndex
    } else {
      // Play the next song in the list
      const currentIndex = songList.findIndex((song) => song.id === currentSong?.id)
      nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % songList.length
    }

    // Reset current time and set new song
    currentPlaybackTime.current = 0
    setCurrentTime(0)
    setCurrentSong(songList[nextIndex])

    // Set a flag to play after the song is loaded
    // This ensures we don't have race conditions with loading metadata
    const playAfterLoad = () => {
      if (audioRef.current) {
        // Remove this listener to avoid duplicates
        audioRef.current.removeEventListener("loadeddata", playAfterLoad)
        // Ensure we're at the beginning
        audioRef.current.currentTime = 0
        // Start playing
        setIsPlaying(true)
        playAudio()
      }
    }

    // Add listener for the audio to be loaded
    if (audioRef.current) {
      audioRef.current.addEventListener("loadeddata", playAfterLoad)

      // Fallback in case the event doesn't fire
      setTimeout(() => {
        if (audioRef.current && !isPlaying) {
          playAfterLoad()
        }
      }, 300)
    }
  }

  // Play previous song
  const playPrevSong = () => {
    if (songList.length <= 1) return

    if (audioRef.current && audioRef.current.currentTime > 3) {
      // If more than 3 seconds into the song, restart it
      audioRef.current.currentTime = 0
      currentPlaybackTime.current = 0
      setCurrentTime(0)
      return
    }

    // Play the previous song
    const currentIndex = songList.findIndex((song) => song.id === currentSong?.id)
    const prevIndex = (currentIndex - 1 + songList.length) % songList.length

    // Set new song
    currentPlaybackTime.current = 0
    setCurrentTime(0)
    setCurrentSong(songList[prevIndex])

    // Set a listener to play after loading
    const playAfterLoad = () => {
      if (audioRef.current) {
        // Remove this listener to avoid duplicates
        audioRef.current.removeEventListener("loadeddata", playAfterLoad)
        // Ensure we're at the beginning
        audioRef.current.currentTime = 0
        // Start playing
        setIsPlaying(true)
        playAudio()
      }
    }

    // Add listener for the audio to be loaded
    if (audioRef.current) {
      audioRef.current.addEventListener("loadeddata", playAfterLoad)

      // Fallback in case the event doesn't fire
      setTimeout(() => {
        if (audioRef.current && !isPlaying) {
          playAfterLoad()
        }
      }, 300)
    }
  }

  // Select a specific song
  const selectSong = (song) => {
    if (currentSong?.id === song.id) {
      // If selecting the same song, just toggle play/pause
      togglePlay()
    } else {
      // Reset playback position for new song
      currentPlaybackTime.current = 0
      setCurrentTime(0)

      // Set the new song
      setCurrentSong(song)

      // Set a listener to play after the song is loaded
      const playAfterLoad = () => {
        if (audioRef.current) {
          // Remove this listener to avoid duplicates
          audioRef.current.removeEventListener("loadeddata", playAfterLoad)
          // Make sure we're at the beginning
          audioRef.current.currentTime = 0
          // Start playing
          setIsPlaying(true)
          playAudio()
        }
      }

      // Add listener for the audio to be loaded
      if (audioRef.current) {
        audioRef.current.addEventListener("loadeddata", playAfterLoad)

        // Fallback in case the event doesn't fire
        setTimeout(() => {
          if (audioRef.current && !isPlaying) {
            playAfterLoad()
          }
        }, 300)
      }
    }
  }

  // Mobile-specific styles and layouts
  if (isMobile) {
    return (
      <div
        className={`music-player-mobile ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-lg shadow-lg p-3 mx-auto`}
      >
        <audio ref={audioRef} src={currentSong?.cloudinaryId || null} preload="auto" />

        {/* Header with song info and network status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center flex-1 min-w-0">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center ${currentSong?.coverPublicId ? "p-0" : "bg-blue-500"} overflow-hidden`}
            >
              {currentSong?.coverPublicId ? (
                <img
                  src={currentSong.coverPublicId || "/placeholder.svg"}
                  alt={`Cover for ${currentSong.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.className = "w-12 h-12 rounded-lg flex items-center justify-center bg-blue-500";
                    e.target.parentElement.innerHTML =
                      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                  }}
                />
              ) : (
                <Music size={20} className="text-white" />
              )}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{currentSong?.name || "No song selected"}</h3>
              <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"} truncate`}>
                {currentSong?.artist || "Unknown Artist"}
              </p>
            </div>
          </div>

          {/* Network status indicator */}
          <div className="flex items-center mr-2">
            {networkStatus ? (
              <Wifi size={14} className="text-green-500" />
            ) : (
              <WifiOff size={14} className="text-orange-500" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div
            ref={progressBarRef}
            className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
            onClick={handleSeek}
          >
            {/* Loading progress */}
            <div
              className="absolute top-0 left-0 h-full bg-gray-400 dark:bg-gray-500 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            ></div>
            {/* Playback progress */}
            <div
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Mobile Controls - Simplified */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-1.5 rounded-full ${isShuffle ? "bg-blue-500 text-white" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Toggle Shuffle"
          >
            <Shuffle size={16} />
          </button>

          <button
            onClick={playPrevSong}
            className={`p-1.5 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Previous Song"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={togglePlay}
            className={`p-2.5 rounded-full bg-blue-500 text-white hover:bg-blue-600`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={playNextSong}
            className={`p-1.5 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Next Song"
          >
            <SkipForward size={16} />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-1.5 rounded-full ${isRepeat ? "bg-blue-500 text-white" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Toggle Repeat"
          >
            <Repeat size={16} />
          </button>
        </div>

        {/* Volume control - simplified for mobile */}
        <div className="flex items-center mb-3">
          <button
            onClick={handleMuteToggle}
            className={`p-1.5 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, ${darkMode ? "#4b5563" : "#e5e7eb"} ${volume * 100}%, ${darkMode ? "#4b5563" : "#e5e7eb"} 100%)`,
            }}
          />
        </div>

        {/* Song list - Compact for mobile */}
        {songList.length > 0 && (
          <div className={`pt-2 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-xs font-semibold">Songs</h4>
              {!durationsLoaded && <span className="text-xs text-blue-500">Loading...</span>}
            </div>
            <div className="overflow-y-auto max-h-32">
              {songList.map((song) => (
                <div
                  key={song.id}
                  onClick={() => selectSong(song)}
                  className={`py-1.5 px-2 rounded flex items-center cursor-pointer ${
                    currentSong?.id === song.id
                      ? "bg-blue-500 text-white"
                      : darkMode
                        ? "hover:bg-gray-700"
                        : "hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center overflow-hidden ${song.coverPublicId ? "p-0" : "bg-blue-600"}`}
                  >
                    {song.coverPublicId ? (
                      <img
                        src={song.coverPublicId || "/placeholder.svg"}
                        alt={`Cover for ${song.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.parentElement.innerHTML =
                            currentSong?.id === song.id && isPlaying
                              ? '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
                              : '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                        }}
                      />
                    ) : currentSong?.id === song.id && isPlaying ? (
                      <Pause size={12} className="text-white" />
                    ) : (
                      <Play size={12} className="text-white" />
                    )}
                  </div>
                  <div className="ml-2 flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">{song.name}</p>
                    <p className="text-xs opacity-75 truncate">{song.artist}</p>
                  </div>
                  <span className="text-xs">{songDurations[song.id] ? formatTime(songDurations[song.id]) : "..."}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full player view
  if (isMinimized) {
    return (
      <div
        className={`minimized-music-player ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-lg shadow-lg p-3 mx-auto flex items-center justify-between`}
      >
        <audio ref={audioRef} src={currentSong?.cloudinaryId || null} preload="auto" />

        {/* Minimized song info */}
        <div className="flex items-center flex-1 min-w-0">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentSong?.coverPublicId ? "p-0" : "bg-blue-500"} overflow-hidden`}
          >
            {currentSong?.coverPublicId ? (
              <img
                src={currentSong.coverPublicId || "/placeholder.svg"}
                alt={`Cover for ${currentSong.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.parentElement.className = "w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500"
                  e.target.parentElement.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
                }}
              />
            ) : (
              <Music size={20} className="text-white" />
            )}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{currentSong?.name || "No song selected"}</h3>
            <p className={`text-xs ${darkMode ? "text-gray-300" : "text-gray-600"} truncate`}>
              {currentSong?.artist || "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* Network status indicator */}
        <div className="mr-2">
          {networkStatus ? (
            <Wifi size={14} className="text-green-500" />
          ) : (
            <WifiOff size={14} className="text-orange-500" />
          )}
        </div>

        {/* Minimized controls */}
        <div className="flex items-center space-x-2 ml-2">
          <button
            onClick={playPrevSong}
            className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Previous Song"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={togglePlay}
            className={`p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600`}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={playNextSong}
            className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Next Song"
          >
            <SkipForward size={16} />
          </button>

          <button
            onClick={toggleMinimize}
            className={`p-1 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Maximize"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`music-player ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} rounded-lg shadow-lg p-4 max-w-xl mx-auto`}
    >
      <audio ref={audioRef} src={currentSong?.cloudinaryId || null} preload="auto" />

      {/* Header with song info, network status, and minimize button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center flex-1 min-w-0">
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center ${currentSong?.coverPublicId ? "p-0" : "bg-blue-500"} overflow-hidden`}
          >
            {currentSong?.coverPublicId ? (
              <img
                src={currentSong.coverPublicId || "/placeholder.svg"}
                alt={`Cover for ${currentSong.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.parentElement.className = "w-16 h-16 rounded-lg flex items-center justify-center bg-blue-500"
                  e.target.parentElement.innerHTML =
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>'
                }}
              />
            ) : (
              <Music size={24} className="text-white" />
            )}
          </div>
          <div className="ml-4 flex-1 min-w-0">
            <h3 className="font-semibold truncate">{currentSong?.name || "No song selected"}</h3>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"} truncate`}>
              {currentSong?.artist || "Unknown Artist"}
            </p>
          </div>
        </div>

        {/* Network status indicator */}
        <div className="flex items-center mr-2">
          {networkStatus ? (
            <div className="flex items-center">
              <Wifi size={16} className="text-green-500" />
              <span className="ml-1 text-xs text-green-500">Online</span>
            </div>
          ) : (
            <div className="flex items-center">
              <WifiOff size={16} className="text-orange-500" />
              <span className="ml-1 text-xs text-orange-500">Offline</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleMinimize}
          className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} ml-2`}
          aria-label="Minimize"
        >
          <Minimize2 size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div
          ref={progressBarRef}
          className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative"
          onClick={handleSeek}
        >
          {/* Loading progress */}
          <div
            className="absolute top-0 left-0 h-full bg-gray-400 dark:bg-gray-500 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          ></div>
          {/* Playback progress */}
          <div
            className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={() => setIsShuffle(!isShuffle)}
            className={`p-2 rounded-full ${isShuffle ? "bg-blue-500 text-white" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Toggle Shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button
            onClick={playPrevSong}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Previous Song"
          >
            <SkipBack size={18} />
          </button>
        </div>

        <button
          onClick={togglePlay}
          className={`p-3 rounded-full bg-blue-500 text-white hover:bg-blue-600`}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        <div className="flex space-x-2">
          <button
            onClick={playNextSong}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Next Song"
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={() => setIsRepeat(!isRepeat)}
            className={`p-2 rounded-full ${isRepeat ? "bg-blue-500 text-white" : darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
            aria-label="Toggle Repeat"
          >
            <Repeat size={18} />
          </button>
        </div>
      </div>

      {/* Volume control */}
      <div className="mt-4 flex items-center">
        <button
          onClick={handleMuteToggle}
          className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, ${darkMode ? "#4b5563" : "#e5e7eb"} ${volume * 100}%, ${darkMode ? "#4b5563" : "#e5e7eb"} 100%)`,
          }}
        />
      </div>

      {/* Song list with cover thumbnails */}
      {songList.length > 0 && (
        <div className={`mt-6 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-semibold">Songs</h4>
            {!durationsLoaded && <span className="text-xs text-blue-500 Open-Sans">Loading durations...</span>}
          </div>
          <div className="overflow-y-auto max-h-48">
            {songList.map((song) => (
              <div
                key={song.id}
                onClick={() => selectSong(song)}
                className={`p-2 rounded flex items-center cursor-pointer ${
                  currentSong?.id === song.id
                    ? "bg-blue-500 text-white"
                    : darkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-md flex items-center justify-center overflow-hidden ${song.coverPublicId ? "p-0" : "bg-blue-600"}`}
                >
                  {song.coverPublicId ? (
                    <img
                      src={song.coverPublicId || "/placeholder.svg"}
                      alt={`Cover for ${song.name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.parentElement.innerHTML =
                          currentSong?.id === song.id && isPlaying
                            ? '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'
                            : '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
                      }}
                    />
                  ) : currentSong?.id === song.id && isPlaying ? (
                    <Pause size={14} className="text-white" />
                  ) : (
                    <Play size={14} className="text-white" />
                  )}
                </div>
                <div className="ml-2 flex-1">
                  <p className="font-medium truncate">{song.name}</p>
                  <p className="text-xs truncate">{song.artist}</p>
                </div>
                {/* Duration for each song */}
                <span className="text-xs">{songDurations[song.id] ? formatTime(songDurations[song.id]) : "..."}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}

export default MusicPlayer
