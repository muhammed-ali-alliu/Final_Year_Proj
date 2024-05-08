import React, { useState, useEffect } from 'react';
import './Bio.css';
import Service_ProviderNavbar from './Components/Service-ProviderNavbar';
import axios from 'axios'; // Import axios for making HTTP requests

function Bio() {
    const [serviceProvider, setServiceProvider] = useState({
        email: '',
        profilePhoto: null,
        location: '',
        services: '', // Update services to a single string
        hourlyRate: '',
        bio: ''
    });

    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        const fetchServiceProviderData = async () => {
            try {
                // Make a GET request to retrieve service provider details from the backend
                const response = await axios.get(`http://localhost:8000/service-providers/${userEmail}`);
                const serviceProviderData = response.data;
                console.log(serviceProviderData);

                // Update the state with the retrieved service provider data
                setServiceProvider({
                    email: serviceProviderData.email,
                    profilePhoto: serviceProviderData.profile_photo || null,
                    location: serviceProviderData.location || '',
                    services: serviceProviderData.provided_services || '', // Update services to a single string
                    hourlyRate: serviceProviderData.hourly_rate
                    || '',
                    bio: serviceProviderData.bio || ''
                });
            } catch (error) {
                console.error('Error fetching service provider data:', error);
                // Handle errors here
            }
        };

        // Call the fetchServiceProviderData function only when component mounts
        fetchServiceProviderData();
    }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setServiceProvider({
            ...serviceProvider,
            [name]: value
        });
    };

    const handleUpdateProfile = async () => {
        try {
            // Make a PUT request to update the service provider's profile in the backend
            await axios.put(`http://localhost:8000/service-providers/${userEmail}`, serviceProvider);

            console.log('Profile updated successfully!');
            // Show alert message
            window.alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            // Handle errors here
        }
    };

    return (
        <>
            <Service_ProviderNavbar />
            <div className='bio-page-title'>
                Your Bio
            </div>

            <div className="sign-up-form">
                <form onSubmit={handleUpdateProfile}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={serviceProvider.email}
                        onChange={handleInputChange}
                        required
                        disabled
                    />

                    <label htmlFor="profilePhoto">Profile Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        name="profilePhoto"
                        
                    />

                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        placeholder="Enter Location"
                        value={serviceProvider.location}
                        onChange={handleInputChange}
                        name="location"
                        required
                        disabled
                    />

                    <label htmlFor="services">Services</label>
                    <input
                        type="text"
                        placeholder="Enter Services"
                        value={serviceProvider.services}
                        onChange={handleInputChange}
                        name="services"
                        required
                    />

                    <label htmlFor="hourlyRate">Hourly Rate</label>
                    <input
                        type="number"
                        placeholder="Enter Hourly Rate"
                        value={serviceProvider.hourlyRate}
                        onChange={handleInputChange}
                        name="hourlyRate"
                        required
                    />

                    <label htmlFor="bio">Bio</label>
                    <textarea
                        placeholder="Enter Bio"
                        value={serviceProvider.bio}
                        onChange={handleInputChange}
                        name="bio"
                        required
                    />

                    <button type="submit">Update</button>
                </form>
            </div>
        </>
    );
}

export default Bio;
