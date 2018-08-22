// rst
import { createServer } from 'http';
import assert from 'assert';
import express from 'express';
import exphbs from 'express-handlebars';
import session from 'express-session';
import connectRedis from 'connect-redis';
import socketIo from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';

import webpackMiddleWare, { webpackHotMw } from './webpack.middleware';
import appMeta from './package.json';
import config from './config';
import logger from './lib/logger';
import startJobs from './lib/jobs';
import * as storage from './lib/storage';
import { ensureAutenticated } from './lib/utils';
import users from './routes/user';
import dashboards from './routes/dashboard';
import dashsuites from './routes/dashsuite';
// rcl

const MongoDBStoreSession = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const Job = require('./models/job');
const cookieParser = require('cookie-parser')

/* const MongoStore = require('express-session-mongo');
/*
const MongoClient = require('mongodb').MongoClient;
let DB;
MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  DB = client.db('metricio');
});
*/

mongoose.connect('mongodb://localhost:27017/metricio');
// const db = mongoose.connection;


const store = new MongoDBStoreSession({
  uri: 'mongodb://localhost:27017',
  databaseName: 'metricio',
  collection: 'users_sessions',
}, (err) => console.log(err));

store.on('error', (error) => {
  assert.ifError(error);
  assert.ok(false);
});
// store.on('connected', () => console.log(store));//*/


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

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  rolling: true,
  store,
  cookie: {
    secure: env !== 'development',
    maxAge: 1000 * 60 * 20,
  },
}));// */

//Middlewares
// rst
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

io.use((socket, next) => sessionMiddleware(socket.request, socket.request.res, next));

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'index',
    extname: '.hbs',
    layoutsDir: 'src/views/',
  }),
);

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

app.use('/users', users);
app.use('/dashboard', dashboards);
app.use('/dashsuites', dashsuites);

if (process.env.NODE_ENV === 'production') {
  app.use('/dist', express.static('dist'));
} else {
  app.use(webpackMiddleWare());
  app.use(webpackHotMw());
}
// rcl

app.set('view engine', 'hbs');
app.set('views', 'src/views');
app.set('port', process.env.PORT || 3000);

app.get('/jobs', ensureAutenticated, (req, res) => {
  res.write('got it!');
  res.end();
});

app.post('/jobs', ensureAutenticated, (req, res) => {
  const newJob = new Job({
    user: req.user.id,
    jobName: req.body.jobname,
    jobQuery: req.body.jobquery,
    datasource: req.body.datasource,
    aggregator: req.body.aggregator,
  });
  Job.create(newJob, (err, job) => {
    if (err) throw err;
    console.log(job);
  });
  res.end();
});

app.get('*', ensureAutenticated, (req, res) => {
  // console.log(req.session);
  res.render('index', {
    name: 'react-router',
  });
});

server.listen(app.get('port'), () => {
  logger('info', `running on port: ${app.get('port')}`);
  startJobs(io);
});
