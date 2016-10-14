const expect = require('expect');
const PostgreRepository = require('./PostgreRepository');
const Repo = PostgreRepository;
const Sequelize = require('sequelize');
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
  let genericTests;
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
  genericTests = require('./GenericTests')(repo);
  repo.clear();

  after(() => {
    sequelize.close();
  });

  describe('Object construction', () => {
    it('should only create with the appropriate constructor', () => {
      let createRepo = () => new Repo();
      let createRepoGood = () => new Repo(sequelize, modelName);
      expect(createRepo).toThrow();
      expect(createRepoGood).toNotThrow();
    });
  });

  describe('interface', () => {
    genericTests.checkInterface();
  });

  describe('implementation', () => {
    genericTests.implementation();
  });
});
