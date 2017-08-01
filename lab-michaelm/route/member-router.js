'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Member = require('../model/member.js');
const memberRouter = module.exports = new Router();

memberRouter.post('/api/member', jsonParser, (req, res, next) => {
  new Member(req.body)
  .save()
  .then(data => res.json(data))
  .catch(next);
});

memberRouter.get('/api/member/:id', (req, res, next) => {
  Member.findById(req.params.id)
  .then(data => res.json(data))
  .catch(next);
});

memberRouter.put('/api/member/:id', jsonParser, (req, res, next) => {
  let options = {
    runValidators: true,
    new: true,
  };
  return Member.findByIdAndUpdate(req.params.id, req.body, options)
  .then(data => res.json(data))
  .catch(next);
});

memberRouter.delete('/api/member/:id', (req, res, next) => {
  Member.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
