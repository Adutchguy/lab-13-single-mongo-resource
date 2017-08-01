'use strict'

const Leader = require('../../model/leader.js');
const Member = require('../../model/member.js');

module.exports = () => {
  return Promise.all([
    Leader.remove({}),
    Member.remove({}),
  ]);
};
