"use client";

import Link from "next/link";
import { MapPin, Camera, Heart } from "lucide-react";
import { useState } from "react";
import Header from "../components/Header";
import HowItWorks from "../components/HowItWorks";

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
    >

      <div style={{
        backgroundImage: 'url("/images/hero-section.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        margin: "0 auto",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}>
        <Header />
        {/* ---------------- HERO SECTION ---------------- */}
        <section
          className="satin-bg"
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            padding: "140px 0 140px 0",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              maxWidth: "1200px", // tighter container
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center", // center sections
              gap: "20px", // bring sections closer
              padding: "0 20px",
              flexWrap: "wrap",
            }}
          >

            {/* LEFT — TEXT */}
            <div
              style={{
                flex: "0 0 45%", // narrower width
                minWidth: "300px",
                color: "white",
              }}
            >
              <h1
                style={{
                  fontSize: "54px",
                  lineHeight: "1",
                  fontFamily: "Playfair Display",
                  marginBottom: "16px",
                  fontWeight: 700,
                  letterSpacing: "-1px",
                  wordSpacing: "-3px",
                }}
              >
                Hey… saw a stray{" "}
                <span
                  style={{
                    fontFamily: "Cormorant Italic",
                    color: "var(--gold-light)",
                    fontSize: "60px",
                    fontWeight: 600,
                    display: "block",
                    marginTop: "10px",
                  }}
                >
                  today?
                </span>
              </h1>

              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.8)",
                  lineHeight: "1.1",
                  maxWidth: "520px",
                  marginBottom: "32px",
                }}
              >
                Join thousands of animal lovers making a difference — one bowl at a
                time. Report local strays, find feeding stations, and coordinate
                care with your community.
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a
                  href="/report"
                  style={{
                    background:
                      "linear-gradient(90deg, #967831 0%, #B99A5C 50%, #967831 100%)",
                    padding: "14px 26px",
                    borderRadius: "32px",
                    fontSize: "18px",
                    fontWeight: "700",
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  Report a Stray
                </a>

                <a
                  href="/map"
                  style={{
                    border: "1px solid var(--gold-light)",
                    padding: "14px 26px",
                    borderRadius: "32px",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "var(--gold-light)",
                    textDecoration: "none",
                    background: "rgba(207,168,92,0.05)",
                  }}
                >
                  Find Stations Near You
                </a>
              </div>
            </div>

            {/* RIGHT — IMAGE */}
            <div
              style={{
                flex: "0 0 45%", // same width as text
                minWidth: "300px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/hero-image.png"
                alt="Dog and human connection"
                className="dog-hero-img"
                style={{
                  width: "90%", // slightly smaller for balance
                  position: "relative",
                  zIndex: 2,
                }}
              />
            </div>

          </div>
        </section>
      </div>
      {/* ---------------- HOW IT WORKS SECTION ---------------- */}
    <HowItWorks />
    </main>
  );
}
