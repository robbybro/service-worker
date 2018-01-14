'use strict';

import axios from 'axios';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import webpack from 'webpack';
import bodyParser from 'body-parser';

import manifest from './manifest.json';
import middleware from './middleware';
import secrets from './secrets';

process.on('uncaughtException', function(err) {
    console.error(
        new Date().toUTCString(),
        `uncaughtException: ${err.message}`,
    );
    console.error(err.stack);
    process.exit(1);
});

process.noDeprecation = true;

const isDeveloping = process.env.NODE_ENV !== 'production';
const port = isDeveloping ? 3000 : process.env.PORT;

const app = express();
const staticPath = path.join(__dirname, 'build');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(staticPath));

if (isDeveloping) {
    const config = require('./webpack.config.dev');
    const compiler = webpack(config);
    app.use(express.static(path.resolve(__dirname, 'src')));
    app.use(
        require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: config.output.publicPath,
            stats: {
                assets: false,
                colors: true,
                version: false,
                hash: false,
                timings: false,
                chunks: false,
                chunkModules: false,
            },
        }),
    );
    app.use(require('webpack-hot-middleware')(compiler));
} else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
}

let registrationId;

app.get('/title', function(req, res) {
    return res.json({
        title: 'App is online!',
    });
});

app.get('/manifest.json', (req, res) => {
    return res.send(manifest);
});

app.post('/push-notification-endpoint', (req, res) => {
    const endpoint = req.body.endpoint.split('/');
    const tmp = endpoint[endpoint.length - 1];
    if (registrationId !== tmp) {
        registrationId = tmp;
        res.send(`registration id updated to ${registrationId}`);
    }
});

app.get('*', middleware);

app.listen(port, function() {
    console.log('Project Running');
});

// send a new push notification every 10 seconds (lol so annoying)
// setInterval(() => {
//     console.log('checking for registration id', registrationId);
//     if (registrationId) {
//         console.log('attempting to send a push notification');
//         axios
//             .post('https://android.googleapis.com/gcm/send', {
//                 headers: {
//                     Authorization: `key=${secrets.serverKey}`,
//                     'Content-Type': 'application/json',
//                 },
//                 data: {
//                     registration_ids: [registrationId],
//                 },
//             })
//             .then(res => console.log)
//             .catch(err => console.error);
//     }
// }, 10000);
