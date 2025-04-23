import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const fullName = localStorage.getItem('fullName');
    const displayName = fullName && fullName !== 'undefined' ? fullName : 'Profile';
    const [showDropdown, setShowDropdown] = useState(false);

    const wrapperRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('token');
        navigate('/');
        setShowDropdown(false);
    };

    useEffect(() => {
        const handleClickOutside = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'linear-gradient(90deg,#6db3ff 0%,#9be1ff 100%)',
                position: 'relative',
                userSelect: 'none'
            }}
        >
            <div
                style={{ cursor: 'pointer', fontWeight: '700', fontSize: '17px', color: '#000' }}
                onClick={() => setShowDropdown(prev => !prev)}
            >
                {displayName}
            </div>

            {showDropdown && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: '24px',
                        background: '#fff',
                        borderRadius: '10px',
                        minWidth: '160px',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        zIndex: 10
                    }}
                >
                    <Link
                        to="/profile"
                        style={{
                            display: 'block',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            color: '#333',
                            fontWeight: '500'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f2f4f8')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        onClick={() => setShowDropdown(false)}
                    >
                        My Bookings
                    </Link>

                    <div
                        style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            color: '#e63946',
                            fontWeight: '500',
                            borderTop: '1px solid #eee'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fceaea')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
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
