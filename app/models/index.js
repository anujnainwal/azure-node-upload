const Sequelize = require("sequelize");
const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  HOST,
  PORT,
  POOL,
} = require("../config/dbConfig");
const DocumentsModel = require("./documents");

/**
 * @type {Sequelize.Sequelize}
 */

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: HOST,
  port: PORT,
  dialect: "mysql",
  pool: POOL,
  retry: {
    max: 3,
  },
});

let db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.documentsModel = DocumentsModel(sequelize, Sequelize);

module.exports = db;
