import { useState } from 'react';
import { MapPin, Users, MessageCircle, UserPlus, UserCheck } from 'lucide-react';

export default function CommunityPage() {
  const [loggedInUser] = useState({ id: 1, name: 'John Doe' });
  const [connections, setConnections] = useState([2, 5]); // IDs of connected users
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock community users data
  const [users] = useState([
    {
      id: 2,
      name: 'Sarah Johnson',
      location: 'Ernakulam South, Kochi, Kerala, India',
      reportsCount: 12,
      avatar: 'SJ',
      status: 'Active Reporter'
    },
    {
      id: 3,
      name: 'Raj Kumar',
      location: 'Changampuzha Nagar, Pathadipalam, Edappal',
      reportsCount: 8,
      avatar: 'RK',
      status: 'Community Helper'
    },
    {
      id: 4,
      name: 'Priya Menon',
      location: 'Kochi, Kerala, India',
      reportsCount: 15,
      avatar: 'PM',
      status: 'Active Reporter'
    },
    {
      id: 5,
      name: 'Arun Nair',
      location: 'Ernakulam, Kerala, India',
      reportsCount: 6,
      avatar: 'AN',
      status: 'New Member'
    },
    {
      id: 6,
      name: 'Maya Krishnan',
      location: 'Thrissur, Kerala, India',
      reportsCount: 20,
      avatar: 'MK',
      status: 'Top Contributor'
    }
  ]);

  const handleConnect = (userId) => {
    if (connections.includes(userId)) {
      setConnections(connections.filter(id => id !== userId));
    } else {
      setConnections([...connections, userId]);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1a',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <Users size={32} color="#10b981" />
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: 0
          }}>Community</h1>
        </div>
        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          margin: 0
        }}>Connect with other community members and help make a difference together</p>
      </div>

      {/* Search Bar */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <input
          type="text"
          placeholder="Search community members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 20px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '12px',
            color: '#ffffff',
            fontSize: '16px',
            outline: 'none'
          }}
        />
      </div>

      {/* Users Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredUsers.map(user => {
          const isConnected = connections.includes(user.id);
          
          return (
            <div
              key={user.id}
              style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* User Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {/* Avatar */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}>
                  {user.avatar}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>{user.name}</h3>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    backgroundColor: '#0f172a',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#10b981'
                  }}>
                    {user.status}
                  </span>
                </div>
              </div>

              {/* Location */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '12px',
                color: '#94a3b8',
                fontSize: '14px'
              }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>{user.location}</span>
              </div>

              {/* Stats */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#0f172a',
                borderRadius: '8px'
              }}>
                <MessageCircle size={16} color="#10b981" />
                <span style={{ fontSize: '14px', color: '#cbd5e1' }}>
                  {user.reportsCount} reports submitted
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <button
                  onClick={() => handleConnect(user.id)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: isConnected ? '#0f172a' : '#10b981',
                    color: isConnected ? '#10b981' : '#ffffff',
                    border: isConnected ? '1px solid #10b981' : 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (isConnected) {
                      e.currentTarget.style.backgroundColor = '#1e293b';
                    } else {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isConnected ? '#0f172a' : '#10b981';
                  }}
                >
                  {isConnected ? (
                    <>
                      <UserCheck size={18} />
                      Connected
                    </>
                  ) : (
                    <>
                      <UserPlus size={18} />
                      Connect
                    </>
                  )}
                </button>
                
                <button
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10b981';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#334155';
                  }}
                >
                  <MessageCircle size={18} color="#10b981" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredUsers.length === 0 && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '60px 20px',
          color: '#64748b'
        }}>
          <Users size={48} style={{ marginBottom: '16px' }} />
          <p style={{ fontSize: '18px' }}>No community members found</p>
        </div>
      )}
    </div>
  );
}