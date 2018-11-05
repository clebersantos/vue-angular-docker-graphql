var env = process.env.NODE_ENV || 'development',
    config = require('./config')[env],
    mongoose = require('mongoose');

const promiseRetry = require('promise-retry')

const options = {
  useNewUrlParser: true,
  reconnectTries: 60,
  reconnectInterval: 1000,
  poolSize: 10,
  bufferMaxEntries: 0 // If not connected, return errors immediately rather than waiting for reconnect
}

const promiseRetryOptions = {
  retries: options.reconnectTries,
  factor: 2,
  minTimeout: options.reconnectInterval,
  maxTimeout: 5000
}

const connect = () => {
  return promiseRetry((retry, number) => {
    console.log(`MongoClient connecting to ${config.db} - retry number: ${number}`)
    return mongoose.connect(config.db, options).then(
        () => { console.log('MongoClient connected') },
    ).catch(retry);
    
  }, promiseRetryOptions)
}

module.exports = connect