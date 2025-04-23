import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'error' | 'success'
    const navigate = useNavigate();

    // inject spinner keyframes once
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const spinnerStyle = {
        border: '4px solid rgba(0,0,0,0.1)',
        borderTop: '4px solid #1e90ff',
        borderRadius: '50%',
        width: 40,
        height: 40,
        animation: 'spin 1s linear infinite',
        margin: '25px auto'
    };

    const btnBase = {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: 6,
        color: '#fff',
        fontWeight: 600,
        cursor: 'pointer',
        background: 'linear-gradient(45deg,#6db3ff,#1e90ff)',
        transition: 'background 0.25s, transform 0.15s'
    };

    const handleLogin = async () => {
        if (!username || !password) {
            setMessage({ text: 'Username/email and password are required.', type: 'error' });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const resp = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail: username, password })
            });
            const data = await resp.json();
            if (!resp.ok) {
                setMessage({ text: data.message || 'Invalid credentials.', type: 'error' });
            } else {
                localStorage.setItem('username', data.username);
                localStorage.setItem('fullName', data.fullName);
                localStorage.setItem('token', data.token);
                setMessage({ text: 'Login successful! Redirecting…', type: 'success' });
                setTimeout(() => navigate('/bookings'), 600);
            }
        } catch {
            setMessage({ text: 'Error logging in. Try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = () => navigate('/create-account');

    return (
        <div
            style={{
                backgroundImage:
                    'url("https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Nova_Library_West.JPG/1200px-Nova_Library_West.JPG")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)'
                }}
            ></div>

            <div
                style={{
                    background: 'rgba(255,255,255,0.92)',
                    padding: '40px 32px',
                    borderRadius: 12,
                    maxWidth: 420,
                    width: '90%',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    zIndex: 1
                }}
            >
                <h2 style={{ marginBottom: 8, fontSize: 28, fontWeight: 700 }}>Study Room Portal</h2>
                <p style={{ marginBottom: 24, color: '#555' }}>Sign in to continue</p>

                <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: 14,
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        fontSize: 15
                    }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: 24,
                        border: '1px solid #ccc',
                        borderRadius: 6,
                        fontSize: 15
                    }}
                />

                {loading ? (
                    <div style={spinnerStyle}></div>
                ) : (
                    <>
                        <button
                            style={btnBase}
                            onMouseEnter={e =>
                                (e.currentTarget.style.background = 'linear-gradient(45deg,#84c8ff,#3aa2ff)')
                            }
                            onMouseLeave={e =>
                                (e.currentTarget.style.background = 'linear-gradient(45deg,#6db3ff,#1e90ff)')
                            }
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                        <button
                            style={{ ...btnBase, marginTop: 12 }}
                            onMouseEnter={e =>
                                (e.currentTarget.style.background = 'linear-gradient(45deg,#84c8ff,#3aa2ff)')
                            }
                            onMouseLeave={e =>
                                (e.currentTarget.style.background = 'linear-gradient(45deg,#6db3ff,#1e90ff)')
                            }
                            onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.97)')}
                            onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
                            onClick={handleCreateAccount}
                        >
                            Create Account
                        </button>
                    </>
                )}

                {message.text && (
                    <p
                        style={{
                            marginTop: 20,
                            color: message.type === 'success' ? '#28a745' : '#e63946',
                            fontWeight: 500
                        }}
                    >
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Landing;
