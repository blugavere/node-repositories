
'use strict';

const expect = require('expect');
const Serializer = require('./JSONSerializer');

// ./node_modules/.bin/nyc mocha packages/fs-repository/Serializers/JSONSerializer.test.js

describe('JSON Serializer', () => {
  const serializer = new Serializer();
  const cat = { name: 'Fido' };
  const expected = '{\n "name": "Fido"\n}';

  it('should seralize', () => {
    expect(serializer.serialize(cat)).toBe(expected);
  });

  it('should deseralize', () => {
    expect(serializer.deserialize(expected)).toEqual(cat);
  });
});
