// Imports
// rst
import { createServer } from 'http';
// import https from 'https';
import assert from 'assert';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import connectRedis from 'connect-redis';
import socketIo from 'socket.io';
import mongoose from 'mongoose';

import webpackMiddleWare, { webpackHotMw } from './webpack.middleware';
import appMeta from './package.json';
import config from './config';
import logger from './lib/logger';
import startJobs from './lib/resque/resqueJobs';
import * as storage from './lib/storage';
import users from './routes/user';
import dashboards from './routes/dashboard';
import dashsuites from './routes/dashsuite';
import jobs from './routes/jobs';
// rcl

// Requires
// rst
const MongoDBStoreSession = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// rcl

// Syncronous wait function
function wait(ms) {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

// Attempt to connect to MongoDB (MongoDB should be ready in 8 seconds before an error is thrown)
// rst
let attempt = 0;
let error = null;
while (attempt < 4) {
  try {
    // console.log(storage.mongodb.mongooseUri());
    mongoose.connect(storage.mongodb.mongooseUri(), storage.mongodb.mongooseOptions());
    attempt = 4;
    error = null;
  } catch (e) {
    attempt++;
    error = e;
    wait(2000);
  }
}
if (error)
  throw error;
// const db = mongoose.connection;
// rcl

const store = new MongoDBStoreSession({
  uri: storage.mongodb.mongooseUri(),
  databaseName: storage.mongodb.mongooseOptions().dbName,
  collection: 'users_sessions',
}, (err) => { if (err) logger('err', err); });

store.on('error', (err) => {
  assert.ifError(err);
  assert.ok(false);
});


const env = process.env.NODE_ENV || 'development';
const RedisStore = connectRedis(session);
const app = express();
const server = createServer(app);
const io = socketIo(server, {});

const sessionMiddleware = session({
  store: new RedisStore({ client: storage.client }),
  secret: config.session.secret,
  key: appMeta.name,
  cookie: { secure: env !== 'development', maxAge: 1000 * 60 * 20 },
  resave: true,
  logErrors: true,
  saveUninitialized: true,
});

// app.use(sessionMiddleware);

// Middlewares
// rst
// Body & Cookie Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next));

// Render Engine
app.engine('hbs', exphbs({
  defaultLayout: 'index',
  extname: '.hbs',
  layoutsDir: 'src/views/',
}));

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes Middlewares
app.use('/users', users);
app.use('/dashboard', dashboards);
app.use('/dashsuites', dashsuites);
app.use('/jobs', jobs);

// Webpack Middleware
if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static('dist'));
} else {
  app.use(webpackMiddleWare());
  app.use(webpackHotMw());
}

// Compress .js resources in production
app.get('*.js', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // console.log(`asking for gzip ${req.url}`);
    req.url += '.gz';
    res.set('Content-Encoding', 'gzip');
  }
  next();
});
// rcl

app.set('view engine', 'hbs');
app.set('views', 'src/views');
app.set('port', process.env.PORT || 3000);

app.get('*', (req, res) => {
  res.render('index', {
    name: 'react-router',
  });
});

server.listen(app.get('port'), () => {
  logger('info', `running on port: ${app.get('port')}`);
  startJobs(io);
});
