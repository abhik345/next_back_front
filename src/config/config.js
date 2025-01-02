import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const config = {
  development: {
    username: "root",
    password: "",
    database: "blog_next",
    host: "localhost",
    port: "3306",
    dialect: "mysql",
  },

};

export default config;