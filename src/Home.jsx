import React from "react";
import './Home.css'
import {useNavigate} from 'react-router-dom'
import Navbar from "./Components/Navbar";

function Home() {
    return(
        <>
        <Navbar/>

        <div className="search-app">
            <div className="search-app-text">
                Need a service professional?<br />
                Get the job right with <b>TaskCraft</b>

                <br />
                <br />
                <input type="text" placeholder="What do you need help with?"/>
            </div>
        
            
            
        </div>

        <div>

        <div className="services">
            <b>Top Services</b>
        </div>


        <div className="service-list">

        <div>
        <div className="electricians">
            
        </div>
        <h2>Plumbers</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Electricians</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Painters</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Movers</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Lawn Care</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>House Cleaners</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Drivers</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Mechanics</h2>
    </div>

    <div>
        <div className="electricians">
            
        </div>
        <h2>Carpenters</h2>
    </div>
    </div>

        </div>

    <div>
        <div className="how-it-works">
            <h2>How it Works</h2>
        </div>

        <div className="headers">

        <div className="how-it-works-1">
        <h2>Search for a service provider</h2><br /><br />
        <h4>Find the perfect pro for your project</h4>
        </div>

        <div className="how-it-works-1">
        <h2>Send a message</h2><br /><br />
        <h4>Ask questions, get quotes, and book appointments</h4>
        </div>

        <div className="how-it-works-1">
        <h2>Pay online</h2><br /><br />
        <h4>Pay Securely and leave a review when the job is done</h4>
        </div>

        <div className="how-it-works-1">
        <h2>Leave a review</h2><br /><br />
        <h4>Help others find great pros by sharing your experience</h4>
        </div>
        
    </div>

    </div>


        <div className="Reviews">
            Reviews
        </div>


        </>
        
    )
}


export default Home;