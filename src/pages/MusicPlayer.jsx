import React, { useState, useEffect, useRef } from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX,
    Repeat,
    Shuffle,
    Music,
    Minimize2,
    Maximize2
} from 'lucide-react';

/**
 * MusicPlayer - A React music player component that works with direct URLs
 */
const MusicPlayer = ({
    cloudinaryConfig = {
        cloudName: 'dnu0wlkoi',
        musicFolder: 'musics',
        coverFolder: 'covers'
    },
    songList: initialSongList = [],
    onMinimize = () => { },
    initialState = null,
    onStateChange = () => { },
    darkMode = false,
    isMinimized = false
}) => {
    // Player states
    const [isPlaying, setIsPlaying] = useState(initialState?.isPlaying || false);
    const [currentSong, setCurrentSong] = useState(null);
    const [songList, setSongList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(initialState?.currentTime || 0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [songDurations, setSongDurations] = useState({});
    // Add error state to track audio errors
    const [audioError, setAudioError] = useState(null);

    // Refs
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const currentPlaybackTime = useRef(initialState?.currentTime || 0);
    const isInitialLoadRef = useRef(true);
    const lastSongIdRef = useRef(initialState?.lastSongId || null);
    const minimizeOperationRef = useRef(false);
    const playPromiseRef = useRef(null);
    const prevMinimizedStateRef = useRef(isMinimized);
    const savedPositionRef = useRef(initialState?.currentTime || 0); // New ref for saved position

    // Debug logging
    useEffect(() => {
    }, [currentSong]);

    // Process songs on initial load
    useEffect(() => {
        const processSongs = () => {
            try {
                setIsLoading(true);

                if (initialSongList.length > 0) {
                    // Use the URLs directly from the song list
                    setSongList(initialSongList);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error processing songs:", error);
                setIsLoading(false);
            }
        };

        processSongs();
    }, [initialSongList]);

    // Set initial song
    useEffect(() => {
        if (songList.length > 0 && !currentSong) {
            if (lastSongIdRef.current) {
                const previousSong = songList.find(song => song.id === lastSongIdRef.current);
                if (previousSong) {
                    setCurrentSong(previousSong);
                } else {
                    setCurrentSong(songList[0]);
                }
            } else {
                setCurrentSong(songList[0]);
            }
        }
    }, [songList, currentSong]);

    // Monitor minimize state changes
    useEffect(() => {
        if (prevMinimizedStateRef.current !== isMinimized) {
            ;
            prevMinimizedStateRef.current = isMinimized;
        }
    }, [isMinimized]);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            currentPlaybackTime.current = audio.currentTime;
            savedPositionRef.current = audio.currentTime;

            onStateChange({
                currentTime: audio.currentTime,
                isPlaying,
                lastSongId: currentSong?.id
            });
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);

            // Update the duration in songDurations for the current song
            if (currentSong) {
                setSongDurations(prev => ({
                    ...prev,
                    [currentSong.id]: audio.duration
                }));
            }

            // Restore playback position after metadata is loaded
            if (savedPositionRef.current > 0) {
                audio.currentTime = savedPositionRef.current;

                if (isPlaying || (isInitialLoadRef.current && initialState?.isPlaying)) {
                    playAudio();
                    if (isInitialLoadRef.current) {
                        isInitialLoadRef.current = false;
                    }
                }
            }
        };

        const handleEnded = () => {
            if (isRepeat) {
                audio.currentTime = 0;
                playAudio();
            } else {
                // Play next song
                playNextSong();
            }
        };

        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const loadedPercentage = (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100;
                setLoadingProgress(loadedPercentage);
            }
        };

        const handleError = (e) => {
            console.error("Audio error:", e);
            setAudioError(`Error loading audio: ${e.target.error?.message || 'Unknown error'}`);
            setIsPlaying(false);
        };

        // Add event listeners
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('progress', handleProgress);
        audio.addEventListener('error', handleError);

        // Remove event listeners on cleanup
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('progress', handleProgress);
            audio.removeEventListener('error', handleError);
        };
    }, [isRepeat, currentSong, initialState, isPlaying, onStateChange]);

    // Safe audio playback functions
    const playAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;
        setAudioError(null); // Clear previous errors

        // Cancel any pending play promise
        if (playPromiseRef.current) {
            // We can't actually cancel it, but we can mark it as "don't care about the result"
            playPromiseRef.current = null;
        }

        const playPromise = audio.play();
        playPromiseRef.current = playPromise;

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Only update state if this is still the current play operation
                    if (playPromiseRef.current === playPromise) {
                        setIsPlaying(true);
                        playPromiseRef.current = null;
                    }
                })
                .catch(error => {
                    // Only update state if this is still the current play operation
                    if (playPromiseRef.current === playPromise) {
                        console.error("Playback error:", error);
                        if (error.name !== 'AbortError') {
                            // Only show errors that aren't from aborted operations
                            setAudioError(`Failed to play: ${error.message}`);
                            setIsPlaying(false);
                        }
                        playPromiseRef.current = null;
                    }
                });
        }
    };

    const pauseAudio = () => {
        const audio = audioRef.current;
        if (!audio) return;

        // Cancel any pending play promise
        playPromiseRef.current = null;

        audio.pause();
        setIsPlaying(false);
    };

    // Effect for playing/pausing
    useEffect(() => {
        if (!minimizeOperationRef.current) {
            if (isPlaying) {
                playAudio();
            } else {
                pauseAudio();
            }
        }
    }, [isPlaying]);

    // Effect for loading a new song
    useEffect(() => {
        if (currentSong && audioRef.current) {
            // Check if the URL is valid
            if (!currentSong.cloudinaryId) {
                console.error("Invalid song URL:", currentSong);
                setAudioError("Invalid song URL");
                return;
            }


            // If this is triggered during a minimize operation, don't change anything
            if (minimizeOperationRef.current) {
                return;
            }

            // Only change source if the URL actually changed
            if (audioRef.current.src !== currentSong.cloudinaryId) {

                // Pause before changing source to avoid errors
                if (isPlaying) {
                    pauseAudio();
                }

                // Cancel any pending play promise
                playPromiseRef.current = null;

                // Store the current position before changing the source
                const wasMinimizing = minimizeOperationRef.current;
                const storedPosition = wasMinimizing ? savedPositionRef.current : 0;

                // Update the audio source
                audioRef.current.src = currentSong.cloudinaryId;
                audioRef.current.load();

                // Only reset position if this is actually a new song
                // (not during minimize/maximize)
                if (!wasMinimizing) {
                    currentPlaybackTime.current = 0;
                    savedPositionRef.current = 0;
                    setCurrentTime(0);
                } else {
                    // Preserve the position that was saved before minimize
                    currentPlaybackTime.current = storedPosition;
                    savedPositionRef.current = storedPosition;
                }

                // Only autoplay if we're not in the middle of a minimize/maximize operation
                if (!minimizeOperationRef.current) {
                    // Use a small timeout to ensure the audio element is ready
                    setTimeout(() => {
                        setIsPlaying(true); // Auto-play when song changes
                    }, 100);
                }
            }
        }
    }, [currentSong, isPlaying]);

    // Effect for volume changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Play/pause toggle
    const togglePlay = () => {
        if (audioError) {
            // If there was an error, try reloading the audio
            if (audioRef.current && currentSong) {
                audioRef.current.src = currentSong.cloudinaryId;
                audioRef.current.load();
                setAudioError(null);
            }
        }
        setIsPlaying(!isPlaying);
    };

    // Seek in the song
    const handleSeek = (e) => {
        if (!progressBarRef.current) return;

        const seekTime = (e.nativeEvent.offsetX / progressBarRef.current.clientWidth) * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
            currentPlaybackTime.current = seekTime;
            savedPositionRef.current = seekTime;
        }
    };

    // Toggle mute
    const handleMuteToggle = () => {
        setIsMuted(!isMuted);
    };

    // Format time in MM:SS
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Fixed toggleMinimize function that properly maintains song position
    const toggleMinimize = async () => {
        try {
            // Set flag to prevent audio playback changes during minimize operation
            minimizeOperationRef.current = true;

            // Save the current play state and position
            const wasPlaying = isPlaying;
            const currentPosition = audioRef.current ? audioRef.current.currentTime : 0;

            // Store the position in all refs to ensure consistency
            savedPositionRef.current = currentPosition;
            currentPlaybackTime.current = currentPosition;
            setCurrentTime(currentPosition);

            // Pause audio temporarily during the transition
            if (audioRef.current && wasPlaying) {
                audioRef.current.pause();
            }

            // Call the parent's onMinimize function to toggle the state
            onMinimize(!isMinimized);

            // Wait for the UI to update
            await new Promise(resolve => setTimeout(resolve, 300));

            // After UI update, ensure the audio element is properly set up
            if (audioRef.current && currentSong) {
                // Make sure we have the correct audio source
                if (audioRef.current.src !== currentSong.cloudinaryId) {
                    // If the source changed (which shouldn't happen in normal minimize/maximize),
                    // load the correct source
                    audioRef.current.src = currentSong.cloudinaryId;
                    audioRef.current.load();

                    // Set up event listener to restore position after loading
                    const handleLoadedData = () => {
                        audioRef.current.removeEventListener('loadeddata', handleLoadedData);

                        // Critical: Restore the exact position saved before transition
                        audioRef.current.currentTime = currentPosition;

                        // Resume playback if it was playing before
                        if (wasPlaying) {
                            playAudio();
                        }
                    };

                    audioRef.current.addEventListener('loadeddata', handleLoadedData);
                } else {
                    // If the source is already correct (normal case),
                    // just restore the position directly
                    audioRef.current.currentTime = currentPosition;

                    // Resume playback if it was playing before
                    if (wasPlaying) {
                        playAudio();
                    }
                }
            }

            // Reset the minimize operation flag
            minimizeOperationRef.current = false;
        } catch (error) {
            console.error("Error in toggleMinimize:", error);
            minimizeOperationRef.current = false;
        }
    };

    // Play next song
    const playNextSong = () => {
        if (songList.length <= 1) return;

        let nextIndex;

        if (isShuffle) {
            // Play a random song that's not the current one
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songList.length);
            } while (songList.length > 1 && songList[randomIndex].id === currentSong?.id);
            nextIndex = randomIndex;
        } else {
            // Play the next song in the list
            const currentIndex = songList.findIndex(song => song.id === currentSong?.id);
            nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % songList.length;
            setIsPlaying(true);
            playAudio();
        }

        // Reset any pending play promises
        playPromiseRef.current = null;

        // Pause current playback
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Update current song first
        const nextSong = songList[nextIndex];
        setCurrentSong(nextSong);

        // Reset current time
        currentPlaybackTime.current = 0;
        savedPositionRef.current = 0;
        setCurrentTime(0);

        // Use a small timeout before starting playback to avoid race conditions
        setTimeout(() => {
            // This ensures we explicitly set isPlaying to true
            // and the useEffect for isPlaying will trigger playback
            setIsPlaying(true);
        }, 100);
    }

    // Play previous song
    const playPrevSong = () => {
        if (songList.length <= 1) return;

        if (audioRef.current && audioRef.current.currentTime > 3) {
            // If more than 3 seconds into the song, restart it
            audioRef.current.currentTime = 0;
            currentPlaybackTime.current = 0;
            savedPositionRef.current = 0;
            setCurrentTime(0);

            // Ensure it's playing
            setIsPlaying(true);
            playAudio();
            return;
        }

        // Reset any pending play promises
        playPromiseRef.current = null;

        // Pause current playback
        if (audioRef.current) {
            audioRef.current.pause();
        }

        // Play the previous song
        const currentIndex = songList.findIndex(song => song.id === currentSong?.id);
        const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
        const prevSong = songList[prevIndex];

        // Set new song
        setCurrentSong(prevSong);

        // Reset current time
        currentPlaybackTime.current = 0;
        savedPositionRef.current = 0;
        setCurrentTime(0);

        // Use a small timeout before starting playback to avoid race conditions
        setTimeout(() => {
            // Set playing to true to trigger playback in isPlaying useEffect
            setIsPlaying(true);
        }, 100);
    }

    // Select a specific song
    const selectSong = (song) => {
        if (currentSong?.id === song.id) {
            // If selecting the same song, just toggle play/pause
            togglePlay();
        } else {
            // Reset any pending play promises
            playPromiseRef.current = null;

            // Pause current playback
            if (audioRef.current) {
                audioRef.current.pause();
            }

            // Reset playback position for new song
            setCurrentSong(song);
            currentPlaybackTime.current = 0;
            savedPositionRef.current = 0;

            // Use a small timeout before starting playback to avoid race conditions
            setTimeout(() => {
                // Set playing flag to true to trigger playback
                setIsPlaying(true);
            }, 100);
        }
    };

    // Minimized player view in the right bottom corner
    if (isMinimized) {
        return (
            <div className={`fixed bottom-4 right-4 z-50 minimized-music-player ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-2 flex items-center`} style={{ maxWidth: '320px' }}>
                <audio
                    ref={audioRef}
                    preload="auto"
                />

                {/* Cover image */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentSong?.coverPublicId ? 'p-0' : 'bg-blue-500'} overflow-hidden`}>
                    {currentSong?.coverPublicId ? (
                        <img
                            src={currentSong.coverPublicId}
                            alt={`Cover for ${currentSong.name}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.className = "w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500";
                                e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                            }}
                        />
                    ) : (
                        <Music size={16} className="text-white" />
                    )}
                </div>

                {/* Super-minimal controls */}
                <div className="flex items-center space-x-1 ml-2">
                    <button
                        onClick={playPrevSong}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        aria-label="Previous Song"
                    >
                        <SkipBack size={14} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className={`p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600`}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>

                    <button
                        onClick={playNextSong}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        aria-label="Next Song"
                    >
                        <SkipForward size={14} />
                    </button>
                </div>

                {/* Song title - truncated */}
                <div className="ml-2 flex-1 min-w-0 max-w-xs">
                    <p className="text-xs font-medium truncate">{currentSong?.name || 'No song selected'}</p>
                </div>

                {/* Maximize button */}
                <button
                    onClick={toggleMinimize}
                    className={`p-1 ml-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                    aria-label="Maximize"
                >
                    <Maximize2 size={14} />
                </button>
            </div>
        );
    }

    // Full player view
    return (
        <div className={`music-player ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-4 max-w-xl mx-auto`}>
            <audio
                ref={audioRef}
                preload="auto"
            />

            {/* Header with song info and minimize button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-1 min-w-0">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${currentSong?.coverPublicId ? 'p-0' : 'bg-blue-500'} overflow-hidden`}>
                        {currentSong?.coverPublicId ? (
                            <img
                                src={currentSong.coverPublicId}
                                alt={`Cover for ${currentSong.name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.className = "w-16 h-16 rounded-lg flex items-center justify-center bg-blue-500";
                                    e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                                }}
                            />
                        ) : (
                            <Music size={24} className="text-white" />
                        )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{currentSong?.name || 'No song selected'}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>{currentSong?.artist || 'Unknown Artist'}</p>
                    </div>
                </div>
                <button
                    onClick={toggleMinimize}
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} ml-2`}
                    aria-label="Minimize"
                >
                    <Minimize2 size={16} />
                </button>
            </div>

            {/* Error message if applicable */}
            {audioError && (
                <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md text-sm">
                    {audioError}
                </div>
            )}

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
                        className={`p-2 rounded-full ${isShuffle ? 'bg-blue-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        aria-label="Toggle Shuffle"
                    >
                        <Shuffle size={18} />
                    </button>

                    <button
                        onClick={playPrevSong}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
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
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        aria-label="Next Song"
                    >
                        <SkipForward size={18} />
                    </button>

                    <button
                        onClick={() => setIsRepeat(!isRepeat)}
                        className={`p-2 rounded-full ${isRepeat ? 'bg-blue-500 text-white' : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
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
                    className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, ${darkMode ? '#4b5563' : '#e5e7eb'} ${volume * 100}%, ${darkMode ? '#4b5563' : '#e5e7eb'} 100%)`
                    }}
                />
            </div>

            {/* Song list with cover thumbnails */}
            {songList.length > 0 && (
                <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h4 className="text-sm font-semibold mb-2">Songs</h4>
                    <div className="overflow-y-auto max-h-48">
                        {songList.map((song) => (
                            <div
                                key={song.id}
                                onClick={() => selectSong(song)}
                                className={`p-2 rounded flex items-center cursor-pointer ${currentSong?.id === song.id
                                    ? 'bg-blue-500 text-white'
                                    : darkMode
                                        ? 'hover:bg-gray-700'
                                        : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-md flex items-center justify-center overflow-hidden ${song.coverPublicId ? 'p-0' : 'bg-blue-600'}`}>
                                    {song.coverPublicId ? (
                                        <img
                                            src={song.coverPublicId}
                                            alt={`Cover for ${song.name}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.parentElement.innerHTML = currentSong?.id === song.id && isPlaying ?
                                                    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>' :
                                                    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
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
                                <span className="text-xs">{formatTime(songDurations[song.id] || 0)}</span>
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
    );
};

export default MusicPlayer;