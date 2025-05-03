// // cloudinaryMusicService.js
// // A service module for handling music data from Cloudinary
// import { useState, useEffect, useCallback } from 'react';

// // Cloudinary configuration
// export const cloudinaryConfig = {
//     cloudName: 'dnu0wlkoi',
//     musicFolder: 'musics',
//     coverFolder: 'covers'
//   };
  
//   // Sample music data (could be moved to a separate JSON file)
//   const sampleMusicData = [
//     {
//       id: 'song1',
//       name: 'Sining',
//       artist: 'Dionela',
//       cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746229036/song1_p9lx9p.mp3',
//       coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746230099/464190394_3435275099943441_4397288059557271110_n_tflecp.jpg'
//     },
//     {
//       id: 'song2',
//       name: 'Marilag',
//       artist: 'Dionela',
//       cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746232428/song2_bpibdn.mp3',
//       coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746232469/song2_kfg8je.jpg'
//     },
//     {
//       id: 'song3',
//       name: 'Kagome',
//       artist: 'Lo Ki',
//       cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746232613/song3_izdkwo.mp3',
//       coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746232678/song3_ebz65o.jpg'
//     }
//   ];
  
//   /**
//    * Fetches music data either from an API or local data
//    * @param {boolean} useLocalData - Whether to use local data instead of API
//    * @param {number} simulatedDelay - Delay in ms to simulate API latency (only for local data)
//    * @returns {Promise<Object>} - Contains { songs, error, loading } properties
//    */
//   export const fetchMusicData = async (useLocalData = true, simulatedDelay = 500) => {
//     try {
//       if (useLocalData) {
//         // Simulate network delay for local data
//         if (simulatedDelay > 0) {
//           await new Promise(resolve => setTimeout(resolve, simulatedDelay));
//         }
//         return {
//           songs: sampleMusicData,
//           error: null
//         };
//       } else {
//         // Fetch from an actual API endpoint
//         const response = await fetch('/api/songs');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         return {
//           songs: data,
//           error: null
//         };
//       }
//     } catch (error) {
//       console.error("Error fetching songs:", error);
//       return {
//         songs: [],
//         error: "Failed to load songs. Please try again later."
//       };
//     }
//   };
  
//   /**
//    * React hook for fetching music data
//    * @param {boolean} useLocalData - Whether to use local data instead of API
//    * @param {number} simulatedDelay - Delay in ms to simulate API latency
//    * @returns {Object} - Contains songs array, loading state, error state, and refetch function
//    */
//   export const useMusicData = (useLocalData = true, simulatedDelay = 500) => {
//     const [songs, setSongs] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     const fetchSongs = useCallback(async () => {
//       setIsLoading(true);
//       setError(null);
      
//       const result = await fetchMusicData(useLocalData, simulatedDelay);
      
//       setSongs(result.songs);
//       setError(result.error);
//       setIsLoading(false);
      
//       return result;
//     }, [useLocalData, simulatedDelay]);
  
//     useEffect(() => {
//       fetchSongs();
//     }, [fetchSongs]);
  
//     return {
//       songs,
//       isLoading,
//       error,
//       refetch: fetchSongs
//     };
//   };

  import { useState, useEffect } from 'react';

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: 'dnu0wlkoi',
  musicFolder: 'musics',
  coverFolder: 'covers'
};

// Custom hook to fetch and manage music data
export const useMusicData = () => {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSongs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // In a real application, you would fetch this data from an API
      // For now, let's use sample data to demonstrate functionality
      const sampleSongs = [
        {
            id: 'song1',
            name: 'Sining',
            artist: 'Dionela',
            cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746229036/song1_p9lx9p.mp3',
            coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746230099/464190394_3435275099943441_4397288059557271110_n_tflecp.jpg'
          },
          {
            id: 'song2',
            name: 'Marilag',
            artist: 'Dionela',
            cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746232428/song2_bpibdn.mp3',
            coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746232469/song2_kfg8je.jpg'
          },
          {
            id: 'song3',
            name: 'Kagome',
            artist: 'Lo Ki',
            cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746232613/song3_izdkwo.mp3',
            coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746232678/song3_ebz65o.jpg'
          }
      ];

      // For demo purposes we'll use this data
      // Replace with API call when ready
      setSongs(sampleSongs);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to load songs. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return {
    songs,
    isLoading,
    error,
    refetch: fetchSongs
  };
};

export default useMusicData;