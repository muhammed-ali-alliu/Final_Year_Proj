const pool = require('../db');

async function createCustomerDetailsTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS customer_details(
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL REFERENCES users(email),
            street_address VARCHAR(255),
            city VARCHAR(100),
            state VARCHAR(100),
            postal_code VARCHAR(20)
        );
    `;
    try {
        await pool.query(query);
        console.log("Customer details table created successfully");
    } catch (error) {
        console.error("Error creating Customer details table:", error);
    }
}



// Function to update customer details
async function updateCustomerDetails(email, dataToUpdate) {
    const { streetAddress, city, state, postalCode } = dataToUpdate;
    try {
        await pool.query('UPDATE customer_details SET street_address = $1, city = $2, state = $3, postal_code = $4 WHERE email = $5', [streetAddress, city, state, postalCode, email]);
        console.log("Customer details updated successfully");
    } catch (error) {
        console.error('Error updating customer details:', error);
        throw error;
    }
}

// Function to fetch customer details by email
async function getCustomerDetailsByEmail(email) {
    try {
        const result = await pool.query('SELECT street_address, city, state, postal_code FROM customer_details WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            throw new Error('Customer details not found');
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching customer details:', error);
        throw error;
    }
}


module.exports = { createCustomerDetailsTable, updateCustomerDetails, getCustomerDetailsByEmail };