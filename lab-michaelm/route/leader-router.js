'use strict';

const {Router} = require('express');
const jsonParser = require('body-parser').json();
const Leader = require('../model/leader.js');
const leaderRouter = module.exports = new Router();

leaderRouter.post('/api/leader', jsonParser, (req, res, next) => {
  new Leader(req.body)
  .save()
  .then(data => res.json(data))
  .catch(next);
});

leaderRouter.get('/api/leader/:id', (req, res, next) => {
  Leader.findById(req.params.id)
  .then(data => res.json(data))
  .catch(next);
});

leaderRouter.put('/api/leader/:id', jsonParser, (req, res, next) => {
  let options = {
    runValidators: true,
    new: true,
  };
  Leader.findByIdAndUpdate(req.params.id, req.body, options)
  .then(data => res.json(data))
  .catch(next);
});

leaderRouter.delete('/api/leader/:id', (req, res, next) => {
  Leader.findByIdAndRemove(req.params.id)
  .then(() => res.sendStatus(204))
  .catch(next);
});
