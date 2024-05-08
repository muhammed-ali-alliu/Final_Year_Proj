import React, { useState, useEffect } from "react";
import Service_ProviderNavbar from "./Components/Service-ProviderNavbar";
import axios from "axios";

function Messages() {
    const [customerMessages, setCustomerMessages] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        // Fetch list of customers who have messaged the service provider
        fetchCustomerMessages();
    }, []);

    const fetchCustomerMessages = async () => {
        try {
            // Make a request to fetch the list of customers
            const response = await axios.get("http://localhost:8000/messages/customers");
            console.log(response.data)
            setCustomerMessages(response.data);
        } catch (error) {
            console.error("Error fetching customer messages:", error);
        }
    };

    const handleCustomerSelect = (customerId) => {
        // Fetch messages from the selected customer
        // You can implement this function to fetch messages based on customer ID
        // For example, make a request to fetch messages from a specific customer
        // Update the state to store the selected customer ID
        setSelectedCustomer(customerId);
    };

    return (
        <>
            <Service_ProviderNavbar />
            <div className="messages-container">
                <div className="customer-tabs">
                    {/* Render customer tabs */}
                    {customerMessages.map((customer) => (
                        <div
                            key={customer.id}
                            className={`customer-tab ${selectedCustomer === customer.id ? "active" : ""}`}
                            onClick={() => handleCustomerSelect(customer.id)}
                        >
                            {customer.name}
                        </div>
                    ))}
                </div>
                <div className="message-display">
                    {/* Render messages from the selected customer */}
                    {/* You can render the messages in a chat-like interface */}
                    {/* For example, display sender name and message content */}
                    {selectedCustomer && (
                        <div>
                            {/* Render messages from the selected customer */}
                            {/* You can fetch and display messages here */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Messages;
