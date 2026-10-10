import React, { useState, useEffect } from 'react';
import '../styles/Locations.css';

function Locations({ onPageChange }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    county: '',
    city: '',
    type: 'store',
    startTime: '09:00',
    endTime: '17:00',
  });
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/locations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      } else {
        setError('Failed to fetch locations');
      }
    } catch (err) {
      setError('Error fetching locations: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.address || !formData.county || !formData.city) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          address: formData.address,
          county: formData.county,
          city: formData.city,
          type: formData.type,
          businessHours: {
            startTime: formData.startTime,
            endTime: formData.endTime,
          },
        }),
      });

      if (res.ok) {
        const newLocation = await res.json();
        setLocations((prev) => [...prev, newLocation]);
        setFormData({
          name: '',
          address: '',
          county: '',
          city: '',
          type: 'store',
          startTime: '09:00',
          endTime: '17:00',
        });
      } else {
        setError('Failed to create location');
      }
    } catch (err) {
      setError('Error creating location: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/locations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLocations((prev) => prev.filter((loc) => loc._id !== id));
      } else {
        setError('Failed to delete location');
      }
    } catch (err) {
      setError('Error deleting location: ' + err.message);
    }
  };

  return (
    <>
      <div
        style={{
          padding: '20px 30px',
          background: '#0a0e27',
          borderBottom: '1px solid #00d4ff',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <button
          onClick={() => onPageChange('dashboard')}
          style={{
            padding: '10px 20px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: '#00d4ff', margin: 0 }}>📍 Locații</h1>
      </div>

      <div className="locations-page">
        {error && <div className="error">{error}</div>}

        <div className="form-card">
          <h2>Adaugă Locație Nouă</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Nume Locație *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="ex: Magazin Cluj"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tip Locație *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="store">Magazin</option>
                  <option value="warehouse">Depozit</option>
                  <option value="office">Birou</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Adresă *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="ex: Strada Principală 123"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Județ *</label>
                <input
                  type="text"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  placeholder="ex: Cluj"
                  required
                />
              </div>
              <div className="form-group">
                <label>Oraș *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="ex: Cluj-Napoca"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Ora Deschidere</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Ora Închidere</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Adaugă Locație
            </button>
          </form>
        </div>

        <div className="locations-grid">
          {locations.length > 0 ? (
            locations.map((location) => (
              <div key={location._id} className="location-card">
                <div className="card-header">
                  <h3>{location.name}</h3>
                  <span className="type-badge">{location.type}</span>
                </div>
                <p className="address">📍 {location.address}</p>
                <p className="city">
                  {location.county}, {location.city}
                </p>
                <p className="hours">
                  🕐 {location.businessHours?.startTime || '09:00'} -{' '}
                  {location.businessHours?.endTime || '17:00'}
                </p>
                <div className="card-actions">
                  <button className="btn-edit">Editează</button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(location._id)}
                  >
                    Șterge
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty">Nu sunt locații adăugate</div>
          )}
        </div>
      </div>
    </>
  );
}

export default Locations;