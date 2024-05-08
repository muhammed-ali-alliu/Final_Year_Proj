import React, { useState } from "react";
import CustomerNavbar from "./Components/CustomerNavbar";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from "react-router-dom";
import axios from 'axios'; // Import Axios for making HTTP requests
import "./BookingForm.css";

function BookingForm() {
  const { email } = useParams();
  //console.log(email)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const handleNotesChange = (event) => {
    setNotes(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const useremail = localStorage.getItem('email')
    console.log("Logged-in useremail:", useremail)

    try {
            
      const response = await axios.post('http://localhost:8000/bookings', {
        customerEmail: useremail, 
        serviceProviderEmail: email,
        date: selectedDate,
        time: selectedTime,
        status:  'pending',
        notes
      });

      console.log('New booking created:', response.data);
      window.alert('New Booking Created!')
      window.location.href('/customer')
      // Handle any further actions after successful booking creation
    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle error scenarios
    }
  };

  return (
    <>
      <CustomerNavbar />
      <div className="pg-title">
        Schedule Task
      </div>
      <div className="question_haha">
        <p>When would you like me to come?</p>
      </div>

      <div className="booking_form">
        <form onSubmit={handleSubmit}>
          <br />
          <br />
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            inline
          />
          
          <div>
            <p className="Time">What Time</p>
          </div>
          <br />
          <br />

          <div className="TimeSelection">
            {/* Add radio buttons for selecting time */}
            {/* Example: */}
            <label htmlFor="9am">9:00AM</label>
            <input type="radio" name="time" id="9am" value="9:00AM" onChange={() => handleTimeChange("9:00AM")} />

            <label htmlFor="10am">10:00AM</label>
            <input type="radio" name="time" id="10am" value="10:00AM" onChange={() => handleTimeChange("10:00AM")} />

            <label htmlFor="11am">11:00AM</label>
            <input type="radio" name="time" id="11am" value="11:00AM" onChange={() => handleTimeChange("11:00AM")} />

            <label htmlFor="12pm">12:00PM</label>
            <input type="radio" name="time" id="12pm" value="12:00PM" onChange={() => handleTimeChange("12:00PM")} />

            <label htmlFor="1pm">1:00PM</label>
            <input type="radio" name="time" id="1pm" value="1:00PM" onChange={() => handleTimeChange("1:00PM")} />

            <label htmlFor="2pm">2:00PM</label>
            <input type="radio" name="time" id="2pm" value="2:00PM" onChange={() => handleTimeChange("2:00PM")} />

            <label htmlFor="3pm">3:00PM</label>
            <input type="radio" name="time" id="3pm" value="3:00PM" onChange={() => handleTimeChange("3:00PM")} />

            <label htmlFor="4pm">4:00AM</label>
            <input type="radio" name="time" id="4pm" value="4:00PM" onChange={() => handleTimeChange("4:00PM")} />

            <label htmlFor="5pm">5:00PM</label>
            <input type="radio" name="time" id="5pm" value="5:00PM" onChange={() => handleTimeChange("5:00PM")} />

            <label htmlFor="6pm">6:00PM</label>
            <input type="radio" name="time" id="6am" value="6:00PM" onChange={() => handleTimeChange("6:00PM")} />

            <label htmlFor="7pm">7:00PM</label>
            <input type="radio" name="time" id="7pm" value="7:00PM" onChange={() => handleTimeChange("7:00PM")} />

            <label htmlFor="8pm">8:00PM</label>
            <input type="radio" name="time" id="8pm" value="8:00PM" onChange={() => handleTimeChange("8:00PM")} />

          </div>

          <br /><br />
          
          <div className="notes">
            <p>You can send any additional notes to the service provider below:</p>
            <label htmlFor="notes">Notes:</label>
            <br />
            <textarea name="notes" id="notes" cols="30" rows="10" value={notes} onChange={handleNotesChange}></textarea>
          </div>
          <br />
          <button type="submit">Confirm Booking</button>
          
        </form>
      </div>
    </>
  );
}
export default BookingForm;