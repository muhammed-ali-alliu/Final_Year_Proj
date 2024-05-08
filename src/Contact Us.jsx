import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import "./Contact Us.css";

function Contact() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, message }),
      });
      if (response.ok) {
        console.log("Data submitted successfully");
        // Reset form fields
        setFullName("");
        setEmail("");
        setMessage("");
        
        // Show alert for 5 seconds
        alert("Response received");
        setTimeout(() => {
          // Hide alert after 5 seconds
          // You can add additional logic here if needed
        }, 5000);
      } else {
        console.error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };
  

  return (
    <>
      <Navbar />

      <div className="contact-page">
        <div className="contact-title">Contact Us</div>
        <h2>We are here to help. Get in touch and we'll get back to you as soon as we can.</h2>

        <div className="contact-form">
          <div className="contact-form-title">Contact Form</div>

          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <textarea placeholder="How can we help you?" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>

            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
