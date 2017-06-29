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

describe('Testing leader routes', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST /api/leader', () => {
    let data = {
      firstName: 'Michael',
      lastName: 'Miller',
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

    it('Should respond with a leader leader', () => {
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.get(`${API_URL}/api/leader/${tempLeader._id}`);
      })
      .then(res => {
        console.log('res.body:\n\n', res.body);
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

  describe('Testing GET /api/leaders', () => {

    it('Should respond with a paged array of all leaders', () => {
      let tempLeaders;
      return mockLeader.createMany(20)
      .then(leaders => {
        tempLeaders = leaders;
        return superagent.get(`${API_URL}/api/leaders`);
      })
      .then(res => {
        console.log('res.body:\n\n', res.body);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(10);
        res.body.forEach(leaders => {
          expect(leaders._id).toExist();
          expect(leaders.firstName).toExist();
          expect(leaders.lastName).toExist();
        });
      });
    });

    it('Should respond with a paged array of all leaders', () => {
      let tempLeaders;
      return mockLeader.createMany(20)
      .then(leaders => {
        tempLeaders = leaders;
        return superagent.get(`${API_URL}/api/leaders?page=2`);
      })
      .then(res => {
        console.log('res.body:\n\n', res.body);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(10);
        res.body.forEach(leaders => {
          expect(leaders._id).toExist();
          expect(leaders.firstName).toExist();
          expect(leaders.lastName).toExist();
        });
      });
    });

    it('Should respond with an empty array', () => {
      let tempLeaders;
      return mockLeader.createMany(20)
      .then(leaders => {
        tempLeaders = leaders;
        return superagent.get(`${API_URL}/api/leaders?page=3`);
      })
      .then(res => {
        console.log('res.body:\n\n', res.body);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
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
    it('Should respond with a changed leader leader', () => {
      return superagent.put(`${API_URL}/api/leader/${tempLeader._id}`)
      .send({firstName: 'John'})
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body._id).toEqual(tempLeader._id);
        expect(res.body.firstName).toEqual('John');
        expect(res.body.lastName).toEqual(tempLeader.lastName);
        expect(res.body.submitted).toExist();
      });
    });

    it('Should respond with a 400 status code', () => {
      return superagent.put(`${API_URL}/api/leader/${tempLeader._id}`)
      .send({})
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
    it('Should remove specified(by _id) leader leader', () => {
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.get(`${API_URL}/api/leader/${tempLeader._id}`);
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
