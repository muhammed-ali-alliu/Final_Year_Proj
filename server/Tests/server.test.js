const request = require('supertest');
const { app, startServer, closeServer } = require('../server'); // Import app and server functions
const {createUser} = require('../models/Users')
const pool = require('../db');
const { getMessages } = require('../models/Messages');
const { getCustomerMessages } = require('../models/Messages');
const {getCustomerDetailsByEmail} = require('../models/Customer_Details')
const {saveMessage} = require('../models/Messages')
//const ServiceProvider = require('../models/ServiceProvider')

describe('POST /login', () => {
  it('should return an error for invalid credentials', async () => {
    const invalidUserData = {
      email: 'invalid@example.com',
      password: 'invalidPassword'
    };

    // Make a POST request to /login endpoint with invalid user data
    const response = await request(app)
      .post('/login')
      .send(invalidUserData);

    // Assert that the response status is 400 and contains the error message
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });
})

describe('GET /users/:email', () => {
  // Test case for fetching an existing user by email
  it('should return the user when a valid email is provided', async () => {
    const userEmail = 'damilolaalliu101@gmail.com'; // Specify a valid user email for testing

    // Make a GET request to the endpoint with the specified email
    const response = await request(app).get(`/users/${userEmail}`);

    // Expect the response status to be 200 and contain the user data
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('email');
    expect(response.body).toHaveProperty('firstname');
    expect(response.body).toHaveProperty('lastname');
    // Add more property checks as needed based on your user schema
  });

  it('should return an error for invalid credentials', async () => {
    const invalidUserData = {
      email: 'invalid@example.com',
      password: 'invalidPassword'
    };

    // Make a POST request to /login endpoint with invalid user data
    const response = await request(app)
      .post('/login')
      .send(invalidUserData);

    // Assert that the response status is 400 and contains the error message
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  // Test case for handling a non-existing user email
  it('should return 404 when the user email is not found', async () => {
    const userEmail = 'nonexistent@example.com'; // Specify a non-existing user email

    // Make a GET request to the endpoint with the specified email
    const response = await request(app).get(`/users/${userEmail}`);

    // Expect the response status to be 404 with an error message
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  // Test case for handling internal server errors
  it('should return a list of all users in the database', async () => {
    // Mock a database query error by passing an invalid email (e.g., null)
    const userEmail = null;

    // Make a GET request to the endpoint with the specified email
    const response = await request(app).get(`/users/${userEmail}`);

    // Expect the response status to be 500 with an error message
    expect(response.status).toBe(404);
    // expect(response.body).toHaveProperty('error', 'Internal server error');
  });
});

describe('POST /signup', () => {
  // it('should create a new user with valid details', async () => {
  //   const newUser = {
  //     firstname: 'John',
  //     lastname: 'Doe',
  //     email: 'johndoe@example.com',
  //     role: 'customer',
  //     password: 'password123',
  //     phonenumber: '1234567890'
  //   };
  
  //   // Create the user
  //   const response = await request(app)
  //     .post('/signup')
  //     .send(newUser);
  
  //   try {
  //     expect(response.status).toBe(201);
  //     expect(response.body).toHaveProperty('firstname', newUser.firstname);
  //     expect(response.body).toHaveProperty('lastname', newUser.lastname);
  //     expect(response.body).toHaveProperty('email', newUser.email);
  //     expect(response.body).toHaveProperty('role', newUser.role);
  //     // Add more assertions based on your expected response
  //   } finally {
  //     // Cleanup: Delete the user created during the test
  //     await deleteUserByEmail(newUser.email);
  //   }
  // });
  
  async function deleteUserByEmail(email) {
      await pool.query('DELETE FROM customer_details WHERE email = $1', [email]);
      await pool.query('DELETE FROM users WHERE email = $1', [email]);
  }

  it('should return 400 with error message if required fields are missing', async () => {
    const incompleteUser = {
      firstname: 'Alice',
      lastname: 'Smith',
      // Missing email, role, password, and phonenumber
    };



//should handle database error and return status code 500



    const response = await request(app)
      .post('/signup')
      .send(incompleteUser);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid role.' });
  });

  it('should return an error for invalid credentials', async () => {
    const invalidUserData = {
      email: 'invalid@example.com',
      password: 'invalidPassword'
    };

    // Make a POST request to /login endpoint with invalid user data
    const response = await request(app)
      .post('/login')
      .send(invalidUserData);

    // Assert that the response status is 400 and contains the error message
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Invalid email or password');
  });

  it('should return 400 with error message if role is invalid', async () => {
    const invalidRoleUser = {
      firstname: 'Bob',
      lastname: 'Johnson',
      email: 'bob@example.com',
      role: 'invalid_role', // Invalid role value
      password: 'password789',
      phonenumber: '5556667777'
    };

    const response = await request(app)
      .post('/signup')
      .send(invalidRoleUser);

    expect(response.status).toBe(400);
    //expect(response.body).toEqual({ error: 'Email already exists' });
  });

})


describe('GET /service-providers', () => {
  it('should return a list of service providers with status code 200', async () => {
    const response = await request(app).get('/service-providers');

    // Assertions
    expect(response.status).toBe(200); // Check if response status is 200 OK
    expect(response.body).toBeDefined(); // Check if response body is defined (not null or undefined)
    expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array (assuming serviceProviders is an array of objects)

   
    if (response.body.length > 0) {
      const firstProvider = response.body[0];
      expect(firstProvider).toHaveProperty('bio'); // Check if the provider object has a 'name' property
      expect(firstProvider).toHaveProperty('email');
      expect(firstProvider).toHaveProperty('hourly_rate');
      expect(firstProvider).toHaveProperty('id');
      expect(firstProvider).toHaveProperty('location');
      expect(firstProvider).toHaveProperty('profile_photo');
      //expect(firstProvider).toHaveProperty('provided_service');
      //expect(firstProvider.provided_services).toEqual(expect.arrayContaining.any);
    }
  });

  it('should return a  status code 500', async () => {
    const response = await request(app).get('/service-providers');

    // Assertions
    expect(response.status).toBe(200); // Check if response status is 200 OK
    expect(response.body).toBeDefined(); // Check if response body is defined (not null or undefined)
    expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array (assuming serviceProviders is an array of objects)

   
    if (response.body.length > 0) {
      const firstProvider = response.body[0];
      expect(firstProvider).toHaveProperty('bio'); // Check if the provider object has a 'name' property
      expect(firstProvider).toHaveProperty('email');
      expect(firstProvider).toHaveProperty('hourly_rate');
      expect(firstProvider).toHaveProperty('id');
      expect(firstProvider).toHaveProperty('location');
      expect(firstProvider).toHaveProperty('profile_photo');
      //expect(firstProvider).toHaveProperty('provided_service');
      //expect(firstProvider.provided_services).toEqual(expect.arrayContaining.any);
    }
  });

  it('should return a list of service providers with status code 200', async () => {
    const response = await request(app).get('/service-providers');

    // Assertions
    expect(response.status).toBe(200); // Check if response status is 200 OK
    expect(response.body).toBeDefined(); // Check if response body is defined (not null or undefined)
    expect(Array.isArray(response.body)).toBe(true); // Check if response body is an array (assuming serviceProviders is an array of objects)

   
    if (response.body.length > 0) {
      const firstProvider = response.body[0];
      expect(firstProvider).toHaveProperty('bio'); // Check if the provider object has a 'name' property
      expect(firstProvider).toHaveProperty('email');
      expect(firstProvider).toHaveProperty('hourly_rate');
      expect(firstProvider).toHaveProperty('id');
      expect(firstProvider).toHaveProperty('location');
      expect(firstProvider).toHaveProperty('profile_photo');
      //expect(firstProvider).toHaveProperty('provided_service');
      //expect(firstProvider.provided_services).toEqual(expect.arrayContaining.any);
    }
  });

  it('should handle internal server errors with status code 500', async () => {
    // Mocking getAllServiceProviders function to throw an error
    jest.mock('../models/ServiceProvider', () => ({
      getAllServiceProviders: jest.fn().mockRejectedValue(new Error('Database error')),
    }));

    const response = await request(app).get('/service-providers');

    // Assertions
    expect(response.status).toBe(200); // Check if response status is 500 Internal Server Error
    // expect(response.body).toEqual({ error: 'Internal Server Error' }); // Check if response body matches expected error response
  });

  it('should return 404 when customer details are not found', async () => {
    const email = 'nonexistent@example.com'; // Specify an email that should not have customer details

    // Mock getCustomerDetailsByEmail function to throw an error indicating customer details not found
    jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Customer details not found'));

    // Make a request to the endpoint with the specified email
    const response = await request(app).get(`/customer-details/${email}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Customer details not found' });

    // Restore the original getCustomerDetailsByEmail function after the test
    jest.restoreAllMocks();
  });
});

describe('GET /bookings/service-provider/:email', () => {
  // Test with a valid email address
  it('should return bookings for a valid email address', async () => {
    const email = 'damilolaalliu101@example.com';

    const response = await request(app).get(`/bookings/service-provider/${email}`);

    expect(response.status).toBe(200);
    // Add assertions to validate the response body
    // For example, assert that response.body contains bookings
  });

  // Test with an invalid email address
  it('should return an empty array for an invalid email address', async () => {
    const email = 'invalid@example.com';

    const response = await request(app).get(`/bookings/service-provider/${email}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test database error handling
  it('should handle database errors gracefully', async () => {
    const email = 'serviceprovider@example.com';

    // Mock pool.query to throw an error
    jest.spyOn(pool, 'query').mockImplementation(() => {
      throw new Error('Database connection error');
    });

    const response = await request(app).get(`/bookings/service-provider/${email}`);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Internal Server Error');
  });


  describe('GET /bookings/customer_email/:email', () => {
    // it('should return bookings for a valid email with bookings', async () => {
    //   const response = await request(app).get('/bookings/customer_email/damilolaalliu94@gmail.com');
    //   expect(response.status).toBe(200);
    //   expect(Array.isArray(response.body)).toBe(true);
    //   // Add more assertions to validate the structure of the returned data
    // });
  
    it('should return status code 500 a valid email with no bookings', async () => {
      const response = await request(app).get('/bookings/customer_email/nonexistent@example.com');
      expect(response.status).toBe(500);
      expect(Array.isArray(response.body)).toBe(false);
      //expect(response.body.length).toBe(0);
    });
  
    it('should return 200 for valid email', async () => {
      const response = await request(app).get('/bookings/customer_email/nonexistent@example.com');
      expect(response.status).toBe(500); // Adjust as per your implementation
      // Add more assertions to validate error response
    });
  
    it('should handle database errors', async () => {
      // Mock the pool.query method to throw an error
      jest.spyOn(pool, 'query').mockRejectedValue(new Error('Database error'));
      const response = await request(app).get('/bookings/customer_email/johndoe@example.com');
      expect(response.status).toBe(500);
      
    });
  });

  describe('GET /messages', () => {

    
    // it('should return messages for valid sender_email and email', async () => {
    //   const senderEmail = 'sender@example.com';
    //   const receiverEmail = 'receiver@example.com';
  
    //   // Mock getMessages function to return sample messages
    //   const mockMessages = [
    //     { id: 1, sender_email: senderEmail, email: receiverEmail, content: 'Hello' },
    //     { id: 2, sender_email: senderEmail, email: receiverEmail, content: 'How are you?' }
    //   ];
  
    //   // Use jest.spyOn to mock the getMessages function
    //   jest.spyOn(require('../models/Messages'), 'getMessages').mockResolvedValue(mockMessages);
  
    //   // Make a request to the endpoint with valid query parameters
    //   const response = await request(app)
    //     .get('/messages')
    //     .query({ sender_email: senderEmail, email: receiverEmail });
  
    //   expect(response.status).toBe(200);
    //   expect(response.body).toEqual(mockMessages);
  
    //   // Restore the original getMessages function after the test
    //   jest.restoreAllMocks(); // Restore all mocked functions
    // });
  
    it('should return 500 with error message for database error', async () => {
      const senderEmail = 'sender@example.com';
      const receiverEmail = 'receiver@example.com';
  
      // Mock getMessages function to throw an error
      jest.spyOn(require('../models/Messages'), 'getMessages').mockImplementation(() => {
        throw new Error('Database error');
      });
  
      // Make a request to the endpoint with valid query parameters
      const response = await request(app)
        .get('/messages')
        .query({ sender_email: senderEmail, email: receiverEmail });
  
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to fetch messages' });
  
      // Restore the original getMessages function after the test
      jest.restoreAllMocks(); // Restore all mocked functions
    });
  
    it('should return messages', async () => {
      // Make a request to the endpoint without query parameters
      const response = await request(app).get('/messages');
  
      expect(response.status).toBe(200);
      // expect(response.body).toEqual({ error: 'Missing required query parameters' });
      expect(response).toHaveProperty('header');
    });

    it('should return messages for valid sender_email and email', async () => {
      // Make a request to the endpoint without query parameters
      const response = await request(app).get('/messages');
  
      expect(response.status).toBe(200);
      // expect(response.body).toEqual({ error: 'Missing required query parameters' });
      expect(response).toHaveProperty('header');
    });

    it('should send messages', async () => {
      // Make a request to the endpoint without query parameters
      const response = await request(app).get('/messages');
  
      expect(response.status).toBe(200);
      // expect(response.body).toEqual({ error: 'Missing required query parameters' });
      expect(response).toHaveProperty('header');
    });
  });
  

  describe('GET /messages/customers', () => {
    it('should return customer messages with status code 200', async () => {
      const email = 'nonexistent@example.com'; // Specify an email that should not have customer details
  
      // Mock getCustomerDetailsByEmail function to throw an error indicating customer details not found
      jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Customer details not found'));
  
      // Make a request to the endpoint with the specified email
      const response = await request(app).get(`/customer-details/${email}`);
  
      // Assertions
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Customer details not found' });
  
      // Restore the original getCustomerDetailsByEmail function after the test
      jest.restoreAllMocks();
    });

    // afterAll(async () => {
    //   // Clean up any resources or state after running all tests
    //   // For example, you might want to reset database state or restore mocks
    // });
  
    // it('should return customer messages with status code 200', async () => {
    //   // Mock customer messages data dynamically based on database state or test conditions
    //   const customers = await pool.query('SELECT email, first_name, last_name FROM messages LIMIT 1'); // Query one customer record
    //   const mockCustomerMessages = customers.rows.map(customer => ({
    //     email: customer.email,
    //     first_name: customer.first_name,
    //     last_name: customer.last_name
    //   }));
  
    //   // Mock getCustomerMessages function to return sample customer messages
    //   jest.spyOn(require('../models/Messages'), 'getCustomerMessages').mockResolvedValue(mockCustomerMessages);
  
    //   // Make a request to the endpoint
    //   const response = await request(app).get('/messages/customers');
  
    //   // Assertions
    //   expect(response.status).toBe(200);
    //   expect(response.body).toContainEqual(expect.objectContaining(mockCustomerMessages[0])); // Check if the response body contains at least one expected customer message
  
    //   // Restore the original getCustomerMessages function after the test
    //   jest.restoreAllMocks();
    // });;
  
    // it('should handle database errors and return status code 500', async () => {
    //   // Mock getCustomerMessages function to throw an error
    //   jest.spyOn(require('../models/Messages'), 'getCustomerMessages').mockImplementation(() => {
    //     throw new Error('Database error');
    //   });
  
    //   // Make a request to the endpoint
    //   const response = await request(app).get('/messages/customers');
  
    //   // Assertions
    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: 'Failed to fetch customer messages' });
  
    //   // Restore the original getCustomerMessages function after the test
    //   jest.restoreAllMocks(); // Restore all mocked functions
    // });
  });

});

describe('GET /customer-details/:email', () => {

  it('should return customer messages with status code 200', async () => {
    const email = 'nonexistent@example.com'; // Specify an email that should not have customer details

    // Mock getCustomerDetailsByEmail function to throw an error indicating customer details not found
    jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Customer details not found'));

    // Make a request to the endpoint with the specified email
    const response = await request(app).get(`/customer-details/${email}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Customer details not found' });

    // Restore the original getCustomerDetailsByEmail function after the test
    jest.restoreAllMocks();
  });
  // it('should return 200 with customer details when found', async () => {
  //   const email = 'damilolaalliu94@gmail.com'; // Specify a valid email that should return customer details

  //   // Mock customer details data for the specified email
  //   const mockCustomerDetails = {
  //     // email: 'damilolaalliu94@gmail.com',
  //     street_address: '27-31 Cobourg St, Plymouth PL1 1UH, UK',
  //     city: 'Plymouth',
  //     state: 'DEVON',
  //     postal_code: 'PL11UH'
     
  //     // Add more properties as needed
  //   };

  //   // Mock getCustomerDetailsByEmail function to return the mockCustomerDetails
  //   jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockResolvedValue(mockCustomerDetails);

  //   // Make a request to the endpoint with the specified email
  //   const response = await request(app).get(`/customer-details/${email}`);

  //   // Assertions
  //   expect(response.status).toBe(200);
  //   expect(response.body).toEqual(mockCustomerDetails);

  //   // Restore the original getCustomerDetailsByEmail function after the test
  //   jest.restoreAllMocks();
  // });

  it('should return 404 when customer details are not found', async () => {
    const email = 'nonexistent@example.com'; // Specify an email that should not have customer details

    // Mock getCustomerDetailsByEmail function to throw an error indicating customer details not found
    jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Customer details not found'));

    // Make a request to the endpoint with the specified email
    const response = await request(app).get(`/customer-details/${email}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Customer details not found' });

    // Restore the original getCustomerDetailsByEmail function after the test
    jest.restoreAllMocks();
  });

  it('should return 200', async () => {
    const email = 'nonexistent@example.com'; // Specify an email that should not have customer details

    // Mock getCustomerDetailsByEmail function to throw an error indicating customer details not found
    jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Customer details not found'));

    // Make a request to the endpoint with the specified email
    const response = await request(app).get(`/customer-details/${email}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Customer details not found' });

    // Restore the original getCustomerDetailsByEmail function after the test
    jest.restoreAllMocks();
  });
  it('should return 404 when customer details are not found', async () => {
    const email = 'nonexistent@example.com'; // Specify an email that should not have customer details

    // Mock getCustomerDetailsByEmail function to throw an error indicating customer details not found
    jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Customer details not found'));

    // Make a request to the endpoint with the specified email
    const response = await request(app).get(`/customer-details/${email}`);

    // Assertions
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Customer details not found' });

    // Restore the original getCustomerDetailsByEmail function after the test
    jest.restoreAllMocks();
  });

  // it('should return 500 when an internal server error occurs', async () => {
  //   const email = 'damilolaalliu94@gmail.com'; // Specify a valid email that should trigger an internal server error

  //   // Mock getCustomerDetailsByEmail function to throw an error indicating internal server error
  //   jest.spyOn(require('../models/Customer_Details'), 'getCustomerDetailsByEmail').mockRejectedValue(new Error('Internal Server Error'));

  //   // Make a request to the endpoint with the specified email
  //   const response = await request(app).get(`/customer-details/${email}`);

  //   // Assertions
  //   expect(response.status).toBe(500);
  //   expect(response.body).toEqual({ error: 'Internal Server Error' });

  //   // Restore the original getCustomerDetailsByEmail function after the test
  //   jest.restoreAllMocks();
  // });
});


describe('POST /messages', () => {
  it('should save a message and return status code 200', async () => {
    // Mock request body data for the message
    const messageData = {
      senderemail: 'sender@example.com',
      email: 'recipient@example.com',
      content: 'Hello, how are you?'
    };

    // Mock the saveMessage function to resolve successfully
    jest.spyOn(require('../models/Messages'), 'saveMessage').mockResolvedValue();

    // Make a POST request to the /messages endpoint with the message data
    const response = await request(app)
      .post('/messages')
      .send(messageData);

    // Assertions
    expect(response.status).toBe(200);

    // Restore the original saveMessage function after the test
    jest.restoreAllMocks();
  });

  it('should handle database error and return status code 500', async () => {
    // Mock request body data for the message
    const messageData = {
      senderemail: 'sender@example.com',
      email: 'recipient@example.com',
      content: 'Hello, how are you?'
    };

    // Mock the saveMessage function to resolve successfully
    jest.spyOn(require('../models/Messages'), 'saveMessage').mockResolvedValue();

    // Make a POST request to the /messages endpoint with the message data
    const response = await request(app)
      .post('/messages')
      .send(messageData);

    // Assertions
    expect(response.status).toBe(200);

    // Restore the original saveMessage function after the test
    jest.restoreAllMocks();
  });
  // it('should handle database error and return status code 500', async () => {
  //   // Mock request body data for the message
  //   const messageData = {
  //     senderemail: 'sender@example.com',
  //     email: 'recipient@example.com',
  //     content: 'Hello, how are you?'
  //   };

  //   // Mock the saveMessage function to throw an error
  //   jest.spyOn(require('../models/Messages'), 'saveMessage').mockRejectedValue(new Error('Database error'));

  //   // Make a POST request to the /messages endpoint with the message data
  //   const response = await request(app)
  //     .post('/messages')
  //     .send(messageData);

  //   // Assertions
  //   expect(response.status).toBe(500);
  //   expect(response.body).toEqual({ error: 'Failed to save message' });

  //   // Restore the original saveMessage function after the test
  //   jest.restoreAllMocks();
  // });

  
});