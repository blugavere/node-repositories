'use strict';
const IRepository = require('./IRepository');
const axios = require('axios');

class AJAXRepository extends IRepository {
  constructor(urlRoot) {
    super(...arguments);

    this.root = urlRoot;

    this.findAll = this.findAll.bind(this);
    this.findOne = this.findOne.bind(this);
    this.add = this.add.bind(this);
    this.update = this.update.bind(this);
    this.remove = this.remove.bind(this);
    this.clear = this.clear.bind(this);
    this.disconnect = this.disconnect.bind(this);
  }

  clear(cb) {
    cb && cb(null, true);
  }

  disconnect() {
    return Promise.resolve();
  }

  findAll(cb) {
    return axios.get(this.root).then(res => {
      return cb(null, res.data);
    }, err => {
      return cb(err);
    });
  }

  findOne(id, cb) {
    return axios.get(`${this.root}/${id}`).then(res => {
      return cb(null, res.data);
    }, err => {
      return cb(err);
    });
  }

  add(entity, cb) {
    return axios.post(this.root, entity).then(res => {
      return cb(null, res.data);
    }, err => {
      return cb(err);
    });
  }

  /**
   * update
   */
  update(data, cb) {
    return axios.put(`${this.root}/${data._id}`, data).then(res => {
      return cb(null, res.data);
    }, err => {
      return cb(err);
    });
  }

  /**
   * delete
   */
  remove(id, cb) {
    return axios.delete(`${this.root}/${id}`).then(res => {
      return cb(null, res.data);
    }, err => {
      return cb(err);
    });
  }
}

module.exports = AJAXRepository;