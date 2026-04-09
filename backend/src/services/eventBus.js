const EventEmitter = require("node:events");

class EventBus extends EventEmitter {}

const eventBus = new EventBus();

module.exports = { eventBus };
