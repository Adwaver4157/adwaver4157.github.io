// キャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
    './index.html',
];

// インストール処理
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache.map(url => new Request(url, {credentials: 'same-origin'})));
            })
    );
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          if (response) {
            return response;     // if valid response is found in cache return it
          } else {
            return fetch(event.request)     //fetch from internet
              .then(function(res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function(cache) {
                    cache.put(event.request.url, res.clone());    //save the response for future
                    return res;   // return the fetched data
                  })
              })
              .catch(function(err) {       // fallback mechanism
                return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                  .then(function(cache) {
                    return cache.match('/offline.html');
                  });
              });
          }
        })
    );
  });   
/* self.addEventListener('fetch', function(event) {
    console.log('fetch');
    event.respondWith(caches.match(event.request).then(function(response){
      // Cache hit - return response
      if(response){
        return response;
      }
      var fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(function(response){
        // Check if we received a valid response
        if(!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var responseToCache = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
    }));
}) */