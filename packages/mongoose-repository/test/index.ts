'use strict';

import mongoose from 'mongoose';
import { assertions } from './assertions';
import expect from 'expect';
import MongooseRepository from '../lib';

(mongoose as any).Promise = Promise;

const modelName = 'cats';
const schema = new mongoose.Schema({
  name: {
    type: String
  }
});

if (!(mongoose as any).modelSchemas[modelName]) {
  mongoose.model(modelName, schema);
}

/**
 * NODE_ENV=test mocha test/index.js --watch
 */
let connStr = 'mongodb://localhost/test';
if (process.env.NODE_ENV === 'docker') {
  console.log('Using docker configuration!');
  connStr = 'mongodb://mongo:27017/test';
}

describe('Mongoose Repository', () => {
  let repo: MongooseRepository;
  before(done => {
    const Model = mongoose.model(modelName)
    repo = new MongooseRepository(Model);
    const db = mongoose.connection;

    db.once('open', () => {
      done();
    });

    mongoose.connection.close(() => {
      mongoose.connect(connStr);
    });
  });

  after(async () => {
    await repo.disconnect();
  });

  describe('generic assertions', () => {
    const client = {
      name: 'foo'
    };
    const bag = {
      client
    };
    assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });


  describe('count', () => {
    it('testing count method', done => {
      expect(typeof repo.count).toExist();
      expect(typeof repo.count).toBe('function');
      repo.count((err, count: number) => {
        expect(err).toNotExist();
        expect(Number.isNaN(count)).toBe(false);
        done();
      });
    });
  });
});
