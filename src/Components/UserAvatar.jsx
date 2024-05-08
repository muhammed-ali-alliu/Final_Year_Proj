import React, { useState } from 'react';
import Avatar from 'react-avatar';



const UserAvatar = () => {
    // Retrieve firstname and lastname from localStorage
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');

    if (!firstname || !lastname) {
        return null; // Return null if either first name or last name is missing
    }

    const initials = `${firstname.charAt(0)}${lastname.charAt(0)}`;

    const [showDropdown, setShowDropdown] = useState(false);
    

    const handleAvatarClick = () => {
        setShowDropdown(!showDropdown);
    }

    const handleProfileClick = () => {
        window.location.href = '/profile'
    }

    const handleLogoutClick = () => {
        localStorage.clear();
        window.location.href = '/'
        
    }

    return (
        <div>
            <Avatar
                name={initials}
                round={true}
                size='45'
                onClick={handleAvatarClick}
            />
            {showDropdown && (
                <div className="dropdown-menu">
                    <ul>
                        <li onClick={handleProfileClick}>Profile</li>
                        <li onClick={handleLogoutClick}>Logout</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserAvatar;
