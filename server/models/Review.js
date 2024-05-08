const pool = require('../db');

async function createReviewTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
    rating INTEGER NOT NULL,
    serviceType VARCHAR(255) NOT NULL,
    quality VARCHAR(255) NOT NULL,
    professionalism VARCHAR(255) NOT NULL,
    timeliness VARCHAR(255) NOT NULL,
    comments TEXT NOT NULL,
    customerEmail VARCHAR(255) NOT NULL,
    jobId VARCHAR(255) NOT NULL,
    serviceProviderEmail VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

    try {
        await pool.query(query);
        console.log("review table created successfully");
    } catch (error) {
        console.error("Error creating review table:", error);
    }
}

module.exports = { createReviewTable };