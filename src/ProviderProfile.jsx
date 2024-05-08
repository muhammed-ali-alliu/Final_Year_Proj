import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import CustomerNavbar from "./Components/CustomerNavbar";
import "./ProviderProfile.css";

function ProviderProfile() {
    const { email } = useParams();
    const senderemail = localStorage.getItem('email');
    const [providerProfile, setProviderProfile] = useState(null);
    const [providerProfile2, setProviderProfile2] = useState([]);
    const [showChatPopup, setShowChatPopup] = useState(false); // State to control the display of the chat pop-up
    const [messages, setMessages] = useState([]); // State to store chat messages
    const [newMessage, setNewMessage] = useState(""); // State to store the new message being typed

    // Define fetchMessages function outside of useEffect
    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/messages?sender_email=${senderemail}&email=${email}`);
            console.log("The message", response.data)
            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    

    useEffect(() => {
        const fetchProviderProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/users/${email}`);
                const response2 = await axios.get(`http://localhost:8000/service-providers/${email}`);
                // console.log("Profile 1:", response);
                // console.log("Profile 2:", response2.data);
                setProviderProfile(response.data);
                setProviderProfile2(response2.data);
            } catch (error) {
                console.error("Error fetching provider profile:", error);
            }
        };

        fetchProviderProfile();
    }, [email]);

    useEffect(() => {
        if (showChatPopup) {
            fetchMessages();
        }
    }, [showChatPopup]);

    if (!providerProfile || providerProfile2.length === 0) {
        return <div>Loading...</div>;
    }

    const BookMeBtn = () => {
        console.log("Booking form opened");
    };

    const toggleChatPopup = () => {
        setShowChatPopup(!showChatPopup);
    };

    const closeChatPopup = () => {
        setShowChatPopup(false);
    };

    const sendMessage = async () => {
        try {
            await axios.post("http://localhost:8000/messages", {
                senderemail: senderemail, // Change to the actual sender's ID
                email: email, // Change to the actual recipient's ID
                content: newMessage
            });
            setNewMessage("");
            fetchMessages(); // Call fetchMessages directly
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <>
            <CustomerNavbar />
            {/* <div className="provider-container">
                <h2>{providerProfile.firstName} {providerProfile.lastName}</h2>
                <p>Email: {providerProfile.email}</p>
                <p>Name: {providerProfile.firstname} {providerProfile.lastname}</p>
                <p>Location: {providerProfile2.location}</p>
                <p>Hourly Rate: {providerProfile2.hourly_rate}</p>
                <p>Bio: <br />{providerProfile2.bio}</p>
                <br />

                <div className="btn">
                    <Link to={`/booking/${email}`}>
                        <button onClick={BookMeBtn}>Book Me</button>
                    </Link>

                    <button onClick={toggleChatPopup}>Chat Me</button>
                </div>
            </div> */}

<div className="page_content">

        <div className="page_ttl">
            <h2>{providerProfile.firstname}'s Bio</h2>
        </div>

        <div className="bio_content">
            <h3>Name</h3>
            <p>{providerProfile.firstname} {providerProfile.lastname}</p>

            <h3>Email</h3>
            <p>{providerProfile.email}</p>

            <h3>Location</h3>
            <p>{providerProfile2.location}</p>

            <h3>Hourly Rate</h3>
            <p>GBP{providerProfile2.hourly_rate}/hr</p>

            <h3>Bio Description</h3>
            <p>{providerProfile2.bio}</p>
        </div>

        <div className="btn">
                    <Link to={`/booking/${email}`}>
                        <button onClick={BookMeBtn}>Book Me</button>
                    </Link>

                    <button onClick={toggleChatPopup}>Chat Me</button>
                </div>
</div>


            {/* Render the chat pop-up only when showChatPopup is true */}
            {showChatPopup && (
                <div className="overlay" onClick={closeChatPopup}>
                    <div className="chat-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="chat-container">
                            {/* Chat header */}
                            <div className="chat-header">
                                <span className="close" onClick={closeChatPopup}>&times;</span>
                                <h3>Chat with {providerProfile.firstname} {providerProfile.lastName}</h3>
                            </div>
                            {/* Chat messages */}
                            <div className="chat-messages">
                                {messages.map((message, index) => (
                                    <div key={index}>{message.content}</div>
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
                </div>
            )}
        </>
    );
}

export default ProviderProfile;