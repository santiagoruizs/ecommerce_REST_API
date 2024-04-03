const { Pool } = require('pg')
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

const query = (text, params, callback) => {
    return pool.query(text, params, callback)
  }

const emailExists = async (email) => {
    const data = await pool.query('SELECT * FROM users WHERE email = $1',[email])
    if (data.rowCount === 0){
        return false
    }else{
        return data.rows[0];
    }
}
module.exports = {query, emailExists}