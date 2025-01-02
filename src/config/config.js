import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "blog_next",
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || "3306",
    dialect: "mysql",
  },

};

export default config;