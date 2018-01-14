import axios from 'axios';

export default function serviceWorkerBootstrap() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/serviceWorker.js').then(
                function(registration) {
                    // Are Notifications supported in the service worker?
                    if (
                        !(
                            'showNotification' in
                            ServiceWorkerRegistration.prototype
                        )
                    ) {
                        console.warn("Notifications aren't supported.");
                        return;
                    }

                    // Check the current Notification permission.
                    // If its denied, it's a permanent block until the
                    // user changes the permission
                    if ((Notification as any).permission === 'denied') {
                        console.warn('The user has blocked notifications.');
                        return;
                    }

                    // Check if push messaging is supported
                    if (!('PushManager' in window)) {
                        console.warn("Push messaging isn't supported.");
                        return;
                    }

                    // We need the service worker registration to check for a subscription
                    navigator.serviceWorker.ready.then(function(
                        serviceWorkerRegistration,
                    ) {
                        // Do we already have a push message subscription?
                        serviceWorkerRegistration.pushManager
                            .subscribe({ userVisibleOnly: true })
                            .then(function(subscription) {
                                axios
                                    .post('/push-notification-endpoint', {
                                        endpoint: subscription.endpoint,
                                    })
                                    .then(res => console.log(res.data));
                            })
                            .catch(function(e) {
                                if (
                                    (Notification as any).permission ===
                                    'denied'
                                ) {
                                    // The  user denied the notification permission which
                                    // means we failed to subscribe and the user will need
                                    // to manually change the notification permission to
                                    // subscribe to push messages
                                    console.warn(
                                        'Permission for Notifications was denied',
                                    );
                                } else {
                                    // A problem occurred with the subscription; common reasons
                                    // include network errors, and lacking gcm_sender_id and/or
                                    // gcm_user_visible_only in the manifest.
                                    console.error(
                                        'Unable to subscribe to push.',
                                        e,
                                    );
                                }
                            });
                    });
                },
                function(err) {
                    // registration failed :(
                    console.log('ServiceWorker registration failed: ', err);
                },
            );
        });
    }
}
