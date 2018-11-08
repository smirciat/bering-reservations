/**
 * Chat model events
 */

'use strict';

import {EventEmitter} from 'events';
var Chat = require('../../sqldb').Chat;
var ChatEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ChatEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Chat.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ChatEvents.emit(event + ':' + doc._id, doc);
    ChatEvents.emit(event, doc);
    done(null);
  }
}

export default ChatEvents;
