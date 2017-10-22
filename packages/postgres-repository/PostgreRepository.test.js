
'use strict';

const PostgreRepository = require('./PostgreRepository');
const Sequelize = require('sequelize');
const Assertions = require('../../test/assertions');

const modelName = 'clients';

const schema = {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
};

describe('Postgre Repository', () => {

  const sequelize = new Sequelize('travis', 'admin', 'admin', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
  });

  if (!sequelize.isDefined(modelName)) {
    sequelize.define(modelName, schema);
  }

  const repo = new PostgreRepository(sequelize, modelName);

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
