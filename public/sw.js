// Service Worker for Push Notifications
const CACHE_NAME = 'medtracker-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event for notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New medication reminder',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'taken',
        title: 'Mark as Taken',
        icon: '/icons/check.png'
      },
      {
        action: 'snooze',
        title: 'Snooze 15min',
        icon: '/icons/snooze.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('MedTracker Reminder', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'taken') {
    // Handle mark as taken action
    event.waitUntil(
      clients.openWindow('/?action=taken&id=' + event.notification.data?.primaryKey)
    );
  } else if (event.action === 'snooze') {
    // Handle snooze action
    event.waitUntil(
      clients.openWindow('/?action=snooze&id=' + event.notification.data?.primaryKey)
    );
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'medication-sync') {
    event.waitUntil(
      // Sync medication data when back online
      syncMedicationData()
    );
  }
});

async function syncMedicationData() {
  // Implementation for syncing medication data
  // This would typically sync with a backend server
  console.log('Syncing medication data...');
}