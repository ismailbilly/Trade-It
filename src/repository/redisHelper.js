const { redisClient } = require("../config/redis"); // Import your Redis client creation function

const setValue = ( key, value, ttl)=> {
  redisClient.set(key, value);
  
}

function getValue(redisClient, key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

function deleteValue(redisClient, key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

function incrementValue(redisClient, key) {
  return new Promise((resolve, reject) => {
    redisClient.incr(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}

function ttl(redisClient, key) {
  return new Promise((resolve, reject) => {
    redisClient.ttl(key, (err, reply) => {
      if (err) {
        reject(err);
      } else {
        resolve(reply);
      }
    });
  });
}


module.exports = {
    setValue,
    getValue,
    deleteValue,
    incrementValue,
    ttl
};