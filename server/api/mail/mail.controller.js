/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/mails              ->  index
 * POST    /api/mails              ->  create
 * GET     /api/mails/:id          ->  show
 * PUT     /api/mails/:id          ->  update
 * DELETE  /api/mails/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Mail} from '../../sqldb';
var nodemailer = require('nodemailer');


// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport({ 
    host: 'smtp.gmail.com', 
    port: 465, 
    auth: { user: 'beringair.kotzebue@gmail.com', pass: process.env.GMAIL_PASS },
    secure: true
});

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    if(entity) {
      return entity.updateAttributes(updates)
        .then(updated => {
          return updated;
        });
    }
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Mails
export function index(req, res) {
  return Mail.findAll()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Mail from the DB
export function show(req, res) {
  return Mail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Mail in the DB
export function create(req, res) {
  //req.body is attachmet of api call
  //req.body contains from, to, subjet, text
  if (!req.body||Object.keys(req.body).length===0||!req.body.to||!req.body.text) {
    res.sendStatus(500);
    return;
  }
  var mailOptions = req.body;
  mailOptions.from = '"Bering Air Kotzebue" <beringair.kotzebue@gmail.com>';
  // send mail with defined transport object
  console.log(mailOptions)
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        handleError(res);
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    res.sendStatus(200);
    return info.response;
  });
  //Mail.create(req.body)
    //.then(responseWithResult(res, 201))
    //.catch(handleError(res));
}

// Updates an existing Mail in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Mail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Mail from the DB
export function destroy(req, res) {
  return Mail.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
