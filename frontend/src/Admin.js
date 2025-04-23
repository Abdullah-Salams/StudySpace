import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        if (username !== 'admin') navigate('/');
    }, [username, navigate]);

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
        @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes sweep{0%{background:linear-gradient(145deg,#0077be 0%,#003f5c 100%);color:#fff}100%{background:#28a745;color:#fff}}`;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    const spinner = (
        <div
            style={{
                border:'6px solid rgba(255,255,255,0.2)',
                borderTop:'6px solid #29abe2',
                borderRadius:'50%',
                width:50,
                height:50,
                animation:'spin 1s linear infinite',
                margin:'80px auto'
            }}
        />
    );

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await fetch('http://127.0.0.1:5000/bookings', {
                headers:{Authorization:`Bearer ${token}`}
            });
            const data = await resp.json();
            resp.ok ? setBookings(data.bookings) : setError(data.error || 'Error.');
        } catch {
            setError('Error.');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchBookings();
    }, [token, fetchBookings]);

    const removeBooking = async id => {
        setProcessingId(id);
        try {
            const resp = await fetch(`http://127.0.0.1:5000/bookings/${id}`, {
                method:'DELETE',
                headers:{Authorization:`Bearer ${token}`}
            });
            if (resp.ok) setBookings(prev => prev.filter(b => b._id !== id));
        } catch {}
        setProcessingId(null);
    };

    const cardBase = {
        padding:20,
        borderRadius:'14px 14px 40px 40px',
        background:'linear-gradient(145deg,#0077be 0%,#003f5c 100%)',
        color:'#fff',
        marginBottom:18,
        boxShadow:'0 4px 12px rgba(0,0,0,0.25)',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
        transition:'transform 0.12s'
    };

    return (
        <div
            style={{
                backgroundImage:'url("https://bpb-us-e1.wpmucdn.com/sites.nova.edu/dist/c/2/files/2016/01/DSC_00371.jpg")',
                backgroundSize:'cover',
                backgroundPosition:'center',
                minHeight:'100vh',
                position:'relative'
            }}
        >
            <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.45)'}}></div>

            <div style={{position:'relative',zIndex:1,maxWidth:1000,margin:'0 auto',padding:'40px 24px'}}>
                <h1 style={{textAlign:'center',marginBottom:30,fontSize:36,color:'#fff'}}>Admin Panel</h1>

                {loading?spinner:error?(
                    <p style={{color:'red',textAlign:'center'}}>{error}</p>
                ):bookings.length===0?(
                    <p style={{textAlign:'center',color:'#fff',fontSize:18}}>No current bookings.</p>
                ):(
                    bookings.map(b=>{
                        const busy = processingId===b._id;
                        return (
                            <div
                                key={b._id}
                                style={{
                                    ...cardBase,
                                    animation:busy?'sweep 0.8s forwards':undefined
                                }}
                            >
                                <div style={{lineHeight:1.4}}>
                                    <p style={{margin:0,fontSize:20,fontWeight:700}}>
                                        🦈 {b.room} | Floor {b.floor}
                                    </p>
                                    <p style={{margin:0,fontSize:17}}>
                                        {b.bookingDate} at {b.bookingTime}
                                    </p>
                                    <p style={{margin:0,fontSize:15}}>
                                        By: {b.fullName||b.userName}
                                    </p>
                                </div>

                                {busy?(
                                    <div style={{fontSize:18}}>Processing…</div>
                                ):(
                                    <div style={{display:'flex',gap:10}}>
                                        <button
                                            style={{
                                                background:'#d9534f',
                                                border:'none',
                                                color:'#fff',
                                                borderRadius:8,
                                                padding:'8px 14px',
                                                fontWeight:600,
                                                cursor:'pointer'
                                            }}
                                            onClick={()=>removeBooking(b._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            style={{
                                                background:'#5cb85c',
                                                border:'none',
                                                color:'#fff',
                                                borderRadius:8,
                                                padding:'8px 14px',
                                                fontWeight:600,
                                                cursor:'pointer'
                                            }}
                                            onClick={()=>removeBooking(b._id)}
                                        >
                                            Check&nbsp;In
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default Admin;
