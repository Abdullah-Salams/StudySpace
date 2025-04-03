import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState( '');
    const navigate = useNavigate();

    //temporary admin password for testing
    const handleLogin = async () => {
        if(!username || !password) {
            alert("Username/email and password are required.");
            return;
        }

        try {
            console.log("sending login data:", { usernameOrEmail: username, password });
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({usernameOrEmail: username, password}),
            });

            const data = await response.json();
            console.log("response from backend:", data);

            if (!response.ok) {
                alert(data.message || "Invalid Credentials");
                return;
            }

            alert("Login successful! Redirection...");
            navigate("/bookings");
        } catch (error) {
            alert("Error logging in. Try again.");
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
                placeholder="Username or Email"
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