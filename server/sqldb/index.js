/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Chat = db.sequelize.import('../api/chat/chat.model');
db.Mail = db.sequelize.import('../api/mail/mail.model');
db.Reservation = db.sequelize.import('../api/reservation/reservation.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

module.exports = db;
