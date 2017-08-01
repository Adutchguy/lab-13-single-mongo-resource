'use strict';

// test env
require('dotenv').config({path: `${__dirname}/../.test.env`});

// npm mods
const faker = require('faker');
const expect = require('expect');
const superagent = require('superagent');
// app mods
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const mockLeader = require('./model/mock-leader.js');

let tempLeader;
const API_URL = process.env.API_URL;

describe('----------Testing leader routes-----------', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST /api/leader', () => {
    let data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      userName: faker.random.words(1),
    };
    it('Should return a new leader', () => {
      return superagent.post(`${API_URL}/api/leader`)
      .send(data)
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.firstName).toEqual(data.firstName);
        expect(res.body.lastName).toEqual(data.lastName);
        expect(res.body._id).toExist();
      });
    });
    it('Should respond with a 400 status code', () => {
      return superagent.post(`${API_URL}/api/leader`)
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
    it('Should respond with a 409 status code', () => {
      return superagent.post(`${API_URL}/api/leader`)
      .send(data)
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });
  });

  describe('Testing GET /api/leader:id', () => {
    it('Should respond with a leader', () => {
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.get(`${API_URL}/api/leader/${tempLeader._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempLeader._id);
        expect(res.body.firstName).toEqual(tempLeader.firstName);
        expect(res.body.lastName).toEqual(tempLeader.lastName);
        expect(res.body.submitted).toExist();
      });
    });

    it('Should respond with a 404', () => {
      return superagent.get(`${API_URL}/api/leader/5952a8d5c1b8d566a64ea23g`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });

  describe('Testing PUT /api/leader/:id', () => {
    it('Should respond with a changed leader', () => {
      let tempLeader;
      let data = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.random.words(1),
      };
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.put(`${API_URL}/api/leader/${tempLeader._id.toString()}`)
        .send(data);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempLeader._id);
        expect(res.body.firstName).toEqual(data.firstName);
        expect(res.body.lastName).toEqual(data.lastName);
        expect(res.body.submitted).toExist();
      });
    });

    it('Should respond with a 400 status code', () => {
      let tempLeader;
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        let data = {
          firstName: 'mike',
          lastName: 'miller',
          userName: '',
        };
        return superagent.put(`${API_URL}/api/leader/${tempLeader._id.toString()}`)
        .send(data);
      })
      .then(res => {
        throw res;
      })
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });

    it('Should respond with a 404', () => {
      return superagent.put(`${API_URL}/api/leader/5952a8d5c1b8d566a64ea23g`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });

  describe('Testing DELETE /api/leader:id', () => {
    let tempLeader;
    it('Should remove specified(by _id) leader', () => {
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.delete(`${API_URL}/api/leader/${tempLeader._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });

    it('Should respond with a 404', () => {
      return superagent.delete(`${API_URL}/api/leader/5952a8d5c1b8d566a64ea23f`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });
});
