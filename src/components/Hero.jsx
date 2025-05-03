import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import profile from '../assets/profile.jpg';
import useScrollTo from '../utils/useScrollTo';

const Hero = ({ darkMode, audioRef, playerState }) => {
  // Initialize the scroll hook
  const { handleLinkClick } = useScrollTo();

  // State for audio visualization
  const [bassLevel, setBassLevel] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameRef = useRef();
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const audioContextRef = useRef(null);

  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    audioRefExists: false,
    audioIsPlaying: false,
    analyzerCreated: false,
    lastBassLevel: 0
  });

  // Update visualization state when playerState changes
  useEffect(() => {
    if (playerState) {
      setIsPlaying(playerState.isPlaying);
    }
  }, [playerState]);

  // Set up audio analyzer
  useEffect(() => {
    // Only setup once
    if (analyserRef.current) return;

    const setupAudioAnalyzer = () => {
      if (!audioRef || !audioRef.current) return;

      try {
        // Create audio context
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) {
          console.error("AudioContext not supported");
          return;
        }

        audioContextRef.current = new AudioContext();
        const analyser = audioContextRef.current.createAnalyser();
        analyserRef.current = analyser;

        // Configure analyser
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        dataArrayRef.current = dataArray;

        // Check if audio is already playing
        if (audioRef.current.played && audioRef.current.played.length > 0) {
          // Connect to already playing audio
          const source = audioContextRef.current.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(audioContextRef.current.destination);

          setDebugInfo(prev => ({
            ...prev,
            audioRefExists: true,
            analyzerCreated: true
          }));
        }

        // Listen for play events to connect analyzer if not already connected
        audioRef.current.addEventListener('play', function connectAnalyzer() {
          if (!analyser.connected) {
            const source = audioContextRef.current.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(audioContextRef.current.destination);
            analyser.connected = true;

            setDebugInfo(prev => ({
              ...prev,
              audioIsPlaying: true
            }));
          }

          // Start animation if not already running
          if (!animationFrameRef.current) {
            updateVisualization();
          }
        });
      } catch (error) {
        console.error("Error setting up audio analyzer:", error);
      }
    };

    // Try to set up the analyzer - use a timeout to ensure the audio element is fully mounted
    setTimeout(setupAudioAnalyzer, 1000);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioRef]);

  // Fallback animation for when analyzer setup fails
  useEffect(() => {
    // Start a fallback animation if music is playing but no analyzer is active
    let fallbackInterval;

    if (isPlaying && (!analyserRef.current || !dataArrayRef.current)) {
      fallbackInterval = setInterval(() => {
        setBassLevel(prev => {
          // Create a pulsing effect
          const randomFactor = 0.3 + Math.random() * 0.7;
          return prev * 0.7 + randomFactor * 0.3;
        });
      }, 100);
    }

    return () => {
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [isPlaying]);

  // Animation function
  const updateVisualization = () => {
    if (!analyserRef.current || !dataArrayRef.current) {
      // If we have no analyzer but music is playing, use fallback animation
      if (isPlaying) {
        setBassLevel(prev => {
          const randomFactor = 0.3 + Math.random() * 0.7;
          return prev * 0.7 + randomFactor * 0.3;
        });
      } else {
        // Fade out if not playing
        setBassLevel(prev => prev * 0.95);
      }
    } else {
      try {
        // Get frequency data
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Use the first few bins (0-5) for bass frequencies
        const bassFrequencies = dataArrayRef.current.slice(0, 6);
        const bassSum = bassFrequencies.reduce((sum, value) => sum + value, 0);
        const bassAvg = bassSum / bassFrequencies.length;

        // Normalize to 0-1 range and apply smoothing
        const normalizedBass = Math.min(1, bassAvg / 200);
        setBassLevel(prev => prev * 0.7 + normalizedBass * 0.3);

        setDebugInfo(prev => ({
          ...prev,
          lastBassLevel: normalizedBass
        }));
      } catch (error) {
        console.error("Error in visualization loop:", error);
        // Use fallback if there's an error
        if (isPlaying) {
          setBassLevel(prev => {
            const randomFactor = 0.3 + Math.random() * 0.7;
            return prev * 0.7 + randomFactor * 0.3;
          });
        } else {
          setBassLevel(prev => prev * 0.95);
        }
      }
    }

    // Continue the animation loop
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  };

  // Start the visualization when component mounts or isPlaying changes
  useEffect(() => {
    // Clear any existing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Start the visualization loop
    updateVisualization();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Enhanced visual effect calculations
  const pulseScale = 1 + (bassLevel * 0.25); // Increased scale effect
  const pulseOpacity = 0.3 + (bassLevel * 0.7); // Higher base opacity

  // Create more vibrant colors for the effect
  const baseColor = darkMode ? [59, 130, 246] : [37, 99, 235]; // Blue base
  const pulseColor = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${pulseOpacity})`;

  // Create multiple layers of effects with different scales and opacities
  const outerPulseScale = 1 + (bassLevel * 0.4); // Larger outer pulse
  const outerPulseOpacity = 0.2 + (bassLevel * 0.5); // More transparent outer pulse
  const outerPulseColor = `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${outerPulseOpacity})`;

  // Force animation even if no music is playing (for testing)
  const forceAnimation = false;

  // Only show debug in development
  const showDebug = false;

  return (
    <div className={`py-20 px-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Text content */}
        <div className="md:w-1/2 mt-10 md:mt-0 text-center md:text-left" style={{ marginTop: window.innerWidth < 768 ? '70px' : '0' }}>
          <h1 className={`text-4xl md:text-5xl Rowdies font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Hi, I'm Emman
          </h1>

          <h2 className={`text-2xl md:text-3xl Roboto-Slab font-medium mb-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            Frontend & Back-end Developer
          </h2>

          <p className={`text-lg Open-Sans mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            I create engaging, responsive web experiences with modern technologies.
            Passionate about clean code and intuitive user interfaces.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#projects"
              onClick={handleLinkClick}
              className={`px-6 py-3 rounded flex items-center justify-center Roboto-Slab gap-2 transition duration-300 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-medium`}
            >
              View My Work <ArrowRight size={16} />
            </a>

            <a
              href="#contact"
              onClick={handleLinkClick}
              className={`px-6 py-3 rounded flex items-center justify-center Roboto-Slab gap-2 transition duration-300 ${darkMode ? 'border-white text-white hover:bg-gray-800' : 'border-blue-500 text-blue-500 hover:bg-gray-100'
                } border`}
            >
              Get In Touch
            </a>
          </div>

          {/* Debug info - only show during development */}
          {showDebug && (
            <div className="mt-4 p-2 bg-black bg-opacity-20 text-xs">
              <div>Audio Ref: {debugInfo.audioRefExists ? '✅' : '❌'}</div>
              <div>Playing: {debugInfo.audioIsPlaying ? '✅' : '❌'}</div>
              <div>Analyzer: {debugInfo.analyzerCreated ? '✅' : '❌'}</div>
              <div>Bass Level: {debugInfo.lastBassLevel.toFixed(2)}</div>
              <div>Current Bass: {bassLevel.toFixed(2)}</div>
            </div>
          )}
        </div>

        {/* Profile image with rhythm visualization */}
        <div className="md:w-2/5 relative">
          <div className="relative mx-auto w-64 h-64">
            {/* Outer pulse effect */}
            <div
              className="absolute rounded-full inset-0 transition-all duration-75"
              style={{
                transform: `scale(${(isPlaying || forceAnimation) ? outerPulseScale : 1})`,
                boxShadow: `0 0 30px 15px ${outerPulseColor}`,
                opacity: (isPlaying || forceAnimation) ? outerPulseOpacity : 0,
                backgroundColor: 'transparent',
                zIndex: 0
              }}
            />

            {/* Inner pulse effect */}
            <div
              className="absolute rounded-full inset-0 transition-all duration-75"
              style={{
                transform: `scale(${(isPlaying || forceAnimation) ? pulseScale : 1})`,
                boxShadow: `0 0 20px 8px ${pulseColor}`,
                opacity: (isPlaying || forceAnimation) ? pulseOpacity : 0,
                backgroundColor: 'transparent',
                zIndex: 1
              }}
            />

            {/* Profile image container */}
            <div
              className={`rounded-full w-64 h-64 mx-auto overflow-hidden border-4 relative z-10 ${darkMode ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-blue-400 shadow-lg'
                }`}
              style={{
                transition: 'all 150ms ease-out',
                transform: (isPlaying || forceAnimation) ? `scale(${1 + bassLevel * 0.05})` : 'scale(1)'
              }}
            >
              <img
                src={profile}
                alt="Emman - Developer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;