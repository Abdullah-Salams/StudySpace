import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState( '');
    const navigate = useNavigate();

    //temporary admin password for testing
    const handleLogin = () => {
        if(username === "admin" && password === "password") {
            navigate('/bookings');
        }
        else
        {
            alert("Invalid Credentials");
        }
    };

    const handleCreateAccount = () => {
        navigate('/create-account');
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <p>Please Login to navigate to the bookings page</p>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
        />
            <br />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            <br />
            <button onClick={handleLogin}>Login</button>
            <br /><br />
            <button onClick={handleCreateAccount}>Create Account</button>
        </div>
    );
}

export default Landing;