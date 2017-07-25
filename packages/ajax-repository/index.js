'use strict';

const autoBind = require('auto-bind');
const axios = require('axios');

class AJAXRepository {
  constructor(urlRoot) {
    this.root = urlRoot;
    autoBind(this);
  }

  clear(cb) {
    cb && cb(null, true);
  }

  disconnect() {
    return Promise.resolve();
  }

  findAll(cb) {
    return axios.get(this.root).then(res => cb(null, res.data), err => cb(err));
  }

  findOne(id, cb) {
    return axios.get(`${this.root}/${id}`).then(res => cb(null, res.data), err => cb(err));
  }

  add(entity, cb) {
    return axios.post(this.root, entity).then(res => cb(null, res.data), err => cb(err));
  }

  /**
   * update
   */
  update(data, cb) {
    return axios.put(`${this.root}/${data._id}`, data).then(res => cb(null, res.data), err => cb(err));
  }

  /**
   * delete
   */
  remove(id, cb) {
    return axios.delete(`${this.root}/${id}`).then(res => cb(null, res.data), err => cb(err));
  }
}

module.exports = AJAXRepository;
