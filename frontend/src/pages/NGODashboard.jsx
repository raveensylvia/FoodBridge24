import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

const NGODashboard = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
    const interval = setInterval(fetchDonations, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donations');
      setDonations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/donations/${id}/accept`);
      fetchDonations();
    } catch (err) {
      alert('Error accepting donation');
    }
  };

  const pendingDonations = donations.filter(d => d.status === 'pending');
  const myDonations = donations.filter(d => d.status !== 'pending');

  return (
    <div className="container dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>NGO Dashboard</h1>
        <p>View and claim available food donations near you.</p>
      </div>

      <div className="ngo-grid">
        <div className="map-section card">
          <MapContainer center={[28.6139, 77.2090]} zoom={11} style={{ height: '550px', width: '100%', borderRadius: '12px' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {pendingDonations.map(d => (
              <Marker key={d.id} position={[d.location_lat, d.location_lng]}>
                <Popup>
                  <div className="popup-content">
                    <h4>{d.food_name}</h4>
                    <p>Qty: {d.quantity}</p>
                    <p>Expiry: {d.expiry_time}</p>
                    <button className="btn btn-primary" style={{ padding: '5px 10px', marginTop: '10px' }} onClick={() => handleAccept(d.id)}>Accept</button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="sidebar">
          <h3 className="sidebar-title">Available Now ({pendingDonations.length})</h3>
          <div className="available-list">
            {pendingDonations.length === 0 ? <p>No pending donations.</p> : pendingDonations.map(d => (
              <div key={d.id} className="mini-card card">
                <h5>{d.food_name}</h5>
                <p>{d.quantity} | {d.food_type}</p>
                <p className="d-addr">📍 {d.address}</p>
                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '10px', padding: '8px' }} onClick={() => handleAccept(d.id)}>Claim Now</button>
              </div>
            ))}
          </div>

          <h3 className="sidebar-title" style={{ marginTop: '30px' }}>Your Accepted</h3>
          <div className="available-list">
            {myDonations.length === 0 ? <p>No accepted donations.</p> : myDonations.map(d => (
              <div key={d.id} className="mini-card card">
                <h5>{d.food_name}</h5>
                <span className={`status-pill ${d.status}`}>{d.status.toUpperCase()}</span>
                <p className="d-addr">📍 {d.address}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;
