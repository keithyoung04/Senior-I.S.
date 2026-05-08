const pkg = require("pg");
const dotenv = require("dotenv"); 
//import "dotenv/config";
const { Pool } = pkg;
//import "pg";
dotenv.config();

const pool = new Pool({
    host: process.env.HOST,
    port: process.env.DB_PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = {
    pool
}