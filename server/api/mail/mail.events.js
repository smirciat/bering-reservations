/**
 * Mail model events
 */

'use strict';

import {EventEmitter} from 'events';
var Mail = require('../../sqldb').Mail;
var MailEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MailEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Mail.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    MailEvents.emit(event + ':' + doc._id, doc);
    MailEvents.emit(event, doc);
    done(null);
  }
}

export default MailEvents;
