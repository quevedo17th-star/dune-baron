const CACHE_NAME = 'dune-automa-v1';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './baron_splash.png',
    './victory.mp4',
    // Decision Cards
    './1.png', './2.png', './3.png', './4.png', './5.png',
    './6.png', './7.png', './8.png', './9.png', './10.png',
    './11.png', './12.png', './13.png', './14.png', './15.png',
    './16.png', './17.png', './18.png', './19.png', './20.png',
    // Objective Cards
    './obj_1.png', './obj_2.png', './obj_3.png', './obj_4.png',
    './obj_5.png', './obj_6.png', './obj_7.png', './obj_8.png',
    // Tactics Cards
    './tactica (1).jpg', './tactica (2).jpg', './tactica (3).jpg', './tactica (4).jpg',
    './tactica (5).jpg', './tactica (6).jpg', './tactica (7).jpg', './tactica (8).jpg'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
