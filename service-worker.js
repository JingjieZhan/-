const CACHE_NAME = 'narrative-mirror-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/scene.html',
  '/observer.html',
  '/creator.html',
  '/styles/main.css',
  '/scripts/scenes.js',
  '/scripts/app.js',
  '/scripts/index.js',
  '/narratives/taoist.js',
  '/narratives/observer.js',
  '/narratives/mirror.js',
  '/narratives/shanghai-worker.js',
  '/narratives/heartbroken-coder.js',
  '/narratives/curious-student.js',
  '/narratives/spiritual-seeker.js',
  '/narratives/bai-grandmother.js',
  '/narratives/innkeeper.js',
  '/narratives/writer.js',
  '/narratives/digital-nomad.js'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('缓存失败:', err);
      })
  );
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果缓存中有，返回缓存
        if (response) {
          return response;
        }
        // 否则发起网络请求
        return fetch(event.request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          // 克隆响应并缓存
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        });
      })
      .catch(() => {
        // 离线时返回首页
        return caches.match('/index.html');
      })
  );
});
