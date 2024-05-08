const pool = require('../db');

// Function to create the contact table
async function createContactTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS contacts(
            id SERIAL PRIMARY KEY,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            message TEXT
        );
    `;
    try {
        await pool.query(query);
        console.log("Contact table created successfully");
    } catch (error) {
        console.error("Error creating contact table:", error);
        throw error;
    }
}

// Function to insert contact data
async function insertContact(fullName, email, message) {
    const query = 'INSERT INTO contacts (full_name, email, message) VALUES ($1, $2, $3)';
    try {
        await pool.query(query, [fullName, email, message]);
        console.log("Contact data inserted successfully");
    } catch (error) {
        console.error('Error inserting contact data:', error);
        throw error;
    }
}

// Exporting functions
module.exports = { createContactTable, insertContact };
