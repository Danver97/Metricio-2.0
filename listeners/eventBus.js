const EventEmitter = require('events');

class EventBus extends EventEmitter {}

const bus = new EventBus();
bus.setMaxListeners(100);

module.exports = bus;
