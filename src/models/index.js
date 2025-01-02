import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";
import User from "./user.js";
import Post from "./post.js";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize({
  host: dbConfig.host,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  dialect: "mysql",
  port: dbConfig.port,
  dialectModule: require("mysql2"),
  logging: false, 
});

const db = {
  Sequelize,
  sequelize,
  User: User(sequelize, DataTypes),
  Post: Post(sequelize, DataTypes),
};


if (env === "development") {
  sequelize
    .sync({ force: false })
    .then(() => console.log("Database synchronized successfully."))
    .catch((error) => console.error("Error syncing database:", error));
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default db;
