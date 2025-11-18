"use client";

import Link from "next/link";
import { MapPin, Camera, Heart } from "lucide-react";
import { useState } from "react";
import Header from "./Header";

export default function HowItWorks() {
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
        <div
        >

       <section
  style={{
    marginTop: "140px",
    padding: "40px 20px 120px 20px",
    maxWidth: "1050px",
    marginLeft: "auto",
    marginRight: "auto",
  }}
>
  {/* TITLE + SUBTITLE */}
  <div style={{ marginBottom: "64px", textAlign: "left" }}>
    <h2
      style={{
        margin: 0,
        fontSize: "40px",
        fontWeight: 700,
        color: "#fff",
        fontFamily: "Playfair Display",
        letterSpacing: "-0.5px",
        lineHeight: "1.2",
      }}
    >
      How it works
    </h2>

    <p
      style={{
        marginTop: "14px",
        fontSize: "18px",
        color: "rgba(255,255,255,0.7)",
        maxWidth: "560px",
        lineHeight: "1.7",
      }}
    >
      A simple, timeless process to help every stray find care, safety,
      and compassion.
    </p>
  </div>

  {/* STEPS */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "40px",
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
            background: "rgba(255,255,255,0.03)",
            borderRadius: "18px",
            border: isHovered
              ? "1px solid var(--gold-light)"
              : "1px solid rgba(255,255,255,0.08)",
            padding: "36px 30px",
            transition: "0.3s",
            transform: isHovered ? "translateY(-6px)" : "none",
            cursor: "default",
          }}
        >
          {/* ICON */}
          <div
            style={{
              width: "58px",
              height: "58px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <Icon size={28} style={{ color: "var(--gold-light)" }} />
          </div>

          {/* TITLE */}
          <h3
            style={{
              margin: "0 0 12px 0",
              fontSize: "22px",
              fontWeight: 600,
              color: "#fff",
              fontFamily: "Playfair Display",
            }}
          >
            {step.title}
          </h3>

          {/* DESCRIPTION */}
          <p
            style={{
              margin: 0,
              fontSize: "16px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: "1.7",
            }}
          >
            {step.description}
          </p>
        </div>
      );
    })}
  </div>
</section>

        </div>
    );
}
