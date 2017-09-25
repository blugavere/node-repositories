# Repository Mixins
[![NPM version][npm-image]][npm-url]
![NPM Downloads][downloads-url]

## Installation 

```sh
$ npm install --save @repositories/mixins
```

## Usage

Note that this mixin uses promises and not callbacks.

```js

'use strict'

const InMemRepository = require('@repositories/inmem');
const mixins = require('@repositories/mixins');

class Cat {}

const factory = {
    reconstitute(data) {
        return Promise.resolve(Object.assign(new Cat(), data));
    }
};

const repo = mixins.domainify(new InMemRepository(), factory);

repo.add({ name: 'Tom' }).then(doc => {
  console.log(doc instanceof Cat); // true
});

```

## License

MIT © [Ben Lugavere](http://benlugavere.com/)

[npm-image]: https://img.shields.io/npm/v/@repositories/mixins.svg
[npm-url]: https://npmjs.org/package/@repositories/mixins
[downloads-url]: https://img.shields.io/npm/dm/@repositories/mixins.svg?style=flat