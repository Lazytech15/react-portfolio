// Service Worker for offline music player with Vite/Tailwind
const CACHE_NAME = "music-player-cache-v1";
const MUSIC_CACHE_NAME = "music-files-cache-v1";

// Only cache core navigation files at install time
// Vite generates hashed filenames that we'll catch in fetch handler
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json"  // If you have one
];

// Install event - cache basic app shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheAllowlist = [CACHE_NAME, MUSIC_CACHE_NAME];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheAllowlist.includes(cacheName)) {
              console.log("Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests except Cloudinary
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes("res.cloudinary.com")) {
    return;
  }

  // Handle music and media files from Cloudinary
  if (
    event.request.url.includes("res.cloudinary.com") &&
    (event.request.url.endsWith(".mp3") || event.request.url.endsWith(".jpg") || event.request.url.endsWith(".png"))
  ) {
    handleMediaRequest(event);
    return;
  }

  // For Vite generated assets (.js, .css, etc.), use cache-first strategy
  if (isAssetRequest(event.request)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return cacheOnResponse(event.request);
      })
    );
    return;
  }

  // For navigation requests, use network-first strategy
  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to the root if a cached page doesn't exist
            return caches.match("/");
          });
        })
    );
    return;
  }

  // Standard cache-first strategy for other requests
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return cacheOnResponse(event.request);
    })
  );
});

// Helper function to handle media requests
function handleMediaRequest(event) {
  event.respondWith(
    caches.open(MUSIC_CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error("Fetch failed for media file:", error);
            return new Response("Network error", { 
              status: 408, 
              headers: { "Content-Type": "text/plain" } 
            });
          });
      });
    })
  );
}

// Helper function to determine if request is for Vite assets
function isAssetRequest(request) {
  const url = new URL(request.url);
  return (
    url.pathname.startsWith("/assets/") || // Vite assets folder
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".ttf") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".jpg")
  );
}

// Helper function to determine if it's a navigation request
function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.method === "GET" &&
      request.headers.get("accept").includes("text/html"))
  );
}

// Helper function to fetch and cache
function cacheOnResponse(request) {
  return fetch(request).then((networkResponse) => {
    // Only cache successful responses
    if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
      const responseToCache = networkResponse.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
      });
    }
    return networkResponse;
  });
}

// Listen for messages from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CACHE_MUSIC_FILE") {
    const { url } = event.data;

    // Cache the music file
    caches.open(MUSIC_CACHE_NAME).then((cache) => {
      fetch(url)
        .then((response) => {
          if (response.ok) {
            cache.put(url, response);
          }
        })
        .catch((err) => {
          console.error("Failed to cache music file:", url, err);
        });
    });
  }
});