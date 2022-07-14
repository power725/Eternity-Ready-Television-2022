import passport from 'passport';
import jwt from 'jwt-simple';
import { Strategy as JwtStrategy} from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Strategy as FacebookStrategy }  from 'passport-facebook'
import { Strategy as TwitterStrategy }  from 'passport-twitter';
import uuidV4 from 'uuid/v4';

import config from '../config';
import { sendForgotPasswordEmail } from '../email';

import bcrypt from 'bcrypt-nodejs'
import User from '../user/user.model';


function oauthStrategyHandler(accessToken, refreshToken, profile, done) {

  const username = profile.provider + '/' + profile.id;

  var user = {
    username,
    email: ((profile.emails || [])[0] || {}).value,
    name: profile.displayName,
    avatar: ((profile.photos || [])[0] || {}).value,
    validated: true,
    auth: {
      id: profile.id,
      provider: profile.provider,
      accessToken,
      refreshToken
    }
  };

  User.findOne({username}, function (err, response) {
    if (err) {
      return done(err);
    }

    if (!response) {
      return User.create(user, done);
    }

    done(null, response);
  });
}

function oauthMiddleware(req, res) {
  var token = 'JWT ' + jwt.encode({_id: req.user._id}, config.JWT_SECRET_KEY);

  const user = JSON.stringify(req.user);

  res.render('oauth', {success: true, token, user});
}


export function passportInit (app) {

  var opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.JWT_SECRET_KEY,
  };

  passport.use(new JwtStrategy(opts, function(jwtPayload, done) {

    User.findOne({_id: jwtPayload._id}, function(err, user) {
      if (err) {
        return done(err, false);
      }

      if (user && user.validated && !user.suspended) {
        done(null, JSON.parse(JSON.stringify(user)));
      } else {
        done(null, false);
        // or you could create a new account
      }
    });
  }));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new FacebookStrategy({
    clientID:      '654985928045301',
    clientSecret:  '34638a9e8a4706a1ed0429291384730e',
    callbackURL:   "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  }, oauthStrategyHandler));

  passport.use(new TwitterStrategy({
    consumerKey: 'Sw9CdzldIiQlLvJptJXAZeFGK',
    consumerSecret: 'igKst5zHYjWVRiwSaxyyEqxfmHRpRGexUZPy3t0zAflR6HQlnD',
    callbackURL: "/auth/twitter/callback",
    includeEmail: true
  }, oauthStrategyHandler));

  app.use(require('express-session')({
    secret: 'jdnbd2397rgdadjnbvq',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // FACEBOOK
  app.get('/auth/facebook',
    passport.authenticate('facebook', {scope: ['public_profile', 'email']}));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    oauthMiddleware);

  // TWITTER
  app.get('/auth/twitter',
    passport.authenticate('twitter', {session: false}));

  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {session: false, failureRedirect: '/login' }),
    oauthMiddleware);

}