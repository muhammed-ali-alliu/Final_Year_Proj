// Import React and other necessary modules
import React, { useState, useEffect } from "react";
import Service_ProviderNavbar from "./Components/Service-ProviderNavbar";
import axios from 'axios'; // Import Axios for making HTTP requests
import "./Orders.css"; // Import your CSS file

// Define initial booking state
const initialBookingState = {
    date: '',
    time: '',
    customer_email: '',
    notes: '',
    status: '',
    hoursWorked: 0,
    serviceCharge: 0
};

// Define the Orders component
function Orders() {
    const [bookings, setBookings] = useState([]); // State to store bookings data

    // Function to fetch bookings for the logged-in service provider
    const fetchBookings = async () => {
        try {
            const sp_email = localStorage.getItem('email');
            const loggedInServiceProviderEmail = sp_email;

            // Make a GET request to fetch bookings for the logged-in service provider
            const response = await axios.get(`http://localhost:8000/bookings/service-provider/${loggedInServiceProviderEmail}`);
            
            // Set the retrieved bookings in the state
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            // Handle error scenarios
        }
    };

    useEffect(() => {
        // Fetch bookings when the component mounts
        fetchBookings();
    }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

    // Function to handle accepting a task
    const acceptTask = async (bookingId) => {
        try {
            await axios.put(`http://localhost:8000/bookings/${bookingId}`, { status: 'Job Accepted' });
            // Fetch bookings again to reflect the updated status
            fetchBookings();
        } catch (error) {
            console.error('Error accepting task:', error);
            // Handle error scenarios
        }
    };

    // Function to handle declining a task
    const declineTask = async (bookingId, reason) => {
        try {
            await axios.put(`http://localhost:8000/bookings/${bookingId}`, { status: 'Job Declined', declineReason: reason });
            // Fetch bookings again to reflect the updated status
            fetchBookings();
        } catch (error) {
            console.error('Error declining task:', error);
            // Handle error scenarios
        }
    };

    // Function to handle confirming job completion
    const confirmJobCompletion = async (bookingId, hoursWorked) => {
        try {
            const sp_email = localStorage.getItem('email');
            const serviceProviderData = await axios.get(`http://localhost:8000/service-providers/${sp_email}`);
            
            const hourlyRate = serviceProviderData.data.hourly_rate;
            const normalCharge = hourlyRate * hoursWorked;
            const serviceCharge = 0.2 * normalCharge;
            const totalCharge = normalCharge + serviceCharge;

            // Make a PUT request to update the booking status and provide additional details
            await axios.put(`http://localhost:8000/bookings/${bookingId}`, {
                status: 'Job Completed',
                hoursWorked: hoursWorked,
                serviceCharge: serviceCharge,
                totalCharge: totalCharge,
                email: sp_email
            });
            
            // Fetch bookings again to reflect the updated status
            fetchBookings();
        } catch (error) {
            console.error('Error confirming job completion:', error);
            // Handle error scenarios
        }
    };

    // Function to render action statement based on booking status
    const renderActionStatement = (booking) => {
        if (booking.status === 'Job Accepted') {
            return <p>Task Accepted</p>;
        } else if (booking.status === 'Job Declined') {
            return <p>Task Declined</p>;
        } else if (booking.status === 'Job Completed') {
            return <p>You have completed this job.</p>;
        }
        return (
            <div className="action-buttons">
            <button onClick={() => acceptTask(booking.id)} className="action-button accept-button">
                Accept
            </button>
            <button onClick={() => {
                const reason = prompt('Please provide a reason for declining:');
                if (reason !== null && reason !== '') {
                    declineTask(booking.id, reason);
                }
            }} className="action-button decline-button">
                Decline
            </button>
        </div>
        );
    };

    // Function to handle input change for hours worked
    const handleHoursWorkedChange = (e, index) => {
        const updatedBookings = [...bookings];
        updatedBookings[index] = { ...updatedBookings[index], hoursWorked: e.target.value };
        setBookings(updatedBookings);
    };

    // Return the JSX content
    return (
        <>
            <div className="orders-page">
                <div>
                    <Service_ProviderNavbar />
                </div>
                <div className="Page_title">
                    Your Orders
                </div>
            </div>
            <div className="Order-info">
                {bookings.map((booking, index) => (
                    <div key={index} className="booking-item">
                        <p>Date: {booking.date}</p>
                        <p>Time: {booking.time}</p>
                        <p>Customer Email: {booking.customer_email}</p>
                        <p>Notes: {booking.notes}</p>
                        <p>Status: {booking.status}</p>
                        <br /> <br />
                        {booking.status !== 'Job Completed' && (
                            <input
                                type="number"
                                placeholder="Hours Worked"
                                value={booking.hoursWorked || ''}
                                onChange={(e) => handleHoursWorkedChange(e, index)}
                            />
                        )}
                        {booking.status === 'Job Accepted' && (
                            <button onClick={() => confirmJobCompletion(booking.id, booking.hoursWorked, booking.serviceCharge)}>
                                Confirm Job Completion
                            </button>
                        )}
                        {renderActionStatement(booking)}
                    </div>
                ))}
            </div>
        </>
    );
}


export default Orders;
