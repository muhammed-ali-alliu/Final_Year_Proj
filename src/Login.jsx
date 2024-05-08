import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleChangeEmail = (e) => setEmail(e.target.value);
    const handleChangePassword = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/login", { email, password });
            const { token, firstname, lastname, phonenumber, role, email: userEmail } = response.data;
            

            

            localStorage.setItem("token", token);
            localStorage.setItem("firstname", firstname);
            localStorage.setItem("lastname", lastname);
            localStorage.setItem("phonenumber", phonenumber);
            localStorage.setItem("role", role);
            localStorage.setItem("email", userEmail);
           
            
            if (response.data.role === "customer") {
                // Redirect to customer page
                window.location.href = "/customer";
            } else if (response.data.role === "service-provider") {
                // Redirect to service provider page
                window.location.href = "/service-provider";
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Invalid email or password");
        }
    };

    return (
        <>
            <Navbar />
            <div className="log-form">
                <div className="welcome-message">
                    <h2>Welcome Back</h2>
                </div>
                <div className="page-message">
                    Login with your email and password
                </div>
                <div className="form">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input type="email" value={email} onChange={handleChangeEmail} required />
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={handleChangePassword} required />
                        <a href="">Forgot Password?</a>
                        <button type="submit">Login</button>
                    </form>
                    {error && <div className="error-message">{error}</div>}
                </div>
            </div>
        </>
    );
}

export default Login;
