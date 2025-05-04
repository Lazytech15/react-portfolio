"use client"

import { useState, useEffect } from "react"
import { prefetchAndCacheSongs, getSongs, isOnline, setupOnlineOfflineHandlers } from "./offlineMusic-service"

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: "dnu0wlkoi",
  musicFolder: "musics",
  coverFolder: "covers",
}

// Custom hook to fetch and manage music data with offline support
export const useMusicData = () => {
  const [songs, setSongs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [networkStatus, setNetworkStatus] = useState(isOnline())

  // Function to fetch songs from Cloudinary or IndexedDB
  const fetchSongs = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const sampleSongs = [
        {
          id: 'song1',
          name: 'Sining',
          artist: 'Dionela',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746229036/song1_p9lx9p.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746269582/song1_ff9f0o.jpg'
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
        },
        {
          id: 'song4',
          name: 'Kisame',
          artist: 'rhodessa',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746270034/song4_b0ddyt.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746269965/song4_lih2xy.jpg'
        },
        {
          id: 'song5',
          name: 'Pasilyo',
          artist: 'SunKissed Lola',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746270245/song5_udb1h1.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746270315/song5_gscyog.jpg'
        },
        {
          id: 'song6',
          name: 'Pano',
          artist: 'Zack Tabudlo',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746270422/song6_aewbws.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746270473/song6_oapyvl.jpg'
        },
        {
          id: 'song7',
          name: 'Nobita',
          artist: 'Ikaw Lang',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746270714/song7_mpajkj.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746270691/song7_lbbxgn.jpg'
        },
        {
          id: 'song8',
          name: 'Kathang Isip',
          artist: 'Ben&Ben',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746270862/song8_vrqurz.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746270830/song8_jzzv5i.jpg'
        },
        {
          id: 'song9',
          name: 'Imahe',
          artist: 'Magnus Haven',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271020/song9_tvapsh.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746270956/song9_qitkei.jpg'
        },
        {
          id: 'song10',
          name: 'MUNDO',
          artist: 'IV of Spades',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271202/song10_uofate.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746271139/song10_w77wt8.jpg'
        },
        {
          id: 'song11',
          name: 'Bulong',
          artist: 'December Avenue',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271355/song11_uew5el.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746271301/song11_x2zdmi.jpg'
        },
        {
          id: 'song12',
          name: 'Huling Sandali',
          artist: 'December Avenue ',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271491/song12_bqj61y.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746271459/song12_r7y4yb.jpg'
        },
        {
          id: 'song13',
          name: 'Sa Ngalan Ng Pag-Ibig',
          artist: 'December Avenue',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271695/song13_rehiu9.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746271660/song13_vvzeg5.jpg'
        },
        {
          id: 'song14',
          name: 'Kung Di Rin Lang Ikaw',
          artist: 'December Avenue ft. Moira Dela Torre',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271863/song14_ihxnri.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746271827/song14_wvwwvl.jpg'
        },
        {
          id: 'song15',
          name: 'Dating Tayo',
          artist: 'TJ Monterde',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746271960/song15_yjr0hz.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746271978/song15_xexjav.jpg'
        },
        {
          id: 'song16',
          name: 'Ikaw at Ako',
          artist: 'TJ Monterde',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746272105/song16_acdk1f.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746272073/song16_akqe7o.jpg'
        },
        {
          id: 'song17',
          name: 'Ang Wakas',
          artist: 'Arthur Miguel ft. Trisha Macapagal',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746272205/song17_tkkmc8.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746272228/song17_ziwubi.jpg'
        },
        {
          id: 'song18',
          name: 'Di Na Babalik',
          artist: 'This Band',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746272447/song18_loucgy.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746272401/song18_uc9djw.jpg'
        },
        {
          id: 'song19',
          name: 'Migraine 🎵',
          artist: 'Moonstar88',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746272588/song19_yqvtw6.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746272605/song19_escm1t.jpg'
        },
        {
          id: 'song20',
          name: 'Same Ground 🎵',
          artist: 'Kitchie Nadal',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746272755/song20_ogidvi.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746272691/song20_tk8pch.jpg'
        },
        {
          id: 'song21',
          name: 'Huwag Na Huwag Mong Sasabihin',
          artist: 'Kitchie Nadal1',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746272915/song21_g7azgm.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746272837/song21_hibaog.png'
        },
        {
          id: 'song22',
          name: 'Uhaw (Tayong Dalawa)',
          artist: 'Dilaw',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746273117/song22_zmmtog.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746273081/song22_olzdzc.jpg'
        },
        {
          id: 'song23',
          name: 'Binibini',
          artist: 'Zack Tabudlo',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746273270/song23_d88gjw.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746273216/song23_mgmj6w.jpg'
        },
        {
          id: 'song24',
          name: 'Nangangamba',
          artist: 'Zack Tabudlo',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746273648/song24_yxe0n2.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746273380/song24_vfgflu.jpg'
        },
        {
          id: 'song25',
          name: 'Muli',
          artist: 'Ace Banzuelo',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746273825/song25_d4tkgr.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746273846/song25_ucin0p.jpg'
        },
        {
          id: 'song26',
          name: 'Isa lang',
          artist: 'Arthur Nery',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746274116/song26_eoq5xt.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746273937/song26_g8wila.jpg'
        },
        {
          id: 'song27',
          name: 'Oksihina',
          artist: 'Dionela',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746274266/song27_hf1dj5.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746274230/song27_iw563n.jpg'
        },
        {
          id: 'song28',
          name: 'Dilaw',
          artist: 'Maki',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746274437/song28_akhqyn.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746274414/song28_bfqeng.png'
        },
        {
          id: 'song29',
          name: 'tahanan',
          artist: 'adie',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746274600/song29_okkv3h.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746274618/song29_znqa8p.jpg'
        },
        {
          id: 'song30',
          name: 'UMAASA',
          artist: 'Calein',
          cloudinaryId: 'https://res.cloudinary.com/dnu0wlkoi/video/upload/v1746275086/song30_pj7ap3.mp3',
          coverPublicId: 'https://res.cloudinary.com/dnu0wlkoi/image/upload/v1746274750/song30_lbiztn.jpg'
        }
      ]

      // If online, prefetch and cache songs
      if (isOnline()) {
        await prefetchAndCacheSongs(sampleSongs)
        setSongs(sampleSongs)
      } else {
        // If offline, get songs from IndexedDB
        const offlineSongs = await getSongs()
        setSongs(offlineSongs)
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Error fetching songs:", err)
      setError("Failed to load songs. Please try again.")
      setIsLoading(false)

      // Try to get songs from IndexedDB as a fallback
      try {
        const offlineSongs = await getSongs()
        if (offlineSongs && offlineSongs.length > 0) {
          setSongs(offlineSongs)
          setError(null) // Clear error if we successfully got songs from IndexedDB
        }
      } catch (dbErr) {
        console.error("Failed to get songs from IndexedDB:", dbErr)
      }
    }
  }

  // Set up online/offline event handlers
  useEffect(() => {
    const cleanup = setupOnlineOfflineHandlers((online) => {
      setNetworkStatus(online)
      // Refetch songs when network status changes
      fetchSongs()
    })

    return cleanup
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchSongs()
  }, [])

  return {
    songs,
    isLoading,
    error,
    isOnline: networkStatus,
    refetch: fetchSongs,
  }
}

export default useMusicData
