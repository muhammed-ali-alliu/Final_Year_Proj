const pool = require('../db');

async function createServiceProviderTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS service_provider (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) REFERENCES users(email),
        profile_photo VARCHAR(255),
        location VARCHAR(255),
        provided_services TEXT[],
        hourly_rate INTEGER,
        bio TEXT
    )
    `;

    try {
        await pool.query(query);
        console.log("Service Provider table created successfully");
    } catch (error) {
        console.error("Error creating service provider table:", error);
    }
}

async function getServiceProviders(query) {
    try {
        // Query the database to find service providers based on the search query
        const result = await pool.query(
            `SELECT * FROM service_provider 
            WHERE 
                EXISTS (
                    SELECT 1 FROM unnest(provided_services) AS service 
                    WHERE LOWER(service) LIKE LOWER($1)
                )
                OR LOWER(location) LIKE LOWER($2);
            
            `,
            [query.toLowerCase(), `%${query.toLowerCase()}%`]
        );

        // Return the fetched service providers
        return result.rows;
    } catch (error) {
        console.error("Error fetching service providers:", error);
        throw error;
    }
}


async function getAllServiceProviders() {
    try {
        // Query the database to fetch all service providers
        const result = await pool.query(
            `SELECT * FROM service_provider`
        );

        // Return the fetched service providers
        return result.rows;
    } catch (error) {
        console.error("Error fetching all service providers:", error);
        throw error;
    }
}

module.exports = { createServiceProviderTable, getServiceProviders, getAllServiceProviders };