# Redis Repository
[![NPM version][npm-image]][npm-url]
[![dependencies Status][daviddm-image]][daviddm-url]
[![NPM Downloads][downloads-url]][downloads-link]

## Installation 

```sh
$ npm install --save @repositories/redis
```

## Usage

```js

'use strict';

const redis = require('redis');
const RedisRepository = require('@repositories/redis');

class TodoRepository extends RedisRepository {
  constructor(redis){
    super(redis, 'todos');
  }
  // custom implementations
}

// or if you dont need custom functionality

const repo = new RedisRepository(redis, 'todos');

repo.add({ name: 'Tom' }, (err, doc) => {
  console.log(doc);
});
 
// expire after 5 seconds
repo.add({ name: 'Tom' }, { expire: 5 }, (err, doc) => {
  console.log(doc);
});

```

[npm-image]: https://img.shields.io/npm/v/@repositories/inmem.svg
[npm-url]: https://npmjs.org/package/@repositories/redis
[daviddm-image]: https://david-dm.org/blugavere/@repositories/redis.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/blugavere/@repositories/redis
[downloads-url]: https://img.shields.io/npm/dm/@repositories/redis.svg?style=flat
[downloads-link]: https://www.npmjs.com/package/@repositories/redis
