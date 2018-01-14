# Service Worker Example
## Based on [my typescript starter project](https://github.com/robbybro/typescript-webpack-node-docker-starter)

This project uses service workers to cache site dependencies for a robust offline experience, and utilizes [Firebase](https://console.firebase.google.com) to send push notifications to online apps.

## Sending Push Notifications
* `npm i && npm run dev`
* open browser to **http://localhost:3000**. This will register the service worker which will do a few things.
    * Cache dependencies for offline use
    * Ask for permission to display Notifications
    * Register a unique ID for pushing notifications to. You may want to save individual ID's for individual users etc.
* grab the REGISTRATION_ID printed in the console either in the browser or your terminal
* grab your Server key from Firebase
* run the below curl command
* you should see a push notification appear!
`
curl --header "Authorization: key=<YOUR_API_KEY>" --header
"Content-Type: application/json" https://android.googleapis.com/gcm/send -d
"{\"registration_ids\":[\"<YOUR_REGISTRATION_ID>\"]}"
`

* Try switching the browser to offline mode and refreshing the page. You will see all network requests fail, but because the service worker cached the dependencies, it will be able to load an offline version of the page

** Note that the examples on Google's Web Developer site uses 'YOU_API_KEY' and 'Server key' synonymously which can be found in the Cloud Messaging settings of your Firebase app.


## Resources
* [Google documentation on service workers](https://developers.google.com/web/fundamentals/primers/service-workers/)
* [Google documentation on Push notifications](https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web)