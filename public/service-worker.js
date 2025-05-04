// Service Worker for offline music player
const CACHE_NAME = "music-player-cache-v1"
const MUSIC_CACHE_NAME = "music-files-cache-v1"
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/static/js/main.js",
  "/static/css/main.css",
  // Add other important app assets here
]

// Install event - cache basic app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell")
        return cache.addAll(ASSETS_TO_CACHE)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_NAME, MUSIC_CACHE_NAME]

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheAllowlist.includes(cacheName)) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes("res.cloudinary.com")) {
    return
  }

  // Special handling for music files
  if (
    event.request.url.includes("res.cloudinary.com") &&
    (event.request.url.endsWith(".mp3") || event.request.url.endsWith(".jpg") || event.request.url.endsWith(".png"))
  ) {
    event.respondWith(
      caches.open(MUSIC_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached response
            return cachedResponse
          }

          // Fetch from network and cache
          return fetch(event.request)
            .then((networkResponse) => {
              // Cache a clone of the response
              cache.put(event.request, networkResponse.clone())
              return networkResponse
            })
            .catch((error) => {
              console.error("Fetch failed for music file:", error)
              // Return a fallback response or error
              return new Response("Network error", { status: 408, headers: { "Content-Type": "text/plain" } })
            })
        })
      }),
    )
    return
  }

  // Standard cache-first strategy for other requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(event.request).then((networkResponse) => {
        // Don't cache non-successful responses
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse
        }

        // Cache a clone of the response
        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return networkResponse
      })
    }),
  )
})

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_MUSIC_FILE") {
    const { url } = event.data

    // Cache the music file
    caches.open(MUSIC_CACHE_NAME).then((cache) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            cache.put(url, response)
            console.log("Cached music file:", url)
          }
        })
        .catch((err) => {
          console.error("Failed to cache music file:", url, err)
        })
    })
  }
})
