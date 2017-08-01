'use strict';

const mongoose = require('mongoose');
const Leader = require('./leader.js');

const memberSchema = mongoose.Schema( {
  firstName: {type:String, required: true},
  lastName: {type: String, required: true},
  availabilityDate: {type: [], required: true},
  userName: {type: String, required: true, unique: true},
  submitted: {type: Date, default: Date.now},
  leader: {type: [mongoose.Schema.Types.ObjectId], required: true, ref: 'leader'},
});

memberSchema.pre('save', function(next) {
  Leader.findById(this.leader)
  .then(leader => {
    let memberIDSet = new Set(leader.member);
    memberIDSet.add(this._id);
    leader.member = Array.from(memberIDSet);
    return leader.save();
  })
  .then(() => next())
  .catch(() =>
    next(new Error('validation failed to create a member because leader does not exist')));
});

memberSchema.post('remove', function(doc, next){
  Leader.findById(doc.leader)
  .then(leader => {
    leader.member = leader.member.filter(member => member._id !== doc._id);
    return leader.save();
  })
  .then(() => next())
  .catch(next);
});

module.exports = mongoose.model('member', memberSchema);
