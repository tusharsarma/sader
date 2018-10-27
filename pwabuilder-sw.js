//This is the "Offline copy of pages" service worker

//Install stage sets up the index page (home page) in the cache and opens a new cache
importScripts('/cache-polyfill.js');


self.addEventListener('install', function(event) {
  var indexPage = new Request('index.html');
  event.waitUntil(
    caches.open('airhorner').then(function(cache) {
      return cache.addAll([
        '/',
        '/views/home.ejs',
        '/views/index.ejs',
        '/views/indexx.ejs',
        '/views/signup.ejs',
        '/views/results.ejs',
        '/public/css/login.css',
        '/public/css/style.css',
        '/public/css/profile.css',
        '/public/js/home.js',
        '/public/js/global.js',
        '/public/js/deparam.js',
        '/public/scripts/app.js',
 
        '/views/show.ejs',
        '/views/results.ejs',
        '/views/new.ejs',
        '/views/members.ejs',
        '/views/edit.ejs',
        '/views/user/interest.ejs',
        '/views/user/overview.ejs',
        '/views/user/profile.ejs',
        '/views/private/privatechat.ejs',
        '/views/partials/navbar.ejs',
        '/views/partials/message.ejs',
        '/views/partials/headerr.ejs',
        '/views/partials/footer.ejs',
        '/views/partials/blogs.ejs',
        '/views/groupchats/group.ejs',
        '/views/admin/dashboard.ejs',
        '/public/css/news.css',
        '/public/css/group.css',
 
 
 
 
 
      ]);
    })
  );
  event.waitUntil(
    fetch(indexPage).then(function(response) {
      return caches.open('pwabuilder-offline').then(function(cache) {
        console.log('[PWA Builder] Cached index page during Install'+ response.url);
        return cache.put(indexPage, response);
      });
  }));
});

//If any fetch fails, it will look for the request in the cache and serve it from there first
self.addEventListener('fetch', function(event) {
  var updateCache = function(request){
    return caches.open('pwabuilder-offline').then(function (cache) {
      return fetch(request).then(function (response) {
        console.log('[PWA Builder] add page to offline'+response.url)
        return cache.put(request, response);
      });
    });
  };

  event.waitUntil(updateCache(event.request));

  event.respondWith(
    fetch(event.request).catch(function(error) {
      console.log( '[PWA Builder] Network request Failed. Serving content from cache: ' + error );

      //Check to see if you have it in the cache
      //Return response
      //If not in the cache, then return error page
      return caches.open('pwabuilder-offline').then(function (cache) {
        return cache.match(event.request).then(function (matching) {
          var report =  !matching || matching.status == 404?Promise.reject('no-match'): matching;
          return report
        });
      });
    })
  );
})
