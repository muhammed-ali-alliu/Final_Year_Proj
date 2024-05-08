// models/Messages.js
const pool = require('../db');

async function saveMessage(sender_email, recipient_email, content) {
    const query = 'INSERT INTO messages (sender_email, recipient_email, content) VALUES ($1, $2, $3)';
    const values = [sender_email, recipient_email, content];
    try {
        await pool.query(query, values);
        console.log('Message saved successfully');
    } catch (error) {
        console.error('Error saving message:', error);
        throw error;
    }
}

async function getMessages(sender_email, recipient_email) {
    const query = `
        SELECT * 
        FROM messages 
        WHERE (sender_email = $1 AND recipient_email = $2) OR (sender_email = $2 AND recipient_email = $1)
        ORDER BY timestamp`;
    const values = [sender_email, recipient_email];
    try {
        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

async function getCustomerMessages() {
    const query = `
        SELECT DISTINCT sender_email AS email, 
        (SELECT firstname FROM users WHERE email = sender_email) AS first_name,
        (SELECT lastname FROM users WHERE email = sender_email) AS last_name
        FROM messages`;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching customer messages:', error);
        throw error;
    }
}

module.exports = { saveMessage, getMessages, getCustomerMessages };
