import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js"; // Make sure to add the .js extension

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env];

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
        logging: false,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Use import to load the model
import User from "./user.js"; // Make sure to add the .js extension

db.user = User(sequelize, DataTypes);

db.sequelize.sync({ force: false }).then(() => {
    console.log("Drop and re-sync db.");
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

export default db;
