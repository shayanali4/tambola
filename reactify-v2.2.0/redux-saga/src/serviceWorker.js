import api from 'Api';
const publicVapidKey = 'BMuM0njlvd_izDhiZ_d-veKo9Mix0-oHqraTSGSTfBf7N4tc_EdRHv9PzT52DdGcNl2wFeBgjXPMi50U8iEUHs0';



  function onNewServiceWorker(registration, callback) {
    if (registration.waiting) {
      // SW is waiting to activate. Can occur if multiple clients open and
      // one of the clients is refreshed.
      return callback();
    }

    function listenInstalledStateChange() {
      registration.installing.addEventListener('statechange', function(event) {
        if (event.target.state === 'installed') {
          // A new service worker is available, inform the user
          callback();
        }
      });
    };

    if (registration.installing) {
      return listenInstalledStateChange();
    }

    // We are currently controlled so a new SW may be found...
    // Add a listener in case a new SW is found,
    registration.addEventListener('updatefound', listenInstalledStateChange);
  }



  function showRefreshUI(registration) {
    // TODO: Display a toast or refresh UI.

    // This demo creates and injects a button.

    let snackbar = document.getElementById('newUpdate');
    snackbar.className = 'show';

    var button = document.getElementById('newUpdateReload');

    button.addEventListener('click', function() {
      if (!registration.waiting) {
        // Just to ensure registration.waiting is available before
        // calling postMessage()
        return;
      }

      registration.waiting.postMessage({ action: 'skipWaiting' });
    });
  };



 let refreshing;
export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {

    window.addEventListener('load', () => {
      const swUrl = '/tgp-sw.js';

    //  When the user asks to refresh the UI, we'll need to reload the window
      navigator.serviceWorker.addEventListener('controllerchange', function(event) {
        console.log('Controller loaded');
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
      });

        registerValidSW(swUrl, config);
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service worker registered!');

                // if('PushManager' in window)
                // {
                //     configurePushSub();
                // }
                // else {
                //   console.log("PushManager not supported.");
                // }

                if (!navigator.serviceWorker.controller) {
                  // The window client isn't currently controlled so it's a new service
                  // worker that will activate immediately
                  return;
                }

                registration.update();

                onNewServiceWorker(registration, function() {
                  showRefreshUI(registration);
                });

    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });

}





function configurePushSub(obj) {

  obj = obj || {};

  if (!('serviceWorker' in navigator)) {
    return;
  }

  var reg;
    navigator.serviceWorker.ready
    .then(function(swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function(sub) {

        console.log('Service worker ready! ' +localStorage.getItem('user_id')+ ' :: ' , sub);

      if (sub === null || localStorage.getItem('user_id')) {

        if(sub === null)
        {
          displayConfirmNotification();
        }


        // Create a new subscription
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
        });
      } else {
        console.log('Service exists... ');
      }
    })
    .then(function(subscription) {
      if(subscription)
      {
        console.log('Push Registered...' , subscription);
            let logintype = localStorage.getItem('login_type');
            let urlid = localStorage.getItem('url_id');

                          if(localStorage.getItem('user_id'))
                          {
                              api.post('push-subscribe-withoath',{subscription, logintype, urlid})
                              .then(x => {console.log("api with server-subscription Done...");
                                            if(obj && obj.notify)
                                            {
                                              displayConfirmNotification();
                                            }
                                     })
                                    .catch(err => console.log("api with server-subscription Erro...", err));
                          }
                          else if (location.pathname === '/signin') {
                              api.post('push-subscribe-login',{subscription, urlid})
                              .then(x => {console.log("api without server-subscription Done...");})
                              .catch(err => console.log("api without server-subscription Erro...", err));
                          }

      }
    })
    .catch(function(err) {
      console.log("api without server-subscription Erro...", err);
    });
}


function displayConfirmNotification() {
  if ('serviceWorker' in navigator && Notification.permission == "granted") {
    var options = {
      body: 'You successfully subscribed to our Notification service!',
      icon: require('Assets/img/apple/tile_96x96.png'),
  dir: 'ltr',
      lang: 'en-US', // BCP 47,
      vibrate: [100, 50, 200],
      badge: require('Assets/img/apple/tile_96x96.png'),
      tag: 'confirm-notification',
      renotify: false,
      actions: [
        { action: 'confirm', title: 'Okay' },
        { action: 'cancel', title: 'Cancel' }
      ]
    };

    navigator.serviceWorker.ready
      .then(function(swreg) {
        if('showNotification' in ServiceWorkerRegistration.prototype)
        {
          swreg.showNotification('Successfully subscribed!', options);
        }
      });
  }
}





export function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      configurePushSub({notify: true});
    }
  });
}
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterLoaded);
} else {
    afterLoaded();
}
function afterLoaded() {

      let deferredPrompt;

      const addBtn = document.querySelector('.add-button');
      if(addBtn)
      {
        addBtn.style.display = 'none';
      }
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if(addBtn)
        {
          addBtn.style.display = 'block';

          addBtn.addEventListener('click', () => {
            // hide our user interface that shows our A2HS button
            addBtn.style.display = 'none';
            addBtn.style.visibility = 'hidden';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
              if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
              } else {
                console.log('User dismissed the A2HS prompt');
              }
              deferredPrompt = null;
            });
          });
        }

      });
};
