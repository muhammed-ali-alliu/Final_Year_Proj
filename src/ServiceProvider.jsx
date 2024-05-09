import React, { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "./Components/Navbar";
import Service_ProviderNavbar from './Components/Service-ProviderNavbar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './ServiceProvider.css';

function ServiceProvider() {
    const [date, setDate] = useState(new Date());
    const [serviceCategory, setServiceCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        const fetchServiceCategory = async () => {
            try {
                const response = await Axios.get(`http://localhost:8000/service-providers/${userEmail}`);
                const serviceProviderData = response.data;
                console.log(serviceProviderData)
                setServiceCategory(serviceProviderData.provided_services);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching service category:', error);
                setLoading(false);
            }
        };

        fetchServiceCategory();
    }, []);

    const test = 5;
    const test2 = 0;
    const firstname = localStorage.getItem("firstname")
    const lastname = localStorage.getItem("lastname")

    return (
        <>
            <div>
                <Service_ProviderNavbar/>

                <div className="title_dashboard">
                    My Dashboard
                </div>

                <div className="dashboard-container">
                    <h2>Dashboard Overview</h2>
                    <div className="dashboard-details">
                        <p>Name: {firstname} {lastname}</p>
                        <p>Customer Ratings: </p>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <p>Service Category: {serviceCategory}</p>
                        )}
                        <p>Next Appointment: 2024-04-24</p>
                    </div>
                </div>

                <div className="calendar-title">
                    My Calendar
                </div>

                <div className="calendar-container">
                    <Calendar
                        onChange={setDate} 
                        value={date} 
                    />
                </div>
            </div>
        </>
    );
}

export default ServiceProvider;
