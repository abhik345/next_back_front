import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";
import User from "./user.js";
import Post from "./post.js";
import State from "./state.js";
import City from "./city.js";

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
  State: State(sequelize, DataTypes),
  City: City(sequelize, DataTypes),
};

// Set up associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName]?.associate) {
    db[modelName].associate(db);
  }
});

db.sequelize.sync({ force: false }).then(() => {
  console.log("yes re-sync done!");
});



// Test the database connection


(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();


export default db;
