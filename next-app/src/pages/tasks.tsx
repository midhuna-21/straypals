import { useState } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, MapPin, Calendar, Plus, X, Upload } from 'lucide-react';

export default function Tasks() {
  const [expandedTask, setExpandedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    taskName: '',
    description: '',
    strayDetails: '',
    location: '',
    photo: null,
    photoPreview: null
  });

  const [tasks, setTasks] = useState([
    {
      id: 1,
      taskName: 'Fed stray dogs near Market',
      completedBy: [
        {
          userId: 1,
          userName: 'Sarah Johnson',
          avatar: 'SJ',
          date: '2025-11-08',
          description: 'Provided food and water to 5 stray dogs',
          strayDetails: '3 puppies and 2 adult dogs',
          location: 'Ernakulam Market, Kochi, Kerala',
          photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
        },
        {
          userId: 2,
          userName: 'Raj Kumar',
          avatar: 'RK',
          date: '2025-11-07',
          description: 'Fed and gave water to street dogs',
          strayDetails: '4 adult dogs',
          location: 'Ernakulam Market Area',
          photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'
        }
      ]
    },
    {
      id: 2,
      taskName: 'Rescued injured cat',
      completedBy: [
        {
          userId: 3,
          userName: 'Priya Menon',
          avatar: 'PM',
          date: '2025-11-09',
          description: 'Found injured cat and took to veterinary clinic',
          strayDetails: 'White cat with injured paw',
          location: 'Changampuzha Nagar, Edappal',
          photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400'
        }
      ]
    },
    {
      id: 3,
      taskName: 'Cleaned feeding area',
      completedBy: [
        {
          userId: 4,
          userName: 'Arun Nair',
          avatar: 'AN',
          date: '2025-11-10',
          description: 'Cleaned and organized community feeding spot',
          strayDetails: 'Area used by 8+ strays',
          location: 'Kochi Beach Road',
          photo: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400'
        }
      ]
    },
    {
      id: 4,
      taskName: 'Vaccination drive participation',
      completedBy: [
        {
          userId: 5,
          userName: 'Maya Krishnan',
          avatar: 'MK',
          date: '2025-11-06',
          description: 'Helped with community vaccination drive',
          strayDetails: '12 dogs vaccinated',
          location: 'Thrissur Community Center',
          photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400'
        }
      ]
    }
  ]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewTask({
        ...newTask,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleAddTask = () => {
    if (!newTask.taskName || !newTask.description || !newTask.strayDetails || !newTask.location) {
      alert('Please fill all required fields');
      return;
    }

    const task = {
      id: tasks.length + 1,
      taskName: newTask.taskName,
      completedBy: [
        {
          userId: 999,
          userName: 'You',
          avatar: 'YO',
          date: new Date().toISOString().split('T')[0],
          description: newTask.description,
          strayDetails: newTask.strayDetails,
          location: newTask.location,
          photo: newTask.photoPreview || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400'
        }
      ]
    };

    setTasks([task, ...tasks]);
    setShowAddModal(false);
    setNewTask({
      taskName: '',
      description: '',
      strayDetails: '',
      location: '',
      photo: null,
      photoPreview: null
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0f1a',
      color: '#ffffff',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        marginBottom: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle size={32} color="#10b981" />
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              margin: 0
            }}>Community Tasks</h1>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            <Plus size={20} />
            Add Your Task
          </button>
        </div>
        <p style={{
          color: '#94a3b8',
          fontSize: '16px',
          margin: 0
        }}>See what tasks community members have completed</p>
      </div>

      {/* Tasks List */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '12px',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Task Header */}
            <div
              onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d3b52'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <CheckCircle size={24} color="#10b981" />
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: '18px',
                    fontWeight: '600',
                    marginBottom: '4px'
                  }}>{task.taskName}</h3>
                  <span style={{
                    fontSize: '14px',
                    color: '#94a3b8'
                  }}>
                    {task.completedBy.length} {task.completedBy.length === 1 ? 'person' : 'people'} completed this
                  </span>
                </div>
              </div>
              
              {expandedTask === task.id ? (
                <ChevronUp size={24} color="#10b981" />
              ) : (
                <ChevronDown size={24} color="#94a3b8" />
              )}
            </div>

            {/* Expanded Details */}
            {expandedTask === task.id && (
              <div style={{
                padding: '0 20px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {task.completedBy.map((completion, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: '#0f172a',
                      border: '1px solid #1e293b',
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    {/* User Info */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {completion.avatar}
                      </div>
                      <div>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '2px'
                        }}>{completion.userName}</div>
                        <div style={{
                          fontSize: '13px',
                          color: '#94a3b8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <Calendar size={14} />
                          {new Date(completion.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Photo */}
                    {completion.photo && (
                      <div style={{
                        marginBottom: '12px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={completion.photo}
                          alt="Task completion"
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      </div>
                    )}

                    {/* Description */}
                    <p style={{
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      lineHeight: '1.6',
                      color: '#cbd5e1'
                    }}>{completion.description}</p>

                    {/* Stray Details */}
                    <div style={{
                      padding: '10px',
                      backgroundColor: '#1e293b',
                      borderRadius: '6px',
                      marginBottom: '8px',
                      fontSize: '14px',
                      color: '#94a3b8'
                    }}>
                      <strong style={{ color: '#10b981' }}>Stray Details:</strong> {completion.strayDetails}
                    </div>

                    {/* Location */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: '#94a3b8'
                    }}>
                      <MapPin size={16} color="#10b981" />
                      {completion.location}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #334155'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 'bold'
              }}>Add Your Completed Task</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={24} color="#94a3b8" />
              </button>
            </div>

            {/* Form */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              {/* Task Name */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#cbd5e1'
                }}>Task Name *</label>
                <input
                  type="text"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                  placeholder="e.g., Fed stray dogs near Market"
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
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Describe what you did..."
                  rows={3}
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

              {/* Stray Details */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#cbd5e1'
                }}>Stray Details *</label>
                <input
                  type="text"
                  value={newTask.strayDetails}
                  onChange={(e) => setNewTask({ ...newTask, strayDetails: e.target.value })}
                  placeholder="e.g., 3 puppies and 2 adult dogs"
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
                  value={newTask.location}
                  onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
                  placeholder="e.g., Ernakulam Market, Kochi, Kerala"
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

              {/* Photo Upload */}
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#cbd5e1'
                }}>Photo</label>
                
                {newTask.photoPreview ? (
                  <div style={{
                    position: 'relative',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={newTask.photoPreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      onClick={() => setNewTask({ ...newTask, photo: null, photoPreview: null })}
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
                      <X size={20} color="#ffffff" />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '32px',
                    backgroundColor: '#0f172a',
                    border: '2px dashed #334155',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                  >
                    <Upload size={32} color="#94a3b8" style={{ marginBottom: '8px' }} />
                    <span style={{
                      fontSize: '14px',
                      color: '#94a3b8',
                      marginBottom: '4px'
                    }}>Click to upload photo</span>
                    <span style={{
                      fontSize: '12px',
                      color: '#64748b'
                    }}>PNG, JPG up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px'
              }}>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#0f172a',
                    color: '#cbd5e1',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#10b981'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#334155'}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTask}
                  style={{
                    flex: 1,
                    padding: '14px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}