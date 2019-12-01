# Repositories

Generic storage implementations following a common interface.

[![NPM version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![dependencies Status][daviddm-image]][daviddm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![lerna][lerna-image]][learna-url]

## Installation 

```sh
$ npm install --save repositories
```

## Overview

Available Repositories:
- [Google Firebase Repository](./packages/firebase-repository)
- [Google Cloud Firestore Repository](./packages/firestore-repository)
- [Redis Repository](./packages/redis-repository)
- [In-Memory Repository](./packages/inmem-repository)
- [AJAX Repository](#ajax)
- [PostgreSQL](#postgresql)
- [Cassandra](#cassandra)
- [Filesystem](#filesystem-repository)
- [Mongoose](#mongoose-repository)
- [MongoDB Native](#mongodb-native-repository)

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

See detailed readme [here.](./packages/redis-repository/README.md)

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
const INISerializer = require('repositories/src/serializers/INISerializer');
repo.use(new INISerializer());

// ...

```

## Mongoose Repository

See detailed readme [here.](./packages/mongoose-repository/README.md)

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

## In-Memory Repository

See readme [here.](./packages/inmem-repository/README.md)

## Contributing

Make sure the tests pass :D

## License

MIT © [Ben Lugavere]()


[npm-image]: https://badge.fury.io/js/repositories.svg
[npm-url]: https://npmjs.org/package/repositories
[downloads-url]: https://www.npmjs.com/package/repositories
[downloads-image]: https://img.shields.io/npm/dm/repositories.svg?style=flat
[travis-image]: https://travis-ci.org/blugavere/node-repositories.svg?branch=master
[travis-url]: https://travis-ci.org/blugavere/node-repositories
[daviddm-image]: https://david-dm.org/blugavere/node-repositories.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/node-repositories
[coveralls-image]: https://coveralls.io/repos/blugavere/node-repositories/badge.svg
[coveralls-url]: https://coveralls.io/r/blugavere/node-repositories

[lerna-image]: https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg
[learna-url]: https://lernajs.io/
