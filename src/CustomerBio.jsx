import React, { useState, useEffect } from 'react';
import './CustomerBio.css';
import CustomerNavbar from './Components/CustomerNavbar';
import axios from 'axios'; // Import axios for making HTTP requests

function CustomerBio() {
    const [address, setAddress] = useState({
        streetAddress: '',
        city: '',
        state: '',
        postalCode: ''
    });

    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/customer-details/${userEmail}`);
                const customerDetails = response.data;

                setAddress({
                    streetAddress: customerDetails.street_address || '',
                    city: customerDetails.city || '',
                    state: customerDetails.state || '',
                    postalCode: customerDetails.postal_code || ''
                });
            } catch (error) {
                console.error('Error fetching customer details:', error);
                // Handle errors here
            }
        };

        fetchCustomerDetails();
    }, []); // Empty dependency array ensures that this effect runs only once when the component mounts

    const handleAddressChange = (event) => {
        const { name, value } = event.target;
        setAddress({
            ...address,
            [name]: value
        });
    };

    const handleUpdateAddress = async () => {
        try {
            await axios.put(`http://localhost:8000/customer-details/${userEmail}`, address);
            console.log('Address updated successfully');
            // Display alert when address is updated successfully
            window.alert('Profile update successful');
        } catch (error) {
            console.error('Error updating address:', error);
            // Handle errors here
        }
    };

    return (
        <>
            <CustomerNavbar />
            <div className='customer-bio-container'>
                <div className='page-title'>
                    Your Details
                </div>

                <div className='home-address'>
                    <div>
                        <label htmlFor="streetAddress">Street Address:</label>
                        <input type="text" id="streetAddress" name="streetAddress" value={address.streetAddress} onChange={handleAddressChange} />
                    </div>
                    <div>
                        <label htmlFor="city">City:</label>
                        <input type="text" id="city" name="city" value={address.city} onChange={handleAddressChange} />
                    </div>
                    <div>
                        <label htmlFor="state">State:</label>
                        <input type="text" id="state" name="state" value={address.state} onChange={handleAddressChange} />
                    </div>
                    <div>
                        <label htmlFor="postalCode">Postal Code:</label>
                        <input type="text" id="postalCode" name="postalCode" value={address.postalCode} onChange={handleAddressChange} />
                    </div>
                    <button className='update-address-button' onClick={handleUpdateAddress}>Update Address</button>
                </div>
            </div>
        </>
    );
}

export default CustomerBio;
