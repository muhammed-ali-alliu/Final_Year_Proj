// SearchResults.js

import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import CustomerNavbar from './Components/CustomerNavbar';
import axios from 'axios';
import "./search-results.css";

function SearchResults() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("query");
    const [serviceProviders, setServiceProviders] = useState([]);

    useEffect(() => {
        const fetchServiceProviders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/service-providers');
                const allServiceProviders = response.data;
                const filteredServiceProviders = filterServiceProviders(allServiceProviders, query);
                setServiceProviders(filteredServiceProviders);
            } catch (error) {
                console.error("Error fetching service providers:", error);
            }
        };

        fetchServiceProviders();
    }, [query]);

    const filterServiceProviders = (serviceProviders, query) => {
        if (!Array.isArray(serviceProviders)) {
            return [];
        }

        return serviceProviders.filter(provider => 
            provider.provided_services.includes(query.toLowerCase()) || 
            provider.location.toLowerCase().includes(query.toLowerCase())
        );
    };

    return (
        <div className="search-result-page">
            <CustomerNavbar />
            <div className="search-page-title">
                <h1>Search Results</h1>
                <p>Showing results for: {query}</p>
            </div>
            <div className="service-provider-container">
                {serviceProviders.map(provider => (
                    <div className="service-provider" key={provider.id}>
                        <div className="contact-container">
                            <p>Email: {provider.email}</p>
                            <p>Location: {provider.location}</p>
                            <p>Hourly Rate: GBP{provider.hourly_rate}/hr</p>
                            <p>Provided Services: {provider.provided_services}</p>
                            <div className="button-container">
                                {/* <button onClick={() => handleContactMe(provider.id)}>Contact Me</button>
                                <button onClick={() => handleChatMe(provider.id)}>Chat Me</button> */}
                                <Link to={`/providerprofile/${provider.email}`}>
                                    <button>View Profile</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
