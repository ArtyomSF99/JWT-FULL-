const Pool = require('pg').Pool
const pool = new Pool({
  user: "postgres",
  password: "postgres",
  database: "score",
  port: 5432,
  host: "localhost",
  ssl: process.env.DATABASE_URL ? true : false
})

module.exports = pool