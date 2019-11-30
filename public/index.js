//register service worker
if(navigator.serviceWorker){
        navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(() => console.log('service worker registered'))
        .catch(() => console.log('service worker NOT registered'))
}