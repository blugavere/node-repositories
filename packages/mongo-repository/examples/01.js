
'use strict';

const util = require('util');
const MongoClient = require('mongodb').MongoClient;
const MongoRepository = require('../lib');

/**
 * node examples/01.js
 */

const connStr = 'mongodb://localhost/test';

const collection = 'clients';

(async () => {
  const connection = await MongoClient.connect(connStr);
  const repo = new MongoRepository(connection, collection);
  const result = await util.promisify(repo.findAll)();
  console.log(result);
  process.exit();
})();
