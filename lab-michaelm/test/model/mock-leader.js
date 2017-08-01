'use strict';

const faker = require('faker');
const Leader = require('../../model/leader.js');


const mockLeader = module.exports = {};

mockLeader.createOne = () => {
  return new Leader({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.random.words(1),
  })
  .save();
};

mockLeader.createMany = (n) => {
  let mockLeaderArray = new Array(n)
    .fill(0).map(() => mockLeader.createOne());
  return Promise.all(mockLeaderArray);
};
