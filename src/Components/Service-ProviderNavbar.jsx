import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import UserAvatar from './UserAvatar'; // Import your UserAvatar component
import "./Navbar.css";
import * as jwt_decode from "jwt-decode";

function Service_ProvierNavbar() {
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

               
            </div>

            <div className="right-section">
                <div className="nav-links">
                    <NavItem to="/service-provider">Dasboard</NavItem>
                    <NavItem to="/orders">Orders</NavItem>
                    {/* <NavItem to="">Calender</NavItem>
                    <NavItem to="">Payments</NavItem> */}
                    <NavItem to="/messages">Messages</NavItem>
                    <NavItem to="/bio">Bio</NavItem>
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

export default Service_ProvierNavbar;
