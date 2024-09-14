module.exports = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  dialect: "mysql",
  dialectOptions: {
    connectTimeout: 60000,
  },
  POOL: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  retry: {
    max: 3,
  },
};
