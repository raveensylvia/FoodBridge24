import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

// Fix for default marker icon in Leaflet + React
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LocationPicker = ({ setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation(e.latlng);
    },
  });
  return null;
};

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    food_name: '',
    quantity: '',
    food_type: 'Veg',
    expiry_time: '',
    address: '',
    location_lat: 28.6139,
    location_lng: 77.2090
  });

  const [location, setLocation] = useState({ lat: 28.6139, lng: 77.2090 });

  useEffect(() => {
    fetchDonations();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, location_lat: location.lat, location_lng: location.lng }));
  }, [location]);

  const fetchDonations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/donations');
      setDonations(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/donations', formData);
      setShowForm(false);
      setFormData({
        food_name: '',
        quantity: '',
        food_type: 'Veg',
        expiry_time: '',
        address: '',
        location_lat: 28.6139,
        location_lng: 77.2090
      });
      fetchDonations();
    } catch (err) {
      alert('Error posting donation');
    }
  };

  return (
    <div className="container dashboard-container fade-in">
      <div className="dashboard-header">
        <h1>Donor Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : '+ Post New Donation'}
        </button>
      </div>

      {showForm && (
        <div className="donation-form card">
          <h3>Post Surplus Food</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Food Name</label>
                <input type="text" required value={formData.food_name} onChange={e => setFormData({...formData, food_name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input type="text" placeholder="e.g. 10 portions" required value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Food Type</label>
                <select value={formData.food_type} onChange={e => setFormData({...formData, food_type: e.target.value})}>
                  <option>Veg</option>
                  <option>Non-Veg</option>
                  <option>Bakery</option>
                  <option>Cooked Meal</option>
                </select>
              </div>
              <div className="form-group">
                <label>Expiry Time</label>
                <input type="text" placeholder="e.g. 4 hours" required value={formData.expiry_time} onChange={e => setFormData({...formData, expiry_time: e.target.value})} />
              </div>
            </div>
            
            <div className="form-group">
              <label>Pickup Address</label>
              <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div className="map-picker-container">
              <label>Pin Location on Map</label>
              <div className="map-wrapper">
                <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '200px', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[location.lat, location.lng]} />
                  <LocationPicker setLocation={setLocation} />
                </MapContainer>
              </div>
              <small>Click on the map to set pickup location</small>
            </div>

            <button type="submit" className="btn btn-secondary submit-btn">Post Donation</button>
          </form>
        </div>
      )}

      <div className="donations-section">
        <h2>Your Donation History</h2>
        {loading ? <p>Loading...</p> : (
          <div className="donations-list">
            {donations.length === 0 ? <p>No donations yet.</p> : donations.map(d => (
              <div key={d.id} className="donation-card-item card">
                <div className="d-info">
                  <h4>{d.food_name}</h4>
                  <p>Quantity: {d.quantity} | Type: {d.food_type}</p>
                  <p className="d-addr">📍 {d.address}</p>
                </div>
                <div className="d-status">
                  <span className={`status-pill ${d.status}`}>{d.status.toUpperCase()}</span>
                  <small>{new Date(d.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
