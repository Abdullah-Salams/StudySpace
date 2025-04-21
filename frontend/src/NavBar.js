import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const fullName = localStorage.getItem('fullName');
    const displayName = fullName && fullName !== 'undefined' ? fullName : 'Profile';
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '10px',
                backgroundColor: '#f5f5f5',
                position: 'relative'
            }}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            <div style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
                {displayName}
            </div>
            {showDropdown && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        zIndex: 1,
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    <div style={{ padding: '10px' }}>
                        <Link to="/profile" style={{ textDecoration: 'none', color: 'black' }}>
                            My Bookings
                        </Link>
                    </div>
                    <div
                        style={{
                            padding: '10px',
                            borderTop: '1px solid #ccc',
                            cursor: 'pointer'
                        }}
                        onClick={handleLogout}
                    >
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavBar;
