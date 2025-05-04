// IndexedDB service for storing and retrieving music data

const DB_NAME = "MusicPlayerDB"
const DB_VERSION = 1
const SONGS_STORE = "songs"

// Initialize the database
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error)
      reject("Error opening IndexedDB")
    }

    request.onsuccess = (event) => {
      const db = event.target.result
      console.log("IndexedDB opened successfully")
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create object store for songs
      if (!db.objectStoreNames.contains(SONGS_STORE)) {
        const store = db.createObjectStore(SONGS_STORE, { keyPath: "id" })
        store.createIndex("by_id", "id", { unique: true })
        console.log("Songs object store created")
      }
    }
  })
}

// Store songs in IndexedDB
export const storeSongs = async (songs) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([SONGS_STORE], "readwrite")
    const store = transaction.objectStore(SONGS_STORE)

    // Clear existing songs
    store.clear()

    // Add each song
    songs.forEach((song) => {
      store.add(song)
    })

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("All songs stored successfully")
        resolve(true)
      }

      transaction.onerror = (event) => {
        console.error("Error storing songs:", event.target.error)
        reject(event.target.error)
      }
    })
  } catch (error) {
    console.error("Failed to store songs:", error)
    throw error
  }
}

// Get all songs from IndexedDB
export const getAllSongs = async () => {
  try {
    const db = await initDB()
    const transaction = db.transaction([SONGS_STORE], "readonly")
    const store = transaction.objectStore(SONGS_STORE)
    const request = store.getAll()

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error("Error getting songs:", event.target.error)
        reject(event.target.error)
      }
    })
  } catch (error) {
    console.error("Failed to get songs:", error)
    throw error
  }
}

// Get a specific song by ID
export const getSongById = async (id) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([SONGS_STORE], "readonly")
    const store = transaction.objectStore(SONGS_STORE)
    const request = store.get(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onerror = (event) => {
        console.error("Error getting song:", event.target.error)
        reject(event.target.error)
      }
    })
  } catch (error) {
    console.error("Failed to get song:", error)
    throw error
  }
}

// Check if a song exists in IndexedDB
export const songExists = async (id) => {
  try {
    const song = await getSongById(id)
    return !!song
  } catch (error) {
    return false
  }
}

// Update a song's data
export const updateSong = async (song) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([SONGS_STORE], "readwrite")
    const store = transaction.objectStore(SONGS_STORE)
    const request = store.put(song)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = (event) => {
        console.error("Error updating song:", event.target.error)
        reject(event.target.error)
      }
    })
  } catch (error) {
    console.error("Failed to update song:", error)
    throw error
  }
}

// Delete a song
export const deleteSong = async (id) => {
  try {
    const db = await initDB()
    const transaction = db.transaction([SONGS_STORE], "readwrite")
    const store = transaction.objectStore(SONGS_STORE)
    const request = store.delete(id)

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(true)
      }

      request.onerror = (event) => {
        console.error("Error deleting song:", event.target.error)
        reject(event.target.error)
      }
    })
  } catch (error) {
    console.error("Failed to delete song:", error)
    throw error
  }
}
