const { log } = require("handlebars");
const { redisClient } = require("../config/redis"); // Import your Redis client creation function

const { promisify } = require('util');

// Create a Redis client
//const client = redis.createClient();

// Promisify the set and get methods
const setAsync = promisify(redisClient.set).bind(redisClient);
const getAsync = promisify(redisClient.get).bind(redisClient);

// Export promise-based versions of set and get
module.exports = {
  setAsync,
  getAsync,
};
// const setValue = (key, value, ttl) => {
//   return new Promise((resolve, reject) => {
//     redisClient.set(key, value, ttl, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(reply);
//       }
//     });
//   });
// };

// function getValue(redisClient, key) {
//   return new Promise((resolve, reject) => {
//     redisClient.get(key, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(reply);
//       }
//     });
//   });
// }

// function deleteValue(redisClient, key) {
//   return new Promise((resolve, reject) => {
//     redisClient.del(key, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(reply);
//       }
//     });
//   });
// }

// function incrementValue(redisClient, key) {
//   return new Promise((resolve, reject) => {
//     redisClient.incr(key, (err, reply) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(reply);
//       }
//     });
//   });
// }

// // function ttl(redisClient, key) {
// //   return new Promise((resolve, reject) => {
// //     redisClient.ttl(key, (err, reply) => {
// //       if (err) {
// //         reject(err);
// //       } else {
// //         resolve(reply);
// //       }
// //     });
// //   });
// // }

// module.exports = {
//   setValue,
//   getValue,
//   deleteValue,
//   incrementValue,
// };
