import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
    const navigate = useNavigate();
    const fullName = localStorage.getItem('fullName');
    const displayName = fullName && fullName !== 'undefined' ? fullName : 'Profile';

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('fullName');
        localStorage.removeItem('token');
        navigate('/');
        setOpen(false);
    };

    // close on outside click
    useEffect(() => {
        const handleDocClick = e => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleDocClick);
        return () => document.removeEventListener('mousedown', handleDocClick);
    }, []);

    return (
        <div
            ref={wrapperRef}
            style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, rgba(106,168,255,0.75) 0%, rgba(176,210,255,0.75) 100%)',
                backdropFilter: 'blur(6px)',
                position: 'relative',
                zIndex: 1000,
                userSelect: 'none'
            }}
        >
            <div
                onClick={() => setOpen(prev => !prev)}
                style={{ cursor: 'pointer', fontWeight: 700, fontSize: 17, color: '#000' }}
            >
                {displayName}
            </div>

            {open && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: 24,
                        marginTop: 6,
                        background: 'rgba(255,255,255,0.9)',
                        borderRadius: 10,
                        minWidth: 160,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                        overflow: 'hidden',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <Link
                        to="/profile"
                        onClick={() => setOpen(false)}
                        style={{
                            display: 'block',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            color: '#333',
                            fontWeight: 500
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#f2f4f8')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        My Bookings
                    </Link>

                    <div
                        onClick={handleLogout}
                        style={{
                            padding: '12px 16px',
                            cursor: 'pointer',
                            color: '#e63946',
                            fontWeight: 500,
                            borderTop: '1px solid #eee'
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#fceaea')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavBar;
