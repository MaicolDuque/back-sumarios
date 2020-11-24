'use strict'

// const rp = require('request-promise');
// const cheerio = require('cheerio');
// const fs = require('fs');
// require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session')

const configDB = require('./db');
const routesConfig = require('./routes');

app.use(cors({
    origin: "http://localhost:9042", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
}));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
  name: 'sumarios-app',
  keys: ['key1', 'key2']
}))

app.use(passport.initialize());
app.use(passport.session());

configDB(mongoose);
routesConfig(app);

module.exports = app
