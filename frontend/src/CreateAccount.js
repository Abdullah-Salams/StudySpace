import React, { useState } from 'react';
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

export default CreateAccount;