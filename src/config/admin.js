const { default: AdminBro } = require('admin-bro');
const AdminBroMongoose = require('admin-bro-mongoose');

AdminBro.registerAdapter(AdminBroMongoose);

// const AdminDeliver = require('../model/deliver')

/** @type {import('admin-bro').AdminBroOptions} */


const options = {
  resources: [
  ],
};

module.exports = options;
