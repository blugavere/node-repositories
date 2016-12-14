# repositories [![NPM version][npm-image]][npm-url][![dependencies Status](https://david-dm.org/blugavere/node-repositories/status.svg)](https://david-dm.org/blugavere/node-repositories) [![Coverage Status](https://coveralls.io/repos/github/blugavere/node-repositories/badge.svg?branch=master)](https://coveralls.io/github/blugavere/node-repositories?branch=master)[![NPM Downloads](https://img.shields.io/npm/dm/repositories.svg?style=flat)](https://www.npmjs.com/package/repositories)[![Build Status](https://travis-ci.org/blugavere/node-repositories.svg?branch=master)](https://travis-ci.org/blugavere/node-repositories)[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/blugavere)

## Installation 

```sh
$ npm install --save repositories
```

## Usage

```js
const repositories = require('repositories');
```

## AJAX

Store some data on a remote server implementing a RESTful API.

```js
const AJAXRepository = require('repositories').AJAXRepository;
const ajaxRepo = new AJAXRepository('http://localhost:3000/api/cats');

ajaxRepo.add({name:'Fido'}, (err, data) => {
  console.log(data);
});

```

## Redis
```js

const redis = require('redis');
const RedisRepository = require('repositories').RedisRepository;

const redisRepo = new RedisRepository(redis, 'Cats');

redisRepo.add({name:'Fido'}, (err, data) => {
  console.log(data);
  redisRepo.disconnect();
});

```

## Sequelize (PostgreSQL)

```js

/** requires you to install sequelize and pg */
const PostgreRepository = require('repositories').PostgreRepository;
const Sequelize = require('sequelize');

sequelize = new Sequelize('test', 'admin', 'admin', {
  host: 'localhost',
  dialect: 'postgres'
});

const modelName = 'clients';

var schema = sequelize.define(modelName, {
  _id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: Sequelize.STRING
});

const sequelizeRepo = new PostgreRepository(sequelize, modelName);

sequelizeRepo.add({name:'Fido'}, (err, data) => {
  console.log(data);
});

sequelizeRepo.findAll((err, data) => {
  console.log(data);
  sequelizeRepo.disconnect();
});

```

## Cassandra
```js

const CassandraRepository = require('repositories').CassandraRepository;
const Cassandra = require('express-cassandra');

const cassandra = Cassandra.createClient({
  clientOptions: {
    contactPoints: ['127.0.0.1'],
    protocolOptions: { port: 9042 },
    keyspace: 'mykeyspace',
    queryOptions: { consistency: Cassandra.consistencies.one }
  },
  ormOptions: {
    defaultReplicationStrategy: {
      class: 'SimpleStrategy',
      replication_factor: 1
    },
    migration: 'safe',
    createKeyspace: true
  }
});

export const modelName = 'Cats';
export const schema = {
  fields: {
    _id: 'text',
    name: 'text'
  },
  key: ['_id']
};

let cassandraRepo;
cassandra.connect(() => {
  cassandra.loadSchema(modelName, schema);
  cassandraRepo = new CassandraRepository(cassandra, modelName);
  
  cassandraRepo.add({name:'Fido'}, (err, data) => {
    console.log(data);
    cassandraRepo.disconnect();
  });
});


```

## Filesystem Repository

Create a database out of a local file. Configurable for different file formats.

```js

const FSRepository = require('repositories').FSRepository;
const repo = new FSRepository('./data.json');

// default json format
const cat = { name : 'Fido' };

repo.add(cat, (err, data) => {
  console.log(data);
  repo.disconnect(); //not really
});

// ini istead of json
const INISerializer = require('repositories/lib/serializers/INISerializer');
repo.use(new INISerializer());

// ...

```

## Mongoose Repository

```js
const mongoose = require('mongoose');
const modelName = 'cats';
const schema = new mongoose.Schema({
  name: { type: String }
});
mongoose.model(modelName, schema);
mongoose.connect('mongodb://localhost');

const MongooseRepository = require('repositories').MongooseRepository;
const repo = new MongooseRepository(mongoose, modelName);

// default json format
const cat = { name : 'Fido' };

repo.add(cat, (err, data) => {
  console.log(data);
  repo.disconnect();
});

```

## MongoDB Native Repository

```js
const MongoClient = require('mongodb').MongoClient;
const collection = 'cats';
const MongoRepository = require('repositories').MongoRepository;

let repo;

MongoClient.connect('mongodb://admin:admin@localhost:27017/travis', (err, db) => {
  if (err) {
    // Handle error and return (or throw)
  }

  repo = new MongoRepository(db, collection);

  repo.add({name:'Fido'}, (err, data) => {
    console.log(data);
    repo.disconnect();
  });
}

```

## Contributing

Make sure the tests pass :D

## License

MIT © [Ben Lugavere]()


[npm-image]: https://badge.fury.io/js/repositories.svg
[npm-url]: https://npmjs.org/package/repositories
[travis-image]: https://travis-ci.org/blugavere/repositories.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/repositories
[daviddm-image]: https://david-dm.org/blugavere/repositories.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/repositories
[coveralls-image]: https://coveralls.io/repos/blugavere/repositories/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/repositories
