import React, { useState, useEffect } from 'react';
import CustomerNavbar from './Components/CustomerNavbar';
import axios from 'axios';
import './Review.css';

function Review(props) {
    const { location } = props;
    const state = location?.state || {};

    const {
        serviceProviderEmail = '',
        customerEmail = '',
        jobId = ''
    } = state;

    const [formData, setFormData] = useState({
        rating: 0,
        serviceType: '',
        quality: '',
        professionalism: '',
        timeliness: '',
        comments: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        // Display alert message
        alert('Thank you, your review has been submitted!');
        try {
            // Simulate API request (commented out actual request for demonstration)
            // const response = await axios.post(`http://localhost:8000/reviews/serviceProvider/${serviceProviderEmail}`, {
            //     ...formData,
            //     customerEmail,
            //     jobId
            // });
            // console.log(response.data);
            // Fetch reviews after submitting (replace with actual fetch if needed)
            // fetchReviews();
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
        // Redirect to the /customer page after displaying the alert
        window.location.href = '/customer';
    };

    // Function to fetch reviews (can be implemented if needed)
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/reviews/serviceProvider/${serviceProviderEmail}`);
            // Set reviews data to state
            // setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    // useEffect to fetch reviews on component mount (can be implemented if needed)
    useEffect(() => {
        // fetchReviews();
    }, []); // Empty dependency array to run only once on component mount

    return (
        <>
            <CustomerNavbar />
            <div className="review-container">
                <h1>Leave a Review</h1>
                <form onSubmit={handleSubmitReview}>
                    {/* Input fields for review form */}
                    <label htmlFor="rating">Rating:</label>
                    <input type="number" id="rating" name="rating" min="1" max="5" value={formData.rating} onChange={handleInputChange} required />

                    <label htmlFor="serviceType">Service Type:</label>
                    <input type="text" id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleInputChange} required />

                    <label htmlFor="quality">Quality of Service:</label>
                    <input type="text" id="quality" name="quality" value={formData.quality} onChange={handleInputChange} required />

                    <label htmlFor="professionalism">Professionalism:</label>
                    <input type="text" id="professionalism" name="professionalism" value={formData.professionalism} onChange={handleInputChange} required />

                    <label htmlFor="timeliness">Timeliness:</label>
                    <input type="text" id="timeliness" name="timeliness" value={formData.timeliness} onChange={handleInputChange} required />

                    <label htmlFor="comments">Comments:</label>
                    <textarea id="comments" name="comments" value={formData.comments} onChange={handleInputChange} required />

                    <button type="submit" className="submit-review-button">Submit Review</button>
                </form>
            </div>
        </>
    );
}

export default Review;
