const { Pool } = require("pg");


const pool = new Pool({

    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    }

});



async function initDatabase() {

    await pool.query(`

        CREATE TABLE IF NOT EXISTS dishes (

            id SERIAL PRIMARY KEY,

            name TEXT NOT NULL,

            category TEXT NOT NULL,

            preparation TEXT,

            country TEXT,

            description TEXT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

        )

    `);


    console.log("PostgreSQL Datenbank bereit.");

}



initDatabase();



module.exports = pool;