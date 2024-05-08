import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from './UserAvatar'; 
import "./Navbar.css";
import * as jwt_decode from "jwt-decode";

function CustomerNavbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt");

        if (token) {
            const decoded = jwt_decode.default(token);
            setUser(decoded);
        }
    }, []);

    return (
        <div className="home-navbar">
            <div className="left-section">
                <div className="logo">
                    <b>TaskCraft</b>
                </div>

                <div className="nav-searchbar">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>

            <div className="right-section">
                <div className="nav-links">
                    
                    <NavItem to="/customer">Home</NavItem>
                    <NavItem to="">Messages</NavItem>
                    <NavItem to="/customer_orders">Orders</NavItem>
                    <NavItem to ="/customer_bio">Details</NavItem>
                    
                    
                </div>

                <div className="nav-buttons">
                    <UserAvatar/>
                </div>
            </div>
        </div>
    );
}

function NavItem({ to, children }) {
    return (
        <Link to={to} className="nav-item">
            {children}
        </Link>
    );
}

export default CustomerNavbar;