import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            alert('Username/email and password are required.');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail: username, password })
            });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message || 'Invalid Credentials');
                return;
            }
            localStorage.setItem('username', data.username);
            localStorage.setItem('fullName', data.fullName);
            localStorage.setItem('token', data.token);
            alert('Login successful!');
            navigate('/bookings');
        } catch {
            alert('Error logging in. Try again.');
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
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '30px',
                    borderRadius: '10px',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    textAlign: 'center',
                    zIndex: 1
                }}
            >
                <h2>Login</h2>
                <p>Login to view bookings</p>
                <input
                    type="text"
                    placeholder="Username or Email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                />
                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                >
                    Login
                </button>
                <button
                    onClick={handleCreateAccount}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Create Account
                </button>
            </div>
        </div>
    );
}

export default Landing;
