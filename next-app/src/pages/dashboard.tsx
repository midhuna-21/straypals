'use client';

import { 
  TrendingUp, TrendingDown, Users, MapPin, Heart, 
  AlertTriangle, Clock, PawPrint
} from 'lucide-react';
import { useState } from 'react';

export default function StrayCareDashboard() {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { title: 'Active Stations', value: 247, change: 12, icon: <MapPin color="#3b82f6" />, trend: 'up' },
    { title: 'Volunteers', value: 1834, change: 8, icon: <Users color="#22c55e" />, trend: 'up' },
    { title: 'Strays Needing Help', value: 892, change: -5, icon: <AlertTriangle color="#ef4444" />, trend: 'down' },
    { title: 'Strays Helped (MTD)', value: 3421, change: 15, icon: <Heart color="#f59e0b" />, trend: 'up' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🐾 Stray Care Dashboard</h1>
        <div className="time-selector">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              className={`time-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-grid">
        {stats.map((stat, i) => (
          <div key={i} className="metric-card">
            <div className="metric-header">
              <div className="metric-icon">{stat.icon}</div>
              <div className={`trend-badge ${stat.trend}`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <div className="metric-value">{stat.value.toLocaleString()}</div>
            <div className="metric-label">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <PawPrint size={18} color="#3b82f6" />
            <span>Rescued 3 dogs near Central Park</span>
            <span className="time"><Clock size={12} /> 10m ago</span>
          </div>
          <div className="activity-item">
            <Heart size={18} color="#f59e0b" />
            <span>2 strays adopted from Queens</span>
            <span className="time"><Clock size={12} /> 1h ago</span>
          </div>
          <div className="activity-item">
            <Users size={18} color="#22c55e" />
            <span>New volunteer joined Bronx team</span>
            <span className="time"><Clock size={12} /> 2h ago</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #0a0a0a;
          color: #f9fafb;
          padding: 32px 24px;
          font-family: 'Roboto', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        h1 {
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
        }

        .time-selector {
          display: flex;
          gap: 8px;
          background: #1f1f1f;
          padding: 4px;
          border-radius: 8px;
        }

        .time-btn {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #9ca3af;
          font-size: 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .time-btn.active {
          background: #2563eb;
          color: white;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .metric-card {
          background: #111;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #1f2937;
          transition: 0.3s;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: #2563eb;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .metric-icon {
          background: #1f1f1f;
          padding: 10px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .trend-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .trend-badge.up {
          background: #064e3b;
          color: #34d399;
        }

        .trend-badge.down {
          background: #7f1d1d;
          color: #fca5a5;
        }

        .metric-value {
          font-size: 30px;
          font-weight: 700;
          color: #fff;
        }

        .metric-label {
          font-size: 13px;
          color: #9ca3af;
        }

        .activity-section {
          background: #111;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #1f2937;
        }

        .activity-section h2 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #f3f4f6;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #1a1a1a;
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid #1f2937;
          color: #d1d5db;
          font-size: 14px;
        }

        .activity-item span {
          flex: 1;
          margin-left: 10px;
        }

        .time {
          font-size: 12px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
