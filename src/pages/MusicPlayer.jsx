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
import { collection, getDocs } from 'firebase/firestore';

const MusicPlayer = ({
    firestore, // Pass the initialized Firestore instance
    songCollection = 'songs', // Collection name in Firestore where songs are stored
    darkMode = false, // Match with your app's theme
    onMinimize = () => {} // Callback function when minimize button is pressed
}) => {
    // Player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSong, setCurrentSong] = useState(null);
    const [songList, setSongList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [songDurations, setSongDurations] = useState({}); // Store durations for each song
    const [isMinimized, setIsMinimized] = useState(false);

    // Refs
    const audioRef = useRef(null);
    const progressBarRef = useRef(null);
    const currentPlaybackTime = useRef(0); // Store the current playback position

    // Fetch songs from Firestore
    useEffect(() => {
        const fetchSongs = async () => {
            try {
                setIsLoading(true);

                // Get all documents from the songs collection
                const querySnapshot = await getDocs(collection(firestore, songCollection));

                // Format the song data
                const songsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.Song_Name || 'Unknown',
                        artist: data.Subtitle || 'Unknown Artist',
                        url: data.songUrl || '',
                        coverUrl: data.coverUrl || '',
                        count: data.count || 0,
                        duration: data.duration || 0 // Default duration from metadata if available
                    };
                });

                // Sort songs by play count (optional)
                songsData.sort((a, b) => b.count - a.count);

                setSongList(songsData);

                // Set the first song as current if there's no current song
                if (songsData.length > 0 && !currentSong) {
                    setCurrentSong(songsData[0]);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching songs from Firestore:", error);
                setIsLoading(false);
            }
        };

        if (firestore) {
            fetchSongs();
        }
    }, [firestore, songCollection]);

    // Load song durations
    const loadSongDuration = async (song) => {
        if (!song || !song.url) return;
        
        // Create a temporary audio element to get duration
        const tempAudio = new Audio(song.url);
        
        tempAudio.addEventListener('loadedmetadata', () => {
            setSongDurations(prev => ({
                ...prev,
                [song.id]: tempAudio.duration
            }));
        });
        
        tempAudio.addEventListener('error', () => {
            console.error(`Error loading duration for: ${song.name}`);
        });
    };

    // Load durations for all songs
    useEffect(() => {
        songList.forEach(song => {
            if (!songDurations[song.id]) {
                loadSongDuration(song);
            }
        });
    }, [songList]);

    // Handle audio events
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            // Store current time in ref for persistence between view changes
            currentPlaybackTime.current = audio.currentTime;
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
            
            // Important: Restore playback position after metadata is loaded
            if (currentPlaybackTime.current > 0) {
                audio.currentTime = currentPlaybackTime.current;
                
                // If it was playing before, continue playing
                if (isPlaying) {
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.error("Playback error:", error);
                            setIsPlaying(false);
                        });
                    }
                }
            }
        };

        const handleEnded = () => {
            if (isRepeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                playNextSong();
            }
        };

        const handleProgress = () => {
            if (audio.buffered.length > 0) {
                const loadedPercentage = (audio.buffered.end(audio.buffered.length - 1) / audio.duration) * 100;
                setLoadingProgress(loadedPercentage);
            }
        };

        // Add event listeners
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('progress', handleProgress);

        // Remove event listeners on cleanup
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('progress', handleProgress);
        };
    }, [isRepeat, currentSong, isPlaying]);

    // Effect for playing/pausing
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        if (isPlaying) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback error:", error);
                    setIsPlaying(false);
                });
            }
        } else {
            audio.pause();
        }
    }, [isPlaying, currentSong]);

    // Effect for volume changes
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    // Play/pause toggle
    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    // Seek in the song
    const handleSeek = (e) => {
        const seekTime = (e.nativeEvent.offsetX / progressBarRef.current.clientWidth) * duration;
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
        currentPlaybackTime.current = seekTime; // Update the ref as well
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

    // Handle minimize/maximize
    const toggleMinimize = () => {
        // Important: Store current playback state before changing views
        if (audioRef.current) {
            currentPlaybackTime.current = audioRef.current.currentTime;
        }
        
        setIsMinimized(!isMinimized);
        onMinimize(!isMinimized);
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
            } while (songList.length > 1 && songList[randomIndex].id === currentSong.id);
            nextIndex = randomIndex;
        } else {
            // Play the next song in the list
            const currentIndex = songList.findIndex(song => song.id === currentSong.id);
            nextIndex = (currentIndex + 1) % songList.length;
        }

        // Reset playback position for new song
        currentPlaybackTime.current = 0;
        setCurrentSong(songList[nextIndex]);
        setIsPlaying(true);
    };

    // Play previous song
    const playPrevSong = () => {
        if (songList.length <= 1) return;

        if (audioRef.current.currentTime > 3) {
            // If more than 3 seconds into the song, restart it
            audioRef.current.currentTime = 0;
            currentPlaybackTime.current = 0;
            return;
        }

        // Play the previous song
        const currentIndex = songList.findIndex(song => song.id === currentSong.id);
        const prevIndex = (currentIndex - 1 + songList.length) % songList.length;
        
        // Reset playback position for new song
        currentPlaybackTime.current = 0;
        setCurrentSong(songList[prevIndex]);
        setIsPlaying(true);
    };

    // Select a specific song
    const selectSong = (song) => {
        if (currentSong?.id === song.id) {
            // If selecting the same song, just toggle play/pause
            togglePlay();
        } else {
            // Reset playback position for new song
            currentPlaybackTime.current = 0;
            setCurrentSong(song);
            setIsPlaying(true);
        }
    };

    // We always render the audio element regardless of view mode
    // This ensures consistent playback state
    const audioElement = (
        <audio
            key={currentSong?.id || 'empty'} // Key helps with song changes
            ref={audioRef}
            src={currentSong?.url}
            preload="auto"
        />
    );

    // Minimized player view
    if (isMinimized) {
        return (
            <div className={`minimized-music-player ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-3 mx-auto flex items-center justify-between`}>
                {/* Keep the audio element in both view modes */}
                {audioElement}
                
                {/* Minimized song info */}
                <div className="flex items-center flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${currentSong?.coverUrl ? 'p-0' : 'bg-blue-500'} overflow-hidden`}>
                        {currentSong?.coverUrl ? (
                            <img
                                src={currentSong.coverUrl}
                                alt={`Cover for ${currentSong.name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.parentElement.className = "w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500";
                                    e.target.parentElement.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>';
                                }}
                            />
                        ) : (
                            <Music size={20} className="text-white" />
                        )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">{currentSong?.name || 'No song selected'}</h3>
                        <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>{currentSong?.artist || 'Unknown Artist'}</p>
                    </div>
                </div>
                
                {/* Minimized controls */}
                <div className="flex items-center space-x-2 ml-2">
                    <button
                        onClick={playPrevSong}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
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
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        aria-label="Next Song"
                    >
                        <SkipForward size={16} />
                    </button>
                    
                    <button
                        onClick={toggleMinimize}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                        aria-label="Maximize"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
        );
    }

    // Full player view
    return (
        <div className={`music-player ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-4 max-w-xl mx-auto`}>
            {/* Keep the audio element in both view modes */}
            {audioElement}

            {/* Header with song info and minimize button */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center flex-1 min-w-0">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${currentSong?.coverUrl ? 'p-0' : 'bg-blue-500'} overflow-hidden`}>
                        {currentSong?.coverUrl ? (
                            <img
                                src={currentSong.coverUrl}
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
                                <div className={`w-10 h-10 rounded-md flex items-center justify-center overflow-hidden ${song.coverUrl ? 'p-0' : 'bg-blue-600'}`}>
                                    {song.coverUrl ? (
                                        <img
                                            src={song.coverUrl}
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