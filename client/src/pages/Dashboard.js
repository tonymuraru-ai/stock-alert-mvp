import React, { useState, useEffect } from 'react';
import '../styles/Dashboard.css';
import Sidebar from '../components/Sidebar';
import Locations from './Locations';

function Dashboard({ user, onLogout }) {
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    inStockCount: 0,
    totalLocations: 0,
  });
  const [stocks, setStocks] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    fetchKPIs();
    fetchStocks();
  }, []);

  const fetchKPIs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stocks/kpis', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setKpis(data);
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/stocks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStocks(data);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  // Show Locations page
  if (currentPage === 'locations') {
    return <Locations onPageChange={setCurrentPage} />;
  }

  // Show Products page (future)
  if (currentPage === 'products') {
    return (
      <div className="dashboard" style={{ padding: '30px' }}>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: '#00d4ff' }}>📦 Produse (Coming Soon)</h1>
      </div>
    );
  }

  // Show Stock page (future)
  if (currentPage === 'stock') {
    return (
      <div className="dashboard" style={{ padding: '30px' }}>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: '#00d4ff' }}>📊 Stocuri (Coming Soon)</h1>
      </div>
    );
  }

  // Show Reports page (future)
  if (currentPage === 'reports') {
    return (
      <div className="dashboard" style={{ padding: '30px' }}>
        <button
          onClick={() => setCurrentPage('dashboard')}
          style={{
            marginBottom: '20px',
            padding: '10px 20px',
            background: '#00d4ff',
            color: '#0a0e27',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: '#00d4ff' }}>📈 Rapoarte (Coming Soon)</h1>
      </div>
    );
  }

  // Default Dashboard
  return (
    <div className="dashboard">
      <Sidebar user={user} onLogout={onLogout} onPageChange={setCurrentPage} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>📊 Dashboard</h1>
          <p>Bine ai venit, {user?.fullName || 'User'}!</p>
        </div>

        <div className="kpi-cards">
          <div className="kpi-card">
            <div className="kpi-icon">📦</div>
            <div className="kpi-info">
              <p className="kpi-label">Total Produse</p>
              <p className="kpi-value">{kpis.totalProducts}</p>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">⚠️</div>
            <div className="kpi-info">
              <p className="kpi-label">Stoc Scăzut</p>
              <p className="kpi-value">{kpis.lowStockCount}</p>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">✅</div>
            <div className="kpi-info">
              <p className="kpi-label">În Stoc</p>
              <p className="kpi-value">{kpis.inStockCount}</p>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon">📍</div>
            <div className="kpi-info">
              <p className="kpi-label">Locații</p>
              <p className="kpi-value">{kpis.totalLocations}</p>
            </div>
          </div>
        </div>

        <div className="stock-overview">
          <h2>📋 Overview Stocuri</h2>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Locație</th>
                <th>Cantitate</th>
                <th>Prag Minim</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stocks.length > 0 ? (
                stocks.map((stock) => (
                  <tr key={stock._id}>
                    <td>{stock.product?.name || 'N/A'}</td>
                    <td>{stock.location?.name || 'N/A'}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.minThreshold}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          stock.quantity === 0
                            ? 'out-of-stock'
                            : stock.quantity < stock.minThreshold
                            ? 'low'
                            : 'ok'
                        }`}
                      >
                        {stock.quantity === 0
                          ? 'Out of Stock'
                          : stock.quantity < stock.minThreshold
                          ? 'Low'
                          : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                    Nu sunt stocuri disponibile
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;