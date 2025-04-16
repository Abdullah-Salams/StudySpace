/*import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';

function CreateAccount() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        try {
            console.log("Sending Data:", formData);
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log("Response from backend:", data);

            if (!response.ok) {
                setError(data.message || "Registration Failed");
                return;
            }

            alert("Registration Successful! Redirecting to Login.");
            navigate("/");
        } catch (err) {
            console.error("Registration Error:", err);
            setError("An error occurred. Try Again");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h2>Create an Account</h2>
            {error && <p style={{ color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    />
                <br />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    />
                <br />
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    />
                <br />
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                <br />
                <input
                    type="text"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                <br />
                <input
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />
                <br />
                <button type="submit">Register</button>
            </form>
            <br />
            <button onClick={() => navigate("/")}>Back to Login</button>
        </div>
    );
}

export default CreateAccount; */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateAccount() {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        confirm_password: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Registration Failed");
                return;
            }

            alert("Registration Successful! Redirecting to Login.");
            navigate("/");
        } catch (err) {
            console.error("Registration Error:", err);
            setError("An error occurred. Try Again");
        }
    };

    return (
        <div style={{
            backgroundImage: `url("https://upload.wikimedia.org/wikipedia/en/thumb/0/08/Nova_Library_West.JPG/1200px-Nova_Library_West.JPG")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '30px',
                borderRadius: '10px',
                maxWidth: '450px',
                width: '90%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '10px' }}>Create Account</h2>
                <p style={{ marginBottom: '20px' }}>Join Study Space to manage your bookings</p>

                {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
                    />
                    <input
                        type="password"
                        name="confirm_password"
                        placeholder="Confirm Password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                    />
                    <button
                        type="submit"
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
                        Register
                    </button>
                </form>
                <button
                    onClick={() => navigate("/")}
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
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default CreateAccount;

