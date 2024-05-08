import React, { useState, useEffect } from 'react';

function ServiceProviderList() {
    const [serviceProviders, setServiceProviders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchServiceProviders() {
            try {
                const response = await fetch('http://localhost:8000/service-providers', {
                    headers: {
                        accept: 'application/json',
                        'User-agent': 'learning app',
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch service providers');
                }
                
                const data = await response.json();
                setServiceProviders(data);
            } catch (error) {
                console.error('Error fetching service providers:', error);
                setError(error.message);
            }
        }

        fetchServiceProviders();
    }, []);

    const viewProfile = (id) => {
        // Implement logic to view profile
        console.log('View profile for service provider with ID:', id);
    };

    const contact = (id) => {
        // Implement logic to contact
        console.log('Contact service provider with ID:', id);
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {serviceProviders.map(serviceProvider => (
                <div key={serviceProvider.id} className="serviceProvider">
                    <h3>{serviceProvider.name}</h3>
                    <p>{serviceProvider.description}</p>
                    <button onClick={() => viewProfile(serviceProvider.id)}>View Profile</button>
                    <button onClick={() => contact(serviceProvider.id)}>Contact</button>
                </div>
            ))}
        </div>
    );
}

export default ServiceProviderList;
