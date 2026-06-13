import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import './Dashboard.css';

const VolunteerDashboard = () => {
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

  const handleAssign = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/donations/${id}/assign`);
      fetchDonations();
    } catch (err) {
      alert('Error claiming task');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/donations/${id}/status`, { status });
      fetchDonations();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const availableTasks = donations.filter(d => d.status === 'accepted');
  const myTasks = donations.filter(d => d.volunteer_id !== null);

  return (
    <div className="container dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Volunteer Dashboard</h1>
        <p>Your journey to help the community starts here.</p>
      </div>

      <div className="ngo-grid">
        <div className="sidebar">
          <h3 className="sidebar-title">Available Tasks</h3>
          <div className="available-list">
            {availableTasks.length === 0 ? <p>No tasks available for pickup.</p> : availableTasks.map(d => (
              <div key={d.id} className="mini-card card">
                <h5>{d.food_name}</h5>
                <p>{d.quantity} portions</p>
                <p className="d-addr">📍 {d.address}</p>
                <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={() => handleAssign(d.id)}>Start Delivery</button>
              </div>
            ))}
          </div>
        </div>

        <div className="tasks-section card">
          <h3 className="sidebar-title">My Current Missions</h3>
          <div className="donations-list">
            {myTasks.length === 0 ? <p>You haven't claimed any tasks yet.</p> : myTasks.map(d => (
              <div key={d.id} className="donation-card-item card">
                <div className="d-info">
                  <h4>{d.food_name}</h4>
                  <p>📍 {d.address}</p>
                  <p>Status: <strong style={{ color: 'var(--primary-orange)' }}>{d.status.toUpperCase()}</strong></p>
                </div>
                <div className="d-actions">
                  {d.status === 'assigned' && (
                    <button className="btn btn-secondary" onClick={() => updateStatus(d.id, 'picked')}>Mark as Picked</button>
                  )}
                  {d.status === 'picked' && (
                    <button className="btn btn-primary" onClick={() => updateStatus(d.id, 'delivered')}>Mark as Delivered</button>
                  )}
                  {d.status === 'delivered' && (
                    <span className="status-pill delivered">COMPLETED</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {myTasks.length > 0 && (
            <div className="map-wrapper" style={{ marginTop: '30px', height: '300px' }}>
              <MapContainer center={[28.6139, 77.2090]} zoom={12} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {myTasks.filter(t => t.status !== 'delivered').map(t => (
                  <Marker key={t.id} position={[t.location_lat, t.location_lng]} />
                ))}
              </MapContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
