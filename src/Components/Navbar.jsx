import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
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
                    <NavItem to="/">Home</NavItem>
                    <NavItem to="">About</NavItem>
                    <NavItem to="/contact">Contact Us</NavItem>
                </div>

                <div className="nav-buttons">
                    <li>
                        <Link to="/signup"><button>Sign up</button></Link>
                        <Link to="/login"><button>Login</button></Link>
                    </li>
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

export default Navbar;
