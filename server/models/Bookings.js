const pool = require('../db');

async function createBookingsTable() {
    const query = 
    `
    CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    customer_email VARCHAR(255),
    service_provider_email VARCHAR(255),
    date DATE,
    time TIME,
    notes TEXT,
    status VARCHAR(50),
    hours_worked INTEGER,
    service_charge DECIMAL(10, 2),
    total_charge DECIMAL(10, 2),
    CONSTRAINT fk_customer_email FOREIGN KEY (customer_email) REFERENCES users(email),
    CONSTRAINT fk_service_provider_email FOREIGN KEY (service_provider_email) REFERENCES service_provider(email)
    )
    `;
    try {
        await pool.query(query);
        console.log("Bookings table created successfully");
    } catch (error) {
        console.error("Error creating Bookings table:", error);
    }
}

module.exports = { createBookingsTable };