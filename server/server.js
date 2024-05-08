const PORT = process.env.PORT ?? 8000;
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const pool = require('./db');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')
const {saveMessage, getMessages, getCustomerMessages} = require('./models/Messages')
const { createContactTable, insertContact } = require('./models/Contact');


const {createCustomerDetailsTable, updateCustomerDetails, getCustomerDetailsByEmail} = require('./models/Customer_Details')
const { getUserByEmail, createUser } = require('./models/Users');
const {getServiceProviders} = require('./models/ServiceProvider')
const {getAllServiceProviders} = require('./models/ServiceProvider')
const User = require('./models/Users')

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const stripe = require('stripe')
('sk_test_51P7H89B9yZduzV1JgK9R8L8lwQ0u0fdd0zrHx1e2LNCFeGFzyNphfYSCc2h6E4f9q48Kh94UInA4N5FlZMpQku4S00jdYZ9iFI')

app.use(express.json());
app.use(cors());

function startServer(port) {
    return new Promise((resolve, reject) => {
      server.listen(port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`Server running on PORT ${port}`);
          resolve(server);
        }
      });
    });
  }

  function closeServer() {
    return new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Server closed');
          resolve();
        }
      });
    });
  }

wss.on('connection', (ws) => {
  console.log('A client connected');
  
  ws.on('message', (message) => {
    console.log('Received message:', message);
    
    // Process the message and send a response if needed
    ws.send('Message received!');
  });
  
  ws.on('close', () => {
    console.log('A client disconnected');
  });
});

app.use(express.json());


app.use(cors())


// Middleware to verify JWT tokens
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            message: 'No token provided'
        });
    }

    jwt.verify(token, 'strong_random_secret', (err, decoded) => {
        if (err) {
            return res.status(403).json({
                message: 'Failed to authenticate token'
            });
        }

        req.user = decoded;
        next();
    });
}


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'damilolaalliu101@gmail.com',
        pass: 'ueie uobu jnsy djox'
    }
})

