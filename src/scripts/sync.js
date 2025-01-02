
import dotenv from "dotenv";
import db from "../models/index.js";

dotenv.config({ path: ".env.local" });

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database connection has been established successfully.");
    await db.sequelize.sync({ force: false });
    console.log("All models were synchronized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
})();
