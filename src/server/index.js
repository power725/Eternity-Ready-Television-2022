/* @flow */
global.__SERVER__ = true;
require('es6-promise').polyfill();
require('fetch-everywhere');

import React from 'react';
import ReactDOM from 'react-dom/server';
import {
	match,
	RouterContext
} from 'react-router';
import _ from 'lodash';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import expressValidator from 'express-validator';
import mongoose from 'mongoose';
import Promise from 'bluebird';
mongoose.Promise=Promise;
import passport from 'passport';
import serialize from 'serialize-javascript';
import useragent from 'express-useragent';
import config from './config';
import {
	loadOnServer
} from 'redux-connect'
import {
	Provider
} from 'react-redux';

import adminCreateStore from '../admin/redux/create';
import ApiClient from '../app/helpers/ApiClient';
import createStore from '../app/redux/create';
import adminRoutes from '../admin/routes';
import routes from '../app/routes.jsx';
import {
	passportInit
} from './passport/passport';
import adminController from './admin/admin.controller';
import categoryController from './category/category.controller';
import channelController from './channel/channel.controller';
import userController from './user/user.controller';

var STATIC_ASSETS_CDN = process.env.STATIC_ASSETS_CDN || '';
var WEBPACK_ASSETS = process.env.WEBPACK_ASSETS || '';

global.__currentRequestUserAgent__ = '';

// TODO: handle mongoose error
console.log('port ' + process.env.PORT);
console.log('connect to ' + config.MONGO_URL);
mongoose.connect(config.MONGO_URL);
const app = express();

app.use(express.static('www'));
app.use(useragent.express());

app.set('view engine', 'pug');
app.set('views', $dirname + '/views/');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(expressValidator([{}]));

passportInit(app);

app.use(function(req, res, next) {

	req.WEPAPP_URI = config.WEPAPP_URI;

	let jwtToken;
	if (req.url.indexOf('admin') >= 0) {
		jwtToken = req.cookies['admin/auth/token'];
		if (jwtToken) {
			req.headers['authorization'] = jwtToken;
		}
	} else {
		jwtToken = req.cookies['auth/token'];
		if (jwtToken) {
			req.headers['authorization'] = jwtToken;
		}
	}

	next();
});


// WEB APP
if (!process.env.ADMIN) {

	app.use('/api/user', userController);
	app.use('/api/category', categoryController);
	app.use('/api/channels', channelController);

	app.use('/login|/signup', (req, res, next) => {
		if (req.user) {
			 res.redirect('/browse');
		}
		else {
			next();
		}
	});

	app.use('/change-password', passport.authenticate('jwt', {
		session: false,
		failureRedirect: '/login'
	}));

	app.get('*', (req, res) => {

		global.__currentRequestUserAgent__ = req.useragent;

		match({
			routes: routes({}),
			location: req.url
		}, (error, redirectLocation, renderProps) => {

			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {

				// some logic for show dialog

				const client = new ApiClient(req);
				const store = createStore(client);

				loadOnServer({...renderProps,
					store
				}).then(() => {

					const createPage = (html, store) => {
						res.send(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Eternity Ready</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <link rel="stylesheet" type="text/css" href="${STATIC_ASSETS_CDN}/styles.css">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <link rel="shortcut icon" href="favicon.ico" />
              </head>
              <body>
                <div id="root">${html}</div>
                <script dangerouslySetInnerHTML={{__html: window.__data=${serialize(store.getState())};}} charSet="UTF-8"> </script>
                <script type="text/javascript" src="${WEBPACK_ASSETS}/app.js"></script>
              </body>
            </html>`);
					};

					var appHTML = ReactDOM.renderToString(
						<Provider store={store} key="provider">
							<RouterContext {...renderProps} />
						</Provider>
					);

					const html = createPage(appHTML, store);
					res.send(html)
				});

			} else {
				res.status(404).send('Not found');
			}
		})
	});
}

// ADMIN APP
if (process.env.ADMIN) {

	app.use('/api/admin', adminController);

	app.use('/admin/|/admin/users|/admin/channels', passport.authenticate('jwt', {
		session: false,
		failureRedirect: '/admin/login'
	}));

	app.use('/admin/|/admin/users|/admin/channels', (req, res, next) => {
		if (!req.user.isAdmin) {
			return res.redirect('/admin/login');
		}

		return next();
	});

	app.get('/admin*', (req, res) => {

		global.__currentRequestUserAgent__ = req.useragent;

		match({
			routes: adminRoutes({}),
			location: req.url
		}, (error, redirectLocation, renderProps) => {

			if (error) {
				res.status(500).send(error.message)
			} else if (redirectLocation) {
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			} else if (renderProps) {

				// some logic for show dialog

				const client = new ApiClient(req);

				const store = adminCreateStore(client);

				loadOnServer({...renderProps,
					store
				}).then(() => {

					const createPage = (html, store) => {
						res.send(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <title>Admin - Eternity Ready</title>
                <meta name="viewport" content="width=device-width,initial-scale=1">
                <link rel="stylesheet" type="text/css" href="${STATIC_ASSETS_CDN}/admin-styles.css">
                <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                <link rel="shortcut icon" href="/favicon.ico" />
              </head>
              <body>
                <div id="root">${html}</div>
                <script dangerouslySetInnerHTML={{__html: window.__data=${serialize(store.getState())};}} charSet="UTF-8"> </script>
                <script type="text/javascript" src="${WEBPACK_ASSETS}/admin-app.js"></script>
              </body>
            </html>
          `);
					};

					var appHTML = ReactDOM.renderToString(
						<Provider store={store} key="provider">
              <RouterContext {...renderProps} />
            </Provider>
					);

					const html = createPage(appHTML, store);
					res.send(html)
				});

			} else {
				res.status(404).send('Not found')
			}
		})
	});
}

export default app;
