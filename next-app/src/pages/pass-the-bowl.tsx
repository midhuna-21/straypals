import { useState } from 'react';
import { MapPin, Clock, User, Send, CheckCircle, XCircle, Bell, ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';

export default function PassTheBowlSystem() {
  const [currentPage, setCurrentPage] = useState('availability'); // availability, available-helpers, send-request, requests
  const [userAvailability, setUserAvailability] = useState({
    isAvailable: true,
    location: 'Ernakulam, Kochi, Kerala',
    radius: '5km'
  });

  const [selectedHelper, setSelectedHelper] = useState(null);
  const [helpRequest, setHelpRequest] = useState({
    strayName: '',
    taskType: '',
    location: '',
    urgency: 'normal',
    description: '',
    photo: null,
    photoPreview: null
  });

  const [requests, setRequests] = useState([
    {
      id: 1,
      from: 'Sarah Johnson',
      fromAvatar: 'SJ',
      strayName: 'Brown puppy',
      taskType: 'Feeding',
      location: 'Ernakulam Market, Kochi',
      urgency: 'urgent',
      description: 'Found an injured puppy that needs immediate food and water',
      time: '10 mins ago',
      status: 'pending',
      photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
    },
    {
      id: 2,
      from: 'Raj Kumar',
      fromAvatar: 'RK',
      strayName: 'White cat',
      taskType: 'Medical Help',
      location: 'MG Road, Kochi',
      urgency: 'normal',
      description: 'Cat seems to have minor injury, needs checking',
      time: '1 hour ago',
      status: 'pending',
      photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
    }
  ]);

  const [availableHelpers] = useState([
    {
      id: 1,
      name: 'Priya Menon',
      avatar: 'PM',
      location: 'Ernakulam South, Kochi',
      distance: '1.2 km',
      availableSince: '2 hours ago',
      tasksCompleted: 15,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Arun Nair',
      avatar: 'AN',
      location: 'Kakkanad, Kochi',
      distance: '3.5 km',
      availableSince: '30 mins ago',
      tasksCompleted: 8,
      rating: 4.5
    },
    {
      id: 3,
      name: 'Maya Krishnan',
      avatar: 'MK',
      location: 'Edappally, Kochi',
      distance: '4.8 km',
      availableSince: '1 hour ago',
      tasksCompleted: 22,
      rating: 4.9
    }
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHelpRequest({
        ...helpRequest,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSendRequest = () => {
    if (!helpRequest.strayName || !helpRequest.taskType || !helpRequest.location || !helpRequest.description) {
      alert('Please fill all required fields');
      return;
    }

    const newRequest = {
      id: Date.now(),
      from: 'You',
      fromAvatar: 'YO',
      strayName: helpRequest.strayName,
      taskType: helpRequest.taskType,
      location: helpRequest.location,
      urgency: helpRequest.urgency,
      description: helpRequest.description,
      time: 'Just now',
      status: 'sent',
      photo: helpRequest.photoPreview
    };

    alert(`Request sent to ${selectedHelper.name}!`);
    setCurrentPage('available-helpers');
    setHelpRequest({
      strayName: '',
      taskType: '',
      location: '',
      urgency: 'normal',
      description: '',
      photo: null,
      photoPreview: null
    });
  };

  const handleRequestAction = (requestId, action) => {
    setRequests(requests.map(req => 
      req.id === requestId ? { ...req, status: action } : req
    ));
  };

  // Availability Status Page
  const AvailabilityPage = () => (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>Your Availability Status</h2>

        {/* Toggle Availability */}
        <div style={{
          backgroundColor: userAvailability.isAvailable ? '#10b98120' : '#0f172a',
          border: `2px solid ${userAvailability.isAvailable ? '#10b981' : '#334155'}`,
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: userAvailability.isAvailable ? '#10b981' : '#64748b'
              }} />
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: userAvailability.isAvailable ? '#10b981' : '#94a3b8'
              }}>
                {userAvailability.isAvailable ? 'Available to Help' : 'Not Available'}
              </span>
            </div>
            
            <button
              onClick={() => setUserAvailability({
                ...userAvailability,
                isAvailable: !userAvailability.isAvailable
              })}
              style={{
                padding: '8px 20px',
                backgroundColor: userAvailability.isAvailable ? '#ef4444' : '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {userAvailability.isAvailable ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
          
          {userAvailability.isAvailable && (
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              Others can send you help requests for strays in your area
            </p>
          )}
        </div>

        {/* Location Settings */}
        {userAvailability.isAvailable && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#cbd5e1'
              }}>Your Location</label>
              <input
                type="text"
                value={userAvailability.location}
                onChange={(e) => setUserAvailability({
                  ...userAvailability,
                  location: e.target.value
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#cbd5e1'
              }}>Help Radius</label>
              <select
                value={userAvailability.radius}
                onChange={(e) => setUserAvailability({
                  ...userAvailability,
                  radius: e.target.value
                })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
              >
                <option value="2km">Within 2 km</option>
                <option value="5km">Within 5 km</option>
                <option value="10km">Within 10 km</option>
                <option value="15km">Within 15 km</option>
              </select>
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px'
      }}>
        <button
          onClick={() => setCurrentPage('available-helpers')}
          style={{
            padding: '16px',
            backgroundColor: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
        >
          Find Helpers
        </button>
        
        <button
          onClick={() => setCurrentPage('requests')}
          style={{
            padding: '16px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            position: 'relative',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
        >
          My Requests
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {requests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  // Available Helpers Page
  const AvailableHelpersPage = () => (
    <div style={{
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <button
        onClick={() => setCurrentPage('availability')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#10b981',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h2 style={{
        margin: '0 0 8px 0',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>Available Helpers Near You</h2>
      <p style={{
        margin: '0 0 24px 0',
        color: '#94a3b8',
        fontSize: '16px'
      }}>Send a help request to available community members</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px'
      }}>
        {availableHelpers.map(helper => (
          <div
            key={helper.id}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '20px',
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
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 'bold',
                position: 'relative'
              }}>
                {helper.avatar}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '14px',
                  height: '14px',
                  backgroundColor: '#10b981',
                  border: '2px solid #1e293b',
                  borderRadius: '50%'
                }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{
                  margin: '0 0 4px 0',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>{helper.name}</h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '13px',
                  color: '#94a3b8'
                }}>
                  <Clock size={14} />
                  Available {helper.availableSince}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '12px',
              fontSize: '14px',
              color: '#94a3b8'
            }}>
              <MapPin size={16} color="#10b981" />
              {helper.location} • {helper.distance} away
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '16px',
              fontSize: '13px'
            }}>
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#0f172a',
                borderRadius: '6px',
                color: '#cbd5e1'
              }}>
                ⭐ {helper.rating}
              </div>
              <div style={{
                padding: '8px 12px',
                backgroundColor: '#0f172a',
                borderRadius: '6px',
                color: '#cbd5e1'
              }}>
                ✓ {helper.tasksCompleted} tasks
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedHelper(helper);
                setCurrentPage('send-request');
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              <Send size={16} />
              Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // Send Request Page
  const SendRequestPage = () => (
    <div style={{
      maxWidth: '700px',
      margin: '0 auto'
    }}>
      <button
        onClick={() => setCurrentPage('available-helpers')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#10b981',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div style={{
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h2 style={{
          margin: '0 0 8px 0',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>Send Help Request</h2>
        <p style={{
          margin: '0 0 20px 0',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          Requesting help from <strong style={{ color: '#10b981' }}>{selectedHelper?.name}</strong>
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Stray Name */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>Stray Name/Description *</label>
            <input
              type="text"
              value={helpRequest.strayName}
              onChange={(e) => setHelpRequest({ ...helpRequest, strayName: e.target.value })}
              placeholder="e.g., Brown puppy, White cat"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Task Type */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>Task Type *</label>
            <select
              value={helpRequest.taskType}
              onChange={(e) => setHelpRequest({ ...helpRequest, taskType: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              <option value="">Select task type</option>
              <option value="Feeding">Feeding</option>
              <option value="Medical Help">Medical Help</option>
              <option value="Rescue">Rescue</option>
              <option value="Shelter">Shelter</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>Location *</label>
            <input
              type="text"
              value={helpRequest.location}
              onChange={(e) => setHelpRequest({ ...helpRequest, location: e.target.value })}
              placeholder="e.g., Ernakulam Market, Kochi"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Urgency */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>Urgency Level</label>
            <div style={{
              display: 'flex',
              gap: '12px'
            }}>
              {['normal', 'urgent', 'emergency'].map(level => (
                <button
                  key={level}
                  onClick={() => setHelpRequest({ ...helpRequest, urgency: level })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: helpRequest.urgency === level ? 
                      (level === 'emergency' ? '#ef4444' : level === 'urgent' ? '#f59e0b' : '#10b981') : 
                      '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${helpRequest.urgency === level ? 'transparent' : '#334155'}`,
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>Description *</label>
            <textarea
              value={helpRequest.description}
              onChange={(e) => setHelpRequest({ ...helpRequest, description: e.target.value })}
              placeholder="Describe the situation and what help is needed..."
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#cbd5e1'
            }}>Photo (Optional)</label>
            
            {helpRequest.photoPreview ? (
              <div style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                <img
                  src={helpRequest.photoPreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover'
                  }}
                />
                <button
                  onClick={() => setHelpRequest({ ...helpRequest, photo: null, photoPreview: null })}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <XCircle size={20} color="#ffffff" />
                </button>
              </div>
            ) : (
              <label style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                backgroundColor: '#0f172a',
                border: '2px dashed #334155',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <MapPin size={24} color="#94a3b8" style={{ marginBottom: '8px' }} />
                <span style={{
                  fontSize: '14px',
                  color: '#94a3b8'
                }}>Click to upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSendRequest}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            <Send size={18} />
            Send Help Request
          </button>
        </div>
      </div>
    </div>
  );

  // Requests Page
  const RequestsPage = () => (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <button
        onClick={() => setCurrentPage('availability')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#10b981',
          fontSize: '16px',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <h2 style={{
        margin: '0 0 8px 0',
        fontSize: '28px',
        fontWeight: 'bold'
      }}>Help Requests</h2>
      <p style={{
        margin: '0 0 24px 0',
        color: '#94a3b8',
        fontSize: '16px'
      }}>Requests from community members who need your help</p>

      {requests.length === 0 ? (
        <div style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <Bell size={48} color="#64748b" style={{ marginBottom: '16px' }} />
          <p style={{
            fontSize: '16px',
            color: '#94a3b8',
            margin: 0
          }}>No help requests yet</p>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {requests.map(request => (
            <div
              key={request.id}
              style={{
                backgroundColor: '#1e293b',
                border: `2px solid ${request.urgency === 'emergency' ? '#ef4444' : request.urgency === 'urgent' ? '#f59e0b' : '#334155'}`,
                borderRadius: '12px',
                padding: '20px',
                opacity: request.status !== 'pending' ? 0.6 : 1
              }}
            >
              {/* Urgency Badge */}
              {request.urgency !== 'normal' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  backgroundColor: request.urgency === 'emergency' ? '#ef444420' : '#f59e0b20',
                  border: `1px solid ${request.urgency === 'emergency' ? '#ef4444' : '#f59e0b'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: request.urgency === 'emergency' ? '#ef4444' : '#f59e0b',
                  marginBottom: '12px',
                  textTransform: 'uppercase'
                }}>
                  <AlertCircle size={14} />
                  {request.urgency}
                </div>
              )}

              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px'
              }}>
                {/* Photo */}
                {request.photo && (
                  <img
                    src={request.photo}
                    alt={request.strayName}
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      flexShrink: 0
                    }}
                  />
                )}

                {/* Content */}
                <div style={{ flex: 1 }}>
                  {/* From User */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {request.fromAvatar}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#cbd5e1'
                      }}>{request.from}</div>
                      <div style={{
                        fontSize: '12px',
                        color: '#94a3b8'
                      }}>{request.time}</div>
                    </div>
                  </div>

                  {/* Stray Info */}
                  <h3 style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>{request.strayName}</h3>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '8px',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      padding: '4px 10px',
                      backgroundColor: '#0f172a',
                      borderRadius: '6px',
                      fontSize: '13px',
                      color: '#10b981',
                      fontWeight: '600'
                    }}>
                      {request.taskType}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      color: '#94a3b8'
                    }}>
                      <MapPin size={14} />
                      {request.location}
                    </span>
                  </div>

                  <p style={{
                    margin: '0',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#cbd5e1'
                  }}>{request.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  <button
                    onClick={() => handleRequestAction(request.id, 'accepted')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                  >
                    <CheckCircle size={18} />
                    Accept & Help
                  </button>
                  
                  <button
                    onClick={() => handleRequestAction(request.id, 'declined')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: '#0f172a',
                      color: '#cbd5e1',
                      border: '1px solid #334155',
                      borderRadius: '8px',
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
                      e.currentTarget.style.borderColor = '#ef4444';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#334155';
                      e.currentTarget.style.color = '#cbd5e1';
                    }}
                  >
                    <XCircle size={18} />
                    Decline
                  </button>
                </div>
              )}

              {/* Status Badge */}
              {request.status !== 'pending' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: request.status === 'accepted' ? '#10b98120' : '#ef444420',
                  border: `1px solid ${request.status === 'accepted' ? '#10b981' : '#ef4444'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: request.status === 'accepted' ? '#10b981' : '#ef4444'
                }}>
                  {request.status === 'accepted' ? (
                    <>
                      <CheckCircle size={18} />
                      Request Accepted
                    </>
                  ) : (
                    <>
                      <XCircle size={18} />
                      Request Declined
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
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
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <MessageSquare size={32} color="#10b981" />
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            margin: 0
          }}>Pass the Bowl</h1>
        </div>
        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          margin: 0
        }}>Connect with nearby helpers to save strays together</p>
      </div>

      {/* Page Content */}
      {currentPage === 'availability' && <AvailabilityPage />}
      {currentPage === 'available-helpers' && <AvailableHelpersPage />}
      {currentPage === 'send-request' && <SendRequestPage />}
      {currentPage === 'requests' && <RequestsPage />}
    </div>
  );
}