import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Service_ProviderNavbar from './Components/Service-ProviderNavbar';
import Calendar from 'react-calendar'; // Import the calendar component
import 'react-calendar/dist/Calendar.css'; // Import calendar styles
import './ServiceProvider.css';

function ServiceProvider() {
    const [date, setDate] = useState(new Date()); // State to manage the selected date

    const test = 5;
    const test2 = 1;

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
        <p>Total Orders Completed: {test}</p>
        <p>Upcoming Appointments: {test2}</p>
        
        <p>Customer Ratings: </p>
        <p>Service Category: plumber</p>
        
        <p>Next Appointment: 2024-04-24</p>
        
    </div>
</div>



                <div className="calendar-title">
                    My Calendar
                    </div>

                <div className="calendar-container">

                   
                    
                    <Calendar
                        onChange={setDate} // Handle date change
                        value={date} // Set selected date
                    />
                </div>

            </div>
        </>
    );
}

export default ServiceProvider;
