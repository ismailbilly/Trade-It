const DbConnection = require("../config/database");

const find = async (collection) => {
  const Database = DbConnection.getDb();
  const coll = Database.collection(collection);
  const data = await coll.find({}).toArray();
  return data;
};
const findOne = async (collection, item) => {
  const Database = DbConnection.getDb();
  const coll = Database.collection(collection);
  const data = await coll.findOne(item);
  return data;
};

const findQuery = async (collection, query) => {
  const Database = DbConnection.getDb();
  const coll = Database.collection(collection);
  const data = await coll.find(query).toArray();
  return data;
};

const insertMany = async (collection, data) => {
  const Database = DbConnection.getDb();
  const coll = Database.collection(collection);
  const insert_details = await coll.insertMany(data);
  return insert_details;
};

const insertOne = async (collection, data) => {
  const Database = DbConnection.getDb();
  const coll = Database.collection(collection);
  const insert_details = await coll.insertOne(data);
  return insert_details;
};

const updateOne = async (collection,query, data) => {
  //todos
   const Database = DbConnection.getDb();
   const coll = Database.collection(collection);
   const insert_details = await coll.updateOne(query, {
     $set: data,
    
   });
   return insert_details;
};
const updateMany = async (collection, item, data) => {
  //todos
  const Database = DbConnection.getDb();
  const coll = Database.collection(collection);
  const insert_details = await coll.updateMany(item, {
    $set: data,
    $currentDate: { updatedAt: true },
  });
  return insert_details;
};

module.exports = {
  find,
  findOne,
  findQuery,
  insertMany,
  insertOne,
  updateOne,
  updateMany,
};
