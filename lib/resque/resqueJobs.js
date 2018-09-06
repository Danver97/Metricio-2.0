// Imports
// rst
import schedule from 'node-schedule';
import moment from 'moment';
// import RequireAll from 'require-all';

// import paths from '../config/paths';
import logger from '../logger';
import { redis } from '../storage';
import ResqueScheduler from './scheduler';
import ResqueWorker from './worker';
import ResqueQueue from './queue';
// rcl

const jobProvider = require('../jobsProvider');

// Global vars
// rst
let CLIENTS;
let QUEUES;
let JOBS;
const SCHEDULEDJOBS = {};

let worker;
let queue;
let scheduler;
// rcl

// Handlers
// rst
async function cacheResponseProxy(job, widget) {
  const cacheKey = `job:${job.class}`;
  const updatedAt = moment().format('D/M/YYYY h:mm:ss');
  const widgetData = Object.assign({}, { updatedAt }, widget.data);

  logger('info', `cache: adding ${cacheKey}`);

  try {
    await redis.hset(cacheKey, widget.target, JSON.stringify(widgetData));
  } catch (err) {
    logger('error', 'cacheResponseProxy', err);
    throw err;
  }

  return widgetData;
}

/**
 * Update a specific client from cache
 * @param {Object} client socket for newley connected client
 */
async function udpdateClientFromCache(client) {
  logger('info', 'cache: updating client ->', client.id);

  const cachedResponses = Object.keys(JOBS).map(job => {
    const cacheKey = `job:${job}`;
    return redis.hgetall(cacheKey);
  });

  const responses = await Promise.all(cachedResponses);

  responses.forEach(response => {
    const widgets = Object.keys(response);
    widgets.forEach(widget => {
      const parsed = JSON.parse(response[widget]);

      // logger('info', `cache: updating widget -> ${widget} \n`, JSON.stringify(parsed));
      client.emit(`widget:update:${widget}`, parsed);
    });
  });
}

/**
 * Update all currently connected clients from cache
 * @param {*} que current worker queue
 * @param {*} job current worker job
 * @param {*} widgets current job widgets
 */
function updateClients(que, job, widgets) {
  logger('info', `sockets: updating ${CLIENTS.length} clients`);

  CLIENTS.forEach(client => {
    widgets.forEach(async widget => {
      const { target } = widget;
      const response = await cacheResponseProxy(job, widget);

      logger('info', `sockets: updating widget ${target} \n`/* , JSON.stringify(response) */);
      client.emit(`widget:update:${target}`, response);
    });
  });
}

/**
 * Handle new socket client connections/disconnections
 * @param {Object} io socket.io instance
 */
function handleSocketConnections(io) {
  io.sockets.on('connection', socket => {
    logger('info', 'sockets: adding client ->', socket.id);
    CLIENTS.push(socket);
    udpdateClientFromCache(socket);

    socket.on('disconnect', () => {
      logger('info', 'sockets: removing client ->', socket.id);
      CLIENTS.splice(CLIENTS.indexOf(socket), 1);
    });
  });
}
// rcl

/**
 * Start all jobs and update all connected clients
 * @param {Object} io socket.io instance
 */
async function start(io) {
  // Handle socket/client events
  handleSocketConnections(io);

  // Start and connect worker
  try {
    await worker.connect();
    await worker.start();
  } catch (error) {
    logger('error', 'worker failed connect/cleanup/start');
    throw error;
  }

  // Start and connect the scheduler
  try {
    await scheduler.connect();
    await scheduler.start();
  } catch (error) {
    logger('error', 'scheduler failed start/connect');
    throw error;
  }

  // Connect to the queue
  try {
    await queue.connect();
  } catch (error) {
    logger('error', 'queue failed connect');
    throw error;
  }
  // console.log(worker);
  // Update connected clients when a job is successfull
  worker.on('success', updateClients);

  // Schedule all available jobs
  Object.keys(JOBS).forEach(jobName => {
    const job = JOBS[jobName];
    
    scheduleNewJob(job, jobName);
  });
}

// Management functions
// rst
function scheduleNewJob(job, jobName) {
  SCHEDULEDJOBS[jobName] = schedule.scheduleJob(job.interval, async () => {
    if (scheduler.master) {
      logger('info', 'scheduler: adding job ->', jobName);
      queue.enqueue('dashboard', jobName);
    }
  });
}

function removeScheduledJob(jobName) {
  SCHEDULEDJOBS[jobName].cancel();
}

export async function addNewJob(job) {
  JOBS[job.jobName] = job[job.jobName];
  // console.log(JOBS);
  await worker.end();
  worker = ResqueWorker(QUEUES, JOBS);
  await worker.connect();
  await worker.start();
  scheduleNewJob(JOBS[job.jobName], job.jobName);
}

export async function removeJob(jobName) {
  delete JOBS[jobName];
  await worker.end();
  removeScheduledJob(jobName);
  worker = ResqueWorker(QUEUES, JOBS);
  await worker.connect();
  await worker.start();
}
// rcl

// Shutdown all processes
async function shutdown() {
  logger('info', 'shutting down');

  try {
    await scheduler.end();
    await worker.end();
    await queue.end();
  } catch (error) {
    logger('error', 'shutdown process failed');
    throw error;
  }

  process.exit();
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default async function initializeResqueJobs(io) {
  CLIENTS = [];
  QUEUES = ['dashboard'];
  JOBS = await jobProvider(addNewJob, removeJob); // RequireAll(paths.jobs);

  worker = ResqueWorker(QUEUES, JOBS);
  queue = ResqueQueue(); // ResqueQueue(JOBS);
  scheduler = ResqueScheduler();
  start(io);
}
