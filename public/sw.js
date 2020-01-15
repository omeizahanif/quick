const staticCacheName = 'site-static-v7';
//const dynamicCacheName = 'site-dynamic-v2';
const assets = [
    '/',
    '/app.js',
    '/public/src/pages/login.ejs',
    '/public/index.js',
    '/public/font/css/all.css'
];

//cache size limit function
const limitCacheSize = (name, size) => {
    caches.open(name).then(cache => {
        cache.keys().then(keys => {
            if(keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size));
            }
        })
    })
}


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            assets.forEach(asset => {
                cache.add(asset);
                console.log('added:', asset);
            });
            console.log('completed');
        })
    );
    

});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            )
        })
    );
});

/*self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
        /* If we don't block the event as shown below, then the request will go to
           the network as usual.
        
        console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
        return;
      }
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            return cacheRes || fetch(event.request).then(fetchRes => {
                return caches.open(dynamicCacheName).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    limitCacheSize(dynamicCacheName, 10);
                    return fetchRes;
                })
            })
        }).catch(() => {
    
            if(event.request.url.indexOf('.ejs') > -1) {
               return caches.match('/public/src/pages/fallback.ejs')
            }
        })
    );
});*/