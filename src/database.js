const mysql = require('promise-mysql');

let pool;

async function getConnection() {
    if (!pool) {
        // Create a connection pool with the specified configuration
        pool = await mysql.createPool({
            connectionLimit: 10, // Adjust the limit based on your application's needs
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'electron'
        });
    }

    try {
        // Get a connection from the pool
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error while getting a database connection:', error);
        throw error;
    }
}

module.exports = { getConnection };