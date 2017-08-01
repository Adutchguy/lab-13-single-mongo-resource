'use strict';

// test env
require('dotenv').config({path: `${__dirname}/../.test.env`});

// npm mods
const expect = require('expect');
const superagent = require('superagent');
// app mods
const server = require('../lib/server.js');
const clearDB = require('./lib/clear-db.js');
const Leader = require('../model/leader.js');
const mockMember = require('./model/mock-member.js');
const mockLeader = require('./model/mock-leader.js');

const API_URL = process.env.API_URL;

describe('--------Testing member routes----------', () => {
  before(server.start);
  after(server.stop);
  afterEach(clearDB);

  describe('Testing POST /api/member', () => {
    it('Should return a new member', () => {
      let tempMember, tempLeader;
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.post(`${API_URL}/api/member`)
        .send({
          firstName: 'Mike',
          lastName: 'Miller',
          availabilityDate: ['07/02/2017', '07/09/2017'],
          userName: 'bling',
          leader: [leader._id.toString()],
        });
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.firstName).toEqual('Mike');
        expect(res.body.lastName).toEqual('Miller');
        expect(res.body.availabilityDate).toEqual(['07/02/2017', '07/09/2017']);
        expect(res.body.leader).toEqual(tempLeader._id.toString());
        expect(res.body.userName).toEqual('bling');
        expect(res.body._id).toExist();
        tempMember = res.body;
        return Leader.findById(tempLeader._id);
      })
      .then(leader => {
        expect(leader.member.length).toEqual(1);
        expect(leader.member[0].toString()).toEqual(tempMember._id.toString());
      });
    });
    it('Should respond with a 400 status code', () => {
      return superagent.post(`${API_URL}/api/member`)
      .send({
        firstName: 'Mike',
        lastName: 'Miller',
        availabilityDate: ['07/02/2017', '07/09/2017'],
        userName: 'bling',
        leader: '654684653548',
      })
      .then(res => {
        throw res;
      })
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
    it('Should respond with a 409 status code', () => {
      let tempLeader;
      return mockLeader.createOne()
      .then(leader => {
        tempLeader = leader;
        return superagent.post(`${API_URL}/api/member`)
        .send({
          firstName: 'Mike',
          lastName: 'Miller',
          availabilityDate: ['07/02/2017', '07/09/2017'],
          userName: 'bling',
          leader: leader._id.toString(),
        });
      })
      .then(() => {
        return superagent.post(`${API_URL}/api/member`)
      .send({
        firstName: 'Mike',
        lastName: 'Miller',
        availabilityDate: ['07/02/2017', '07/09/2017'],
        userName: 'bling',
        leader: tempLeader._id.toString(),
      });
      })
      .then(res => {
        throw res;
      })
      .catch(res => {
        expect(res.status).toEqual(409);
      });
    });
  });

  describe('Testing GET /api/member:id', () => {
    it('Should return a member', () => {
      let tempTeam;
      return mockMember.createOne()
      .then(member => {
        tempTeam = member;
        return superagent.get(`${API_URL}/api/member/${tempTeam.member._id}`);
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.firstName).toEqual(tempTeam.member.firstName);
        expect(res.body.lastName).toEqual(tempTeam.member.lastName);
        expect(res.body.availabilityDate).toEqual(['07/02/2017', '07/09/2017']);
        expect(res.body.leader.toString()).toEqual(tempTeam.leader._id);
        expect(res.body.userName).toEqual(tempTeam.member.userName);
        expect(res.body._id).toExist();
        return Leader.findById(tempTeam.leader._id);
      })
      .then(leader => {
        expect(leader.member.length).toEqual(1);
        expect(leader.member[0].toString()).toEqual(tempTeam.member._id.toString());
      });
    });
    it('Should respond with a 404', () => {
      return superagent.get(`${API_URL}/api/`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });

  describe('Testing PUT /api/member/:id', () => {
    it('Should respond with an updated member', () => {
      let tempLeader, tempMember;
      return mockMember.createOne()
      .then(({leader, member}) => {
        tempLeader = leader;
        tempMember = member;
        return superagent.put(`${API_URL}/api/member/${tempMember._id.toString()}`)
        .send({firstName: 'John'});
      })
      .then(res => {
        expect(res.status).toEqual(200);
        expect(res.body.firstName).toEqual('John');
        expect(res.body.lastName).toEqual(tempMember.lastName);
        expect(res.body.userName).toEqual(tempMember.userName);
        expect(res.body.availabilityDate).toEqual(tempMember.availabilityDate);
        tempMember = res.body;
        return Leader.findById(tempLeader._id);
      })
      .then(leader => {
        expect(leader.member.length).toEqual(1);
        expect(leader.member[0].toString()).toEqual(tempMember._id.toString());
      });
    });

    it('Should respond with a 400 status code', () => {
      let tempMember;
      return mockMember.createOne()
      .then(({member}) => {
        tempMember = member;
        return superagent.put(`${API_URL}/api/member/${tempMember._id.toString()}`)
        .send({
          firstName: 'Mike',
          lastName: 'Miller',
          availabilityDate: ['07/02/2017', '07/09/2017'],
          userName: 'bling',
          leader: '654684653548',
        });
      })
      .then(res => {
        throw res;
      })
      .catch(res => {
        expect(res.status).toEqual(400);
      });
    });
    it('Should respond with a 404', () => {
      return superagent.put(`${API_URL}/api/`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });

  describe('Testing DELETE /api/member:id', () => {
    it('Should remove specified(by _id) member', () => {
      let tempMember;
      return mockMember.createOne()
      .then(({member}) => {
        tempMember = member;
        return superagent.delete(`${API_URL}/api/member/${tempMember._id.toString()}`);
      })
      .then(res => {
        expect(res.status).toEqual(204);
      });
    });

    it('Should respond with a 404', () => {
      return superagent.delete(`${API_URL}/api`)
      .catch(res => {
        expect(res.status).toEqual(404);
      });
    });
  });
});
