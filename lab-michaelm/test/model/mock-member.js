'use strict';

const faker = require('faker');
const mockLeader = require('./mock-leader.js');
const Member = require('../../model/member.js');


const mockMember = module.exports = {};

mockMember.createOne = () => {
  let result = {};
  return mockLeader.createOne()
  .then(leader => {
    result.leader = leader;
    return new Member({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      availabilityDate: ['07/02/2017', '07/09/2017'],
      userName: faker.random.word(),
      leader: leader._id.toString(),
    })
    .save();
  })
  .then(member => {
    result.member = member;
    return result;
  });
};

mockMember.createMany = (n) => {
  let result = {};
  return mockLeader.createOne()
  .then(leader => {
    result.leader = leader;
    let memberSavePromises = new Array(n).fill(0)
    .map(() => new Member({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      availabilityDate: ['07/02/2017', '07/09/2017'],
      userName: faker.random.word(),
      leader: leader._id.toString(),
    }).save());
    return Promise.all(memberSavePromises);
  })
  .then(members => {
    result.members = members;
    return result;
  });
};
