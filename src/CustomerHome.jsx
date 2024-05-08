import React, { useState } from "react";
import CustomerNavbar from "./Components/CustomerNavbar";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./CustomerHome.css";

function CustomerHome() {
    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query
    const navigate = useNavigate(); // Initialize navigate for navigation

    const firstname = localStorage.getItem('firstname');

    // Function to handle search query change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Function to handle search submission
    const handleSearchSubmit = () => {
        // Navigate to the search results page with the search query as a URL parameter
        navigate(`/search-results?query=${encodeURIComponent(searchQuery)}`); // encode the query
    };

    return (
        <>
            <CustomerNavbar/>

            <div className="welcome-messages">
                <p>Welcome to TaskCraft, <b>{firstname}</b></p>
            </div>

            <div className="service-provider">
                Find a service provider

                <div className="input-search">
                    {/* Input field for search */}
                    <input type="search" placeholder="Search for a service..." className="search" value={searchQuery} onChange={handleSearchChange}/>
                    {/* Button to trigger search */}
                    <button onClick={handleSearchSubmit}>Search</button>
                </div>

                <div className="popular-services">
                    Popular Services
                </div>

                <div className="popular-services-containers">
                    <ul>
                        <li>Plumbing</li>
                        <li>Electrician</li>
                        <li>Handyman</li>
                        <li>House Cleaning</li>
                        <li>Appliance repair</li>
                        <li>Carpet Cleaning</li>
                        <li>Furniture assembly</li>
                        <li>Movers</li>
                        <li>Junk removal</li>
                        <li>Lawn mowing</li>
                    </ul>
                </div>

                <div className="most-viewed">
                    Most viewed service providers
                </div>

                <div className="service-list">
                <div className="electricians"></div>
                <h2></h2>

                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                
                
                <div className="electricians"></div>
                </div>
            </div>
        </>
    );
}

export default CustomerHome;
