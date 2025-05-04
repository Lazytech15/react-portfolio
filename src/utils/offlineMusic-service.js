import { storeSongs, getAllSongs } from "./indexdbService"

// Function to check if the browser is online
export const isOnline = () => {
  return navigator.onLine
}

// Function to register the service worker
export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/public/service-worker.js")
      console.log("Service Worker registered with scope:", registration.scope)
      return registration
    } catch (error) {
      console.error("Service Worker registration failed:", error)
      return null
    }
  }
  return null
}

// Function to cache a music file using the service worker
export const cacheMusicFile = (url) => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "CACHE_MUSIC_FILE",
      url,
    })
  }
}

// Function to prefetch and cache all songs
export const prefetchAndCacheSongs = async (songs) => {
  if (!songs || songs.length === 0) return

  try {
    // Store song metadata in IndexedDB
    await storeSongs(songs)

    // Cache audio and image files if online
    if (isOnline()) {
      songs.forEach((song) => {
        // Cache the audio file
        if (song.cloudinaryId) {
          cacheMusicFile(song.cloudinaryId)
        }

        // Cache the cover image
        if (song.coverPublicId) {
          cacheMusicFile(song.coverPublicId)
        }
      })
    }

    console.log("Songs prefetched and cached successfully")
    return true
  } catch (error) {
    console.error("Failed to prefetch and cache songs:", error)
    return false
  }
}

// Function to get songs (from IndexedDB if offline, or from the provided source if online)
export const getSongs = async (onlineSongs = []) => {
  try {
    if (isOnline() && onlineSongs.length > 0) {
      // If online and we have songs from the online source, use those
      // But also update the cache for offline use
      prefetchAndCacheSongs(onlineSongs)
      return onlineSongs
    } else {
      // If offline or no online songs provided, get from IndexedDB
      const songs = await getAllSongs()
      return songs
    }
  } catch (error) {
    console.error("Error getting songs:", error)
    return []
  }
}

// Function to check if a blob URL is still valid
export const isBlobUrlValid = (url) => {
  if (!url || !url.startsWith("blob:")) return false

  try {
    // This is a simple check - we try to create an object URL from the URL
    // If it's invalid, it will throw an error
    const xhr = new XMLHttpRequest()
    xhr.open("HEAD", url, false)
    xhr.send()
    return xhr.status !== 0
  } catch (e) {
    return false
  }
}

// Function to create a blob URL from an ArrayBuffer
export const createBlobUrl = async (url) => {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const contentType =
      response.headers.get("content-type") ||
      (url.endsWith(".mp3")
        ? "audio/mpeg"
        : url.endsWith(".jpg")
          ? "image/jpeg"
          : url.endsWith(".png")
            ? "image/png"
            : "application/octet-stream")

    const blob = new Blob([arrayBuffer], { type: contentType })
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error("Error creating blob URL:", error)
    return null
  }
}

// Function to handle online/offline events
export const setupOnlineOfflineHandlers = (callback) => {
  const handleOnlineStatusChange = () => {
    const online = isOnline()
    console.log(`App is now ${online ? "online" : "offline"}`)
    if (callback && typeof callback === "function") {
      callback(online)
    }
  }

  window.addEventListener("online", handleOnlineStatusChange)
  window.addEventListener("offline", handleOnlineStatusChange)

  // Return a cleanup function
  return () => {
    window.removeEventListener("online", handleOnlineStatusChange)
    window.removeEventListener("offline", handleOnlineStatusChange)
  }
}
