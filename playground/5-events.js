const events = require('events')

const {EventEmitter} = events;

const eventEmitter = new EventEmitter();
const EVENT_NAME = 'myEvent'

eventEmitter.on(EVENT_NAME, (data) => {
  console.log(data, ' - first');
});

console.log('Statement A');

eventEmitter.on(EVENT_NAME, (data) => {
  console.log(data, ' - second');
});

// will follow the created listener order
// also, events are synchronous and blocking
eventEmitter.emit(EVENT_NAME, 'Emitted Statement');

console.log('Statement B');
