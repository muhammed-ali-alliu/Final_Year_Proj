import React, { useState, useEffect } from "react";
import Service_ProviderNavbar from "./Components/Service-ProviderNavbar";
import axios from 'axios';
import "./Orders.css";

function Orders() {
  const [bookings, setBookings] = useState([]);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState("");

  const fetchBookings = async () => {
    try {
      const sp_email = localStorage.getItem('email');
      const loggedInServiceProviderEmail = sp_email;
      const response = await axios.get(`http://localhost:8000/bookings/service-provider/${loggedInServiceProviderEmail}`);
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchMessages = async () => {
    try {
      const sp_email = localStorage.getItem('email');
      const response = await axios.get(`http://localhost:8000/messages?sender_email=${sp_email}&email=${selectedCustomerEmail}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const acceptTask = async (bookingId) => {
    try {
      await axios.put(`http://localhost:8000/bookings/${bookingId}`, { status: 'Job Accepted' });
      fetchBookings();
    } catch (error) {
      console.error('Error accepting task:', error);
    }
  };

  const declineTask = async (bookingId, reason) => {
    try {
      await axios.put(`http://localhost:8000/bookings/${bookingId}`, { status: 'Job Declined', declineReason: reason });
      fetchBookings();
    } catch (error) {
      console.error('Error declining task:', error);
    }
  };

  const confirmJobCompletion = async (bookingId, hoursWorked) => {
    try {
      const sp_email = localStorage.getItem('email');
      const serviceProviderData = await axios.get(`http://localhost:8000/service-providers/${sp_email}`);
      const hourlyRate = serviceProviderData.data.hourly_rate;
      const normalCharge = hourlyRate * hoursWorked;
      const serviceCharge = 0.2 * normalCharge;
      const totalCharge = normalCharge + serviceCharge;
      await axios.put(`http://localhost:8000/bookings/${bookingId}`, {
        status: 'Job Completed',
        hoursWorked: hoursWorked,
        serviceCharge: serviceCharge,
        totalCharge: totalCharge,
        email: sp_email
      });
      fetchBookings();
    } catch (error) {
      console.error('Error confirming job completion:', error);
    }
  };

  const sendMessage = async () => {
    try {
      const sp_email = localStorage.getItem('email');
      await axios.post('http://localhost:8000/messages', {
        senderemail: sp_email,
        email: selectedCustomerEmail,
        content: newMessage
      });
      setMessages([...messages, { content: newMessage }]); 
      setNewMessage(""); 
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

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

  const handleHoursWorkedChange = (e, index) => {
    const updatedBookings = [...bookings];
    updatedBookings[index] = { ...updatedBookings[index], hoursWorked: e.target.value };
    setBookings(updatedBookings);
  };

 

  useEffect(() => {
    if (showMessagePopup && selectedCustomerEmail) {
      fetchMessages();
    }
  }, [showMessagePopup, selectedCustomerEmail]);

  return (
    <>
      <div className="orders-page">
        <Service_ProviderNavbar />
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
            {booking.status !== 'Job Completed' && booking.status !== 'Job Declined' && (
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
            <button onClick={() => {
                setShowMessagePopup(true);
                setSelectedCustomerEmail(booking.customer_email);
            }}>Message</button>
          </div>
        ))}
      </div>
      {showMessagePopup && (
        <div className="overlay">
          <div className="popup">
            <span className="close" onClick={() => setShowMessagePopup(false)}>&times;</span>
            <h3>Chat with Alliu</h3>
            {/* Chat messages */}
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={message.sender === localStorage.getItem('email') ? "sent-message" : "received-message"}>
                {message.content}</div>
              ))}
            </div>
            {/* Chat input */}
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