async function sendEmail(email, subject, text) {
    try {
        // Send mail with defined transport object
        await transporter.sendMail({
            from: 'damilolaalliu101@gmail.com',
            to: email,
            subject: subject,
            text: text
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

async function sendInvoiceEmail(customerEmail, serviceCharge, totalCharge, paymentLink) {
    try {
        // Content of the email
        const mailOptions = {
            from: 'damilolaalliu101@gmail.com',
            to: customerEmail,
            subject: 'Invoice for your booking',
            html: `
                <p>Dear Customer,</p>
                <p>Please find below the details of your invoice:</p>
                <p>Service Charge: $${serviceCharge}</p>
                <p>Total Charge: $${totalCharge}(A charge of 20 is added to the service charge)</p>
                <p>Please click the following link to proceed with the payment:</p>
                <a href="${paymentLink}">Pay Now</a>
                <p>Thank you for choosing our service!</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Invoice email sent successfully');
    } catch (error) {
        console.error('Error sending invoice email:', error);
    }
}




app.get('/test', (req, res) => {
    res.send('Hello Ali!')
})


//get all users
app.get('/users', async (req, res) => {
    //console.log(req)
    // const { userEmail } = req.params

    try {
        const users = await pool.query('SELECT * FROM users')
        res.json(users.rows)
    } catch (error) {
        console.log(error)
        
    }
})

app.get('/users/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user.rows[0]); // Return the first (and only) user found
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user from the database based on email
        const user = await User.getUserByEmail(email);

        if (!user || user.password !== password) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        // console.log('User email:', user.email)
        // console.log('User role:', user.role)
        // console.log('User firstname:', user.firstname)
        // console.log('User lastname:', user.lastname)
        // console.log('User phonenumber:', user.phonenumber)

        const token = jwt.sign({
            email: user.email, 
            role: user.role, 
            firstname: user.firstname, 
            lastname: user.lastname,
            phonenumber: user.phonenumber
        }, 

            'strong_random_secret', { expiresIn: '1h' });

        // Return user role and token if login is successful
        res.json({ role: user.role, token, firstname: user.firstname, lastname: user.lastname, email: user.email, phonenumber: user.phonenumber });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// POST endpoint for user signup
app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, role, password, phonenumber } = req.body;

        // Check if user with the same email already exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Check if the role is valid ('customer' or 'service-provider')
        if (role !== 'customer' && role !== 'service-provider') {
            return res.status(400).json({ error: 'Invalid role.' });
        }

        // Create new user if email doesn't exist and role is valid
        const newUser = await createUser({ firstname, lastname, email, role, password, phonenumber });

        // Respond with user creation details
        res.status(201).json(newUser);

        // Insert into the appropriate table based on the role
        if (role === 'customer') {
            await insertCustomerDetails(email);
        } else if (role === 'service-provider') {
            await insertServiceProvider(email);
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Function to insert user's email into customer_details table
async function insertCustomerDetails(email) {
    try {
        const query = 'INSERT INTO customer_details (email) VALUES ($1)';
        await pool.query(query, [email]);
        console.log('User email inserted into customer_details table');
    } catch (error) {
        console.error('Error inserting user email into customer_details table:', error);
        throw error;
    }
}

// Function to insert user's email into service_provider table
async function insertServiceProvider(email) {
    try {
        const query = 'INSERT INTO service_provider (email) VALUES ($1)';
        await pool.query(query, [email]);
        console.log('User email inserted into service_provider table');
    } catch (error) {
        console.error('Error inserting user email into service_provider table:', error);
        throw error;
    }
}


app.get('/users/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// app.get('/api/service-providers', async (req, res) => {
//     try {
//         console.log("Request object:", req);
//         const { query } = req.query; // Retrieve the query parameter
//         console.log("Received search query:", query); // Log the received search query

//         // Fetch service providers based on the search query
//         const serviceProviders = await getServiceProviders(query);
//         console.log("Fetched service providers:", serviceProviders); // Log the fetched service providers

//         // Send the fetched service providers as the response
//         res.json(serviceProviders);
//     } catch (error) {
//         console.error("Error fetching service providers:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


app.get('/service-providers', async (req, res) => {
    try {
        // Fetch all service providers
        const serviceProviders = await getAllServiceProviders();
        res.json(serviceProviders);
        //console.log(serviceProviders)
    } catch (error) {
        console.error("Error fetching service providers:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/service-providers/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const serviceProvider = await pool.query('SELECT * FROM service_provider WHERE email = $1', [email]);
        if (serviceProvider.rows.length === 0) {
            return res.status(404).json({ error: 'Service provider not found' });
        }
        res.json(serviceProvider.rows[0]); // Return the first (and only) service provider found
    } catch (error) {
        console.error("Error fetching service provider by email:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.put('/service-providers/:email', async (req, res) => {
    const { email } = req.params;
    const { profilePhoto, location, services, hourlyRate, bio } = req.body;

    try {
        // Update the service provider's bio in the database
        const result = await pool.query(
            'UPDATE service_provider SET profile_photo = $1, location = $2, provided_services = $3, hourly_rate = $4, bio = $5 WHERE email = $6',
            [profilePhoto, location, services, hourlyRate, bio, email]
        );

        if (result.rowCount === 1) {
            res.status(200).json({ message: 'Service provider bio updated successfully' });
        } else {
            res.status(404).json({ error: 'Service provider not found' });
        }
    } catch (error) {
        console.error('Error updating service provider bio:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.post('/sp', async (req, res) => {
    const { email, role } = req.body;

    try {
        // Perform validation and user creation based on the role
        if (role === 'service-provider') {
            // If role is service-provider, insert the email into the service_provider table
            const serviceProviderResult = await pool.query(
                'INSERT INTO service_provider (email) VALUES ($1) RETURNING *',
                [email]
            );

            res.status(201).json({ success: true, message: 'Service provider profile created successfully', data: serviceProviderResult.rows[0] });
        } else {
            // Handle other roles (e.g., customer) if needed
            res.status(201).json({ success: true, message: 'User profile created successfully' });
        }
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ success: false, error: 'An error occurred while creating user profile' });
    }
});


app.post('/bookings', async (req, res) => {
    try {
        // Extract data from the request body
        const { customerEmail, serviceProviderEmail, date, time, notes, status } = req.body;
        
        // Create a new booking in the database
        const newBooking = await pool.query(
            'INSERT INTO bookings (customer_email, service_provider_email, date, time, notes, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [customerEmail, serviceProviderEmail, date, time, notes, status]
        );

        // Retrieve the email addresses of the customer and service provider
        const customer = await pool.query('SELECT email FROM users WHERE email = $1', [customerEmail]);
        const serviceProvider = await pool.query('SELECT email FROM service_provider WHERE email = $1', [serviceProviderEmail]);

        // Send email to customer
        const customerMessage = 'Your booking has been successful and is awaiting confirmation from the service provider.';
        await sendEmail(customerEmail, 'Booking Successful', customerMessage);

        // Send email to service provider
        const serviceProviderMessage = `You have been booked for a service.
        Please log in to your account to make a decision as quickly as possible.`;
        await sendEmail(serviceProviderEmail, 'New Booking', serviceProviderMessage);

        // Return the newly created booking
        res.status(201).json(newBooking.rows[0]);
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'An unexpected error occurred' });
    }
});


// Endpoint to get bookings by specific email
app.get('/bookings/service-provider/:email', async (req, res) => {
    const { email } = req.params;
    //console.log(email)

    try {
        // Query the database to get bookings for the specific email
        const bookings = await pool.query('SELECT * FROM bookings WHERE service_provider_email = $1', [email]);

        // Return the bookings
        res.json(bookings.rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/bookings/customer_email/:email', async (req, res) => {
    const { email } = req.params;
    console.log(email)

    try {
        // Query the database to get bookings for the specific email
        const bookings = await pool.query('SELECT * FROM bookings WHERE customer_email = $1', [email]);

        // Return the bookings
        res.json(bookings.rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// PUT endpoint to accept or decline a booking
app.put('/bookings/:id', async (req, res) => {
    const { id } = req.params;
    const { status, declineReason, hoursWorked, email } = req.body;

    try {
        let query;
        let values;

        if (status === 'Job Accepted') {
            // Logic for accepting the booking
            query = 'UPDATE bookings SET status = $1 WHERE id = $2';
            values = [status, id];
        } else if (status === 'Job Declined') {
            // Logic for declining the booking
            query = 'UPDATE bookings SET status = $1, decline_reason = $2 WHERE id = $3';
            values = [status, declineReason, id];
        } else if (status === 'Job Completed') {
            // Logic for completing the job
            const serviceProviderData = await pool.query('SELECT * FROM service_provider WHERE email = $1', [email]);
            const hourlyRate = serviceProviderData.rows[0].hourly_rate;
            const serviceCharge = hourlyRate * hoursWorked;
            const totalCharge = serviceCharge * 1.2; // Assuming a 20% additional charge

            // Create Payment Intent with Stripe
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalCharge * 100, // Convert totalCharge to cents
                currency: 'gbp', // Change currency as needed
                description: 'Payment for service', // Description of the payment
                // Add any additional parameters as needed
            });

            // Update booking status and payment details
            query = 'UPDATE bookings SET status = $1, hours_worked = $2, service_charge = $3, total_charge = $4 WHERE id = $5';
            values = [status, hoursWorked, serviceCharge, totalCharge, id];

            // Send email to customer with invoice breakdown and payment link
            const booking = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
            const customerEmail = booking.rows[0].customer_email;

            // Construct payment link using paymentIntent.id
            const paymentLink = `http://localhost:5173/checkout?paymentIntentId=${paymentIntent.id}`;
            await sendInvoiceEmail(customerEmail, serviceCharge, totalCharge, paymentLink);
        } else {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Execute the database query with the prepared query and values
        await pool.query(query, values);

        res.status(200).json({ message: 'Booking updated successfully' });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});





// Handle sending messages
app.post('/messages', async (req, res) => {
    const { senderemail, email, content } = req.body;
    try {
        await saveMessage(senderemail, email, content);
        res.sendStatus(200);
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Failed to save message" });
    }
});

// Handle fetching messages
app.get('/messages', async (req, res) => {
    const { sender_email, email } = req.query;
    try {
        const messages = await getMessages(sender_email, email);
        // console.log(sender_email)
        // console.log(email)
        res.json(messages); 
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

app.get('/messages/customers', async (req, res) => {
    try {
        const customerMessages = await getCustomerMessages();
        res.json(customerMessages);
    } catch (error) {
        console.error("Error fetching customer messages:", error);
        res.status(500).json({ error: "Failed to fetch customer messages" });
    }
});



// PUT endpoint to update customer details
app.put('/customer-details/:email', async (req, res) => {
    const { email } = req.params;
    const { streetAddress, city, state, postalCode } = req.body;

    try {
        await updateCustomerDetails(email, { streetAddress, city, state, postalCode });
        res.status(200).json({ message: 'Customer details updated successfully' });
    } catch (error) {
        console.error('Error updating customer details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET endpoint to fetch customer details
app.get('/customer-details/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const customerDetails = await getCustomerDetailsByEmail(email);
        res.status(200).json(customerDetails);
    } catch (error) {
        if (error.message === 'Customer details not found') {
            res.status(404).json({ error: 'Customer details not found' });
        } else {
            console.error('Error fetching customer details:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});


app.get('/reviews/serviceProvider/:serviceProviderEmail', async (req, res) => {
    const { serviceProviderEmail } = req.params;
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM reviews WHERE reviews = $1', [serviceProviderEmail]);
        const reviews = result.rows;
        client.release(); 
        res.json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/reviews/serviceProvider/:serviceProviderEmail', async (req, res) => {
    const { serviceProviderEmail } = req.params;
    const {
        rating,
        serviceType,
        quality,
        professionalism,
        timeliness,
        comments,
        customerEmail,
        jobId
    } = req.body;

    try {
        const client = await pool.connect();
        const queryText = `
            INSERT INTO reviews (rating, serviceType, quality, professionalism, timeliness, comments, customerEmail, jobId, serviceProviderEmail)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `;
        const values = [
            rating,
            serviceType,
            quality,
            professionalism,
            timeliness,
            comments,
            customerEmail,
            jobId,
            serviceProviderEmail
        ];

        await client.query(queryText, values);
        client.release();

        res.status(201).send('Review submitted successfully');
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Failed to submit review');
    }
});


async function sendResponseEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'damilolaalliu101@gmail.com', 
            pass: 'ueie uobu jnsy djox' 
        }
    });

    const mailOptions = {
        from: 'damilolaalliu101@gmail.com', 
        to: email,
        subject: 'Message Received',
        text: 'Thank you for contacting us! We received your message and will be in touch within 2-3 working days. From TaskCraft'
    };

    await transporter.sendMail(mailOptions);
    console.log('Response email sent successfully');
}



app.post('/contacts', async (req, res) => {
    const { fullName, email, message } = req.body;

    try {
        // Insert the contact data into the database
        await insertContact(fullName, email, message);

        // Send email to the provided email address
        await sendResponseEmail(email);

        res.status(201).json({ message: 'Contact data inserted successfully and response email sent' });
    } catch (error) {
        console.error('Error handling form submission:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});



app.get('/protected', verifyToken, (req, res) => {
    res.json(req.user);
})


app.listen(PORT, ()=> console.log(`Server running on PORT ${PORT}`))

module.exports = {app, startServer, closeServer};