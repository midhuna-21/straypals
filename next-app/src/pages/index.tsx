"use client";

import Link from "next/link";
import { MapPin, Camera, Heart } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const steps = [
    {
      icon: Camera,
      number: "01",
      title: "Spot a stray",
      description:
        "Take a picture or note the location. Use Report to upload and name them.",
      link: "/report",
      linkText: "Report a Stray",
      color: "#10b981",
    },
    {
      icon: MapPin,
      number: "02",
      title: "Mark the location",
      description:
        "Use your phone's GPS or drop a pin to mark where they were last seen.",
      color: "#3b82f6",
    },
    {
      icon: Heart,
      number: "03",
      title: "We coordinate care",
      description:
        "Volunteers & NGOs handle feeding, vaccinations, and medical care.",
      color: "#f59e0b",
    },
  ];

  return (
    <main
      style={{
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* ---------------- HERO SECTION ---------------- */}
    <section
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        padding: "0",
        marginBottom: "24px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div className="hero-grid">
        {/* LEFT CONTENT */}
        <div className="hero-content">
          <h1>Because every stray deserves a friend</h1>
          <p>
            Join thousands of animal lovers making a difference — one bowl at a
            time. Report local strays, find feeding stations, and coordinate care
            with your community.
          </p>

          <div className="cta-buttons">
            <Link href="/report" className="primary-btn">
              <span style={{ fontSize: "18px" }}>🐾</span> Report a Stray
            </Link>

            <Link href="/map" className="secondary-btn">
              <MapPin size={18} strokeWidth={2} /> Find Stations Near You
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hero-image">
          <div className="overlay"></div>
          <img
            src="/images/dog-paw-takes-man.webp"
            alt="Dog and human connection"
          />
        </div>
      </div>

      {/* RESPONSIVE STYLES */}
      <style jsx>{`
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          min-height: 500px;
          gap: 40px;
        }

        .hero-content {
          padding: 48px;
          z-index: 2;
          max-width: 700px;
          margin: 0 auto;
        }

        .hero-content h1 {
          margin: 0 0 20px 0;
          font-size: 44px;
          line-height: 1.2;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .hero-content p {
          margin: 0 0 36px 0;
          color: #9fb3c8;
          font-size: 18px;
          line-height: 1.7;
          font-weight: 400;
        }

        .cta-buttons {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .primary-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
        }

        .secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          text-decoration: none;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .hero-image {
          position: relative;
          height: 100%;
          min-height: 500px;
          overflow: hidden;
        }

        .hero-image img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #0b1117 0%,
            rgba(11, 17, 23, 0.7) 50%,
            transparent 100%
          );
          z-index: 1;
        }

        /* ✅ MOBILE RESPONSIVENESS */
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }

          .hero-image {
            order: 1;
            min-height: 300px;
          }

          .hero-content {
            order: 2;
            padding: 24px;
            text-align: center;
          }

          .hero-content h1 {
            font-size: 28px;
          }

          .hero-content p {
            font-size: 16px;
          }

          .cta-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </section>

      {/* ---------------- HOW IT WORKS SECTION ---------------- */}
      <section >
        {/* Background pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.03,
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div style={{ marginBottom: "56px", position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "24px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#10b981",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              How It Works
            </span>
          </div>

          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "36px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.5px",
              lineHeight: "1.2",
            }}
          >
            Simple steps to make a difference
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#94a3b8",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            Join our community in helping stray animals find care and safety
            through our easy-to-use platform.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "28px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredCard === index;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: isHovered
                    ? "rgba(30, 41, 59, 0.8)"
                    : "rgba(30, 41, 59, 0.4)",
                  border: isHovered
                    ? `1px solid ${step.color}40`
                    : "1px solid rgba(51, 65, 85, 0.6)",
                  borderRadius: "16px",
                  padding: "36px 28px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isHovered ? "translateY(-8px)" : "translateY(0)",
                  boxShadow: isHovered
                    ? `0 20px 40px -10px ${step.color}20`
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${step.color}, ${step.color}80)`,
                    opacity: isHovered ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    fontSize: "48px",
                    fontWeight: 800,
                    color: "rgba(255, 255, 255, 0.05)",
                    lineHeight: 1,
                  }}
                >
                  {step.number}
                </div>

                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "12px",
                    background: `${step.color}15`,
                    border: `1px solid ${step.color}30`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "24px",
                    transition: "all 0.4s ease",
                    transform: isHovered
                      ? "scale(1.1) rotate(5deg)"
                      : "scale(1) rotate(0deg)",
                  }}
                >
                  <Icon size={28} style={{ color: step.color }} />
                </div>
                <h3
                  style={{
                    margin: "0 0 12px 0",
                    fontSize: "22px",
                    fontWeight: 600,
                    color: "#ffffff",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 20px 0",
                    fontSize: "15px",
                    lineHeight: "1.7",
                    color: "#cbd5e1",
                  }}
                >
                  {step.description}
                </p>

                {step.link && (
                  <a
                    href={step.link}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: step.color,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      opacity: isHovered ? 1 : 0.8,
                    }}
                  >
                    {step.linkText}
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{
                        transition: "transform 0.3s ease",
                        transform: isHovered
                          ? "translateX(4px)"
                          : "translateX(0)",
                      }}
                    >
                      <path
                        d="M6 3L11 8L6 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                )}
              </div>
            );
          })}
        </div>
        
     <style jsx>{`
  /* Steps grid is already responsive with auto-fit */
  @media (max-width: 768px) {
    /* Section header */
    h2 {
      font-size: 24px !important; /* smaller than desktop 36px */
    }

    p {
      font-size: 14px !important; /* smaller than desktop 18px */
    }

    /* Step card */
    h3 {
      font-size: 18px !important; /* smaller than desktop 22px */
    }

    p {
      font-size: 13px !important; /* smaller than desktop 15px */
    }

    .hero-grid {
      gap: 20px !important;
    }

    /* Optional: make step icons smaller */
    div[style*="width: 56px"][style*="height: 56px"] {
      width: 48px !important;
      height: 48px !important;
    }

    svg {
      width: 24px !important;
      height: 24px !important;
    }
  }
`}</style>

      </section>
    </main>
  );
}
