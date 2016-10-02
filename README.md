# repositories [![NPM version][npm-image]][npm-url] [![Build Status](https://travis-ci.org/blugavere/node-repositories.svg?branch=master)](https://travis-ci.org/blugavere/node-repositories) [![dependencies Status](https://david-dm.org/blugavere/node-repositories/status.svg)](https://david-dm.org/blugavere/node-repositories) [![Coverage Status](https://coveralls.io/repos/github/blugavere/node-repositories/badge.svg?branch=master)](https://coveralls.io/github/blugavere/node-repositories?branch=master)[![Patreon](https://img.shields.io/badge/patreon-support%20the%20author-blue.svg)](https://www.patreon.com/blugavere)[![NPM Downloads](https://img.shields.io/npm/dm/repositories.svg?style=flat)](https://www.npmjs.com/package/repositories)

## Installation 

```sh
$ npm install --save repositories
```

## Usage

```js
const repositories = require('repositories');
```

## Redis
```js

const RedisRepository = require('repositories').RedisRepository;

const redisRepo = new RedisRepository('Cats');

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

## Contributing

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
