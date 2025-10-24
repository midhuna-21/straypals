import React, { useState } from 'react';
import { Menu, X, ChevronDown, Building2, Shield, BarChart3, TrendingUp, FileEdit, Bell, LogIn } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [manageDropdownOpen, setManageDropdownOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(24px)',
      // backgroundColor: 'rgba(15, 23, 42, 0.98)',
      borderBottom: '1px solid rgba(251, 191, 36, 0.2)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 2rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          {/* Logo/Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              fontSize: '2rem',
              filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.3))'
            }}>🐾</div>
            <a href="/" style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 50%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textDecoration: 'none',
              transition: 'all 0.3s',
              letterSpacing: '-0.02em'
            }}>
              StrayPals
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem'
          }} className="desktop-nav">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/report">Report</NavLink>
            <NavLink href="/map">Map</NavLink>
            <NavLink href="/tasks">Tasks</NavLink>
            <NavLink href="/sos">SOS</NavLink>
            <NavLink href="/posters">Posters</NavLink>
            <NavLink href="/campaign/pass-the-bowl">Pass the Bowl</NavLink>
            <NavLink href="/me">Profile</NavLink>

            {/* Divider */}
            <div style={{
              height: '32px',
              width: '1px',
              background: 'linear-gradient(to bottom, transparent, rgba(251, 191, 36, 0.4), transparent)',
              margin: '0 0.5rem'
            }}></div>

            {/* Management Dropdown */}
            <div style={{ position: 'relative' }}
              onMouseEnter={() => setManageDropdownOpen(true)}
              onMouseLeave={() => setManageDropdownOpen(false)}
            >
              <button style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.625rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fbbf24',
                backgroundColor: 'rgba(251, 191, 36, 0.1)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(251, 191, 36, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                <BarChart3 size={16} />
                <span>Manage</span>
                <ChevronDown size={14} style={{
                  transition: 'transform 0.3s',
                  transform: manageDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>

              {manageDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '220px',
                  backgroundColor: 'rgba(30, 41, 59, 0.98)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(251, 191, 36, 0.2)',
                  borderRadius: '1rem',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                  paddingTop: '0.75rem',
                  paddingBottom: '0.75rem',
                  overflow: 'hidden'
                }}>
                  <DropdownLink href="/admin/stations" icon={<Building2 size={16} />}>Feeding Stations</DropdownLink>
                  <DropdownLink href="/admin/moderation-covers" icon={<Shield size={16} />}>Moderation</DropdownLink>
                  <DropdownLink href="/admin/stations-dashboard" icon={<BarChart3 size={16} />}>Dashboard</DropdownLink>
                  <DropdownLink href="/admin/referrals-analytics" icon={<TrendingUp size={16} />}>Referrals</DropdownLink>
                  <DropdownLink href="/admin/cms-copy" icon={<FileEdit size={16} />}>CMS</DropdownLink>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section - Actions */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '1rem'
          }} className="desktop-actions">
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#fff',
              background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              <Bell size={16} />
              <span>Enable Alerts</span>
            </button>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.625rem 1.25rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#cbd5e1',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>
              <LogIn size={16} />
              <span>Sign In</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={{
              display: 'block',
              padding: '0.625rem',
              borderRadius: '0.75rem',
              color: '#fbbf24',
              backgroundColor: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div style={{
            paddingTop: '1rem',
            paddingBottom: '1.5rem',
            borderTop: '1px solid rgba(251, 191, 36, 0.2)'
          }} className="mobile-menu">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <MobileNavLink href="/" icon=''>Home</MobileNavLink>
              <MobileNavLink href="/report" icon=''>Report</MobileNavLink>
              <MobileNavLink href="/map" icon=''>Map</MobileNavLink>
              <MobileNavLink href="/tasks" icon=''>Tasks</MobileNavLink>
              <MobileNavLink href="/sos" icon=''>SOS</MobileNavLink>
              <MobileNavLink href="/posters" icon=''>Posters</MobileNavLink>
              <MobileNavLink href="/campaign/pass-the-bowl" icon=''>Pass the Bowl</MobileNavLink>
              <MobileNavLink href="/me" icon=''>Profile</MobileNavLink>

              <div style={{
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(251, 191, 36, 0.3), transparent)',
                margin: '0.75rem 0'
              }}></div>

              <div style={{
                fontSize: '0.75rem',
                fontWeight: '700',
                color: '#fbbf24',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                // padding: '0.5rem 1rem',
                marginBottom: '0.25rem'
              }}></div>
              <MobileNavLink href="/admin/stations" icon={<Building2 size={18} />}>Feeding Stations</MobileNavLink>
              <MobileNavLink href="/admin/moderation-covers" icon={<Shield size={18} />}>Moderation</MobileNavLink>
              <MobileNavLink href="/admin/stations-dashboard" icon={<BarChart3 size={18} />}>Dashboard</MobileNavLink>
              <MobileNavLink href="/admin/referrals-analytics" icon={<TrendingUp size={18} />}>Referrals</MobileNavLink>
              <MobileNavLink href="/admin/cms-copy" icon={<FileEdit size={18} />}>CMS</MobileNavLink>

              <div style={{
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(251, 191, 36, 0.3), transparent)',
                margin: '0.75rem 0'
              }}></div>

              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0.5rem 1rem 0',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#fff',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <Bell size={18} />
                <span>Enable Alerts</span>
              </button>
              <button style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                margin: '0.5rem 1rem 0',
                padding: '0.75rem 1rem',
                borderRadius: '0.75rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#cbd5e1',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}>
                <LogIn size={18} />
                <span>Sign In</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function NavLink({ href, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.625rem 1rem',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: isHovered ? '#fff' : '#cbd5e1',
        backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{children}</span>
    </a>
  );
}

function DropdownLink({ href, icon, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1.25rem',
        fontSize: '0.875rem',
        fontWeight: '600',
        color: isHovered ? '#fbbf24' : '#cbd5e1',
        backgroundColor: isHovered ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s',
        borderLeft: isHovered ? '3px solid #fbbf24' : '3px solid transparent'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span style={{
        transition: 'all 0.3s',
        transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
      }}>{icon}</span>}
      <span>{children}</span>
    </a>
  );
}

function MobileNavLink({ href, icon, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.875rem',
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        fontSize: '0.9rem',
        fontWeight: '600',
        color: isHovered ? '#fbbf24' : '#cbd5e1',
        backgroundColor: isHovered ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
        textDecoration: 'none',
        transition: 'all 0.3s',
        borderLeft: isHovered ? '3px solid #fbbf24' : '3px solid transparent'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon && <span style={{
        transition: 'all 0.3s',
        transform: isHovered ? 'translateX(2px)' : 'translateX(0)'
      }}>{icon}</span>}
      <span>{children}</span>
    </a>
  );
}
