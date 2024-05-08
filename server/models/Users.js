const pool = require('../db');

async function createUserTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            email VARCHAR(255) PRIMARY KEY,
            password VARCHAR(255) NOT NULL,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            phonenumber VARCHAR(255) NOT NULL,
            role VARCHAR(255) NOT NULL
        )
    `;
    try {
        await pool.query(query);
        console.log("User table created successfully");
    } catch (error) {
        console.error("Error creating user table:", error);
    }
}

async function getUserByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
        const result = await pool.query(query, [email]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function createUser(userDetails) {
    const { firstname, lastname, email, role, password, phonenumber } = userDetails;
    const query = `
        INSERT INTO users (firstname, lastname, email, role, password, phonenumber)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    try {
        const result = await pool.query(query, [firstname, lastname, email, role, password, phonenumber]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

async function getAllUsers(userDetails) {
    const { firstname, lastname, email, role, password, phonenumber } = userDetails;
    const query = `
    SELECT * FROM users
    `;
    try {
        const result = await pool.query(query, [firstname, lastname, email, role, password, phonenumber]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}
module.exports = { createUserTable, getUserByEmail, createUser, getAllUsers };