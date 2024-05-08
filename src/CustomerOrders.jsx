import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CustomerNavbar from "./Components/CustomerNavbar";
import axios from 'axios';
import "./CustomerOrders.css";

function CustomerOrders() {
    const [bookings, setBookings] = useState([]);

    const fetchBookings = async () => {
        try {
            const customer_email = localStorage.getItem('email');
            const response = await axios.get(`http://localhost:8000/bookings/customer_email/${customer_email}`);
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return (
        <div className="customer-orders-container">
            <CustomerNavbar />
            <div className="customer-orders-content">
                <h1 className="page-title">Your Orders</h1>
                <div className="booking-list">
                    {bookings.map((booking, index) => (
                        <div key={index} className="booking-item">
                            <p><strong>Date:</strong> {booking.date}</p>
                            <p><strong>Time:</strong> {booking.time}</p>
                            <p><strong>Service Provider Email:</strong> {booking.service_provider_email}</p>
                            <p><strong>Notes:</strong> {booking.notes}</p>
                            <p><strong>Status:</strong> {booking.status}</p>

                            {/* Pass necessary details as URL parameters */}
                            {booking.status === 'Job Completed' && (
                                <Link
                                    to={{
                                        pathname: "/review",
                                        state: {
                                            serviceProviderEmail: booking.service_provider_email,
                                            customerEmail: localStorage.getItem('email'),
                                            jobId: booking.id  // Assuming 'id' represents the job ID
                                        }
                                    }}
                                    className="btn review-button"
                                >
                                    Review
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CustomerOrders;
