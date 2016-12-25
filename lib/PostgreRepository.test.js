
'use strict';

// const expect = require('expect');
const PostgreRepository = require('./PostgreRepository');
const Sequelize = require('sequelize');
const Assertions = require('./test/Assertions');
export const modelName = 'clients';
export const schema = {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
};

describe('Postgre Repository', () => {
  let sequelize;
  let repo;

  sequelize = new Sequelize('travis', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  });

  if (!sequelize.isDefined(modelName)) {
    sequelize.define(modelName, schema);
  }

  repo = new PostgreRepository(sequelize, modelName);

  after(() => {
    sequelize.close();
  });

  describe('generic assertions', () => {
    const client = {
      name: 'foo'
    };
    const bag = {
      client
    };
    Assertions.assertions.forEach(x => {
      it(x.assertion, done => {
        x.method(repo, bag)(done);
      });
    });
  });
  
});
