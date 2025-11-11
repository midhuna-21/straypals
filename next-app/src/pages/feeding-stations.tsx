"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  AlertTriangle,
  Heart,
  Droplet,
  Package,
} from "lucide-react";

export default function FeedingStations() {
  const [stations, setStations] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const mockStations = [
      {
        id: 1,
        name: "Central Park Feeding Point",
        address: "123 Park Road, Singapore 238801",
        distance: 0.8,
        straysReported: 3,
        lastFed: "2 hours ago",
        volunteers: 5,
        needsSupport: false,
        supplies: { food: "High", water: "Medium" },
      },
      {
        id: 2,
        name: "Marina Bay Community Station",
        address: "456 Marina Boulevard, Singapore 018989",
        distance: 1.2,
        straysReported: 7,
        lastFed: "4 hours ago",
        volunteers: 3,
        needsSupport: true,
        supplies: { food: "Low", water: "Low" },
      },
      {
        id: 3,
        name: "East Coast Park Shelter",
        address: "789 East Coast Parkway, Singapore 449876",
        distance: 2.5,
        straysReported: 5,
        lastFed: "1 hour ago",
        volunteers: 8,
        needsSupport: false,
        supplies: { food: "High", water: "High" },
      },
    ];
    setStations(mockStations);
  }, []);

  const filteredStations = stations.filter((s) => {
    if (filter === "nearby") return s.distance <= 2;
    if (filter === "urgent") return s.needsSupport;
    return true;
  });

  const getSupplyColor = (level: string) => {
    switch (level) {
      case "High":
        return "#22c55e";
      case "Medium":
        return "#f59e0b";
      case "Low":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div
      style={{
        background: "#0f1117",
        color: "#f3f4f6",
        minHeight: "100vh",
        padding: "40px 24px",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#fbbf24",
              margin: 0,
            }}
          >
            Feeding Stations
          </h1>

          <span
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#22c55e",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ● Live Updates
          </span>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "40px",
            flexWrap: "wrap",
          }}
        >
          {["all", "nearby", "urgent"].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                padding: "10px 22px",
                borderRadius: "10px",
                fontWeight: 600,
                cursor: "pointer",
                border:
                  filter === key
                    ? "2px solid #fbbf24"
                    : "1px solid rgba(255,255,255,0.1)",
                background:
                  filter === key ? "rgba(251,191,36,0.1)" : "transparent",
                color: filter === key ? "#fbbf24" : "#d1d5db",
                transition: "all 0.3s ease",
              }}
            >
              {key === "all"
                ? `All Stations (${stations.length})`
                : key === "nearby"
                ? `Nearby (${stations.filter((s) => s.distance <= 2).length})`
                : `Needs Help (${stations.filter((s) => s.needsSupport).length})`}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {filteredStations.map((station) => (
            <div
              key={station.id}
              style={{
                background: "#1a1d27",
                borderRadius: "16px",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: "0 0 6px 0",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#f3f4f6",
                    }}
                  >
                    {station.name}
                  </h3>
                  <p
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#9ca3af",
                      fontSize: "13px",
                      margin: 0,
                    }}
                  >
                    <Navigation size={14} />
                    {station.distance} km away
                  </p>
                </div>

                {station.needsSupport && (
                  <div
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <AlertTriangle size={14} /> Urgent
                  </div>
                )}
              </div>

              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#9ca3af",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                <MapPin size={14} />
                {station.address}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  color: "#9ca3af",
                  marginBottom: "12px",
                }}
              >
                <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <Clock size={14} /> Fed {station.lastFed}
                </span>
                <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <Users size={14} /> {station.volunteers} volunteers
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                  color: "#d1d5db",
                  fontSize: "13px",
                }}
              >
                <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <Package size={14} /> Food:{" "}
                  <strong
                    style={{
                      color: getSupplyColor(station.supplies.food),
                      fontWeight: 700,
                    }}
                  >
                    {station.supplies.food}
                  </strong>
                </span>
                <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <Droplet size={14} /> Water:{" "}
                  <strong
                    style={{
                      color: getSupplyColor(station.supplies.water),
                      fontWeight: 700,
                    }}
                  >
                    {station.supplies.water}
                  </strong>
                </span>
              </div>

              <div
                style={{
                  background: "rgba(239,68,68,0.08)",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    gap: "6px",
                    alignItems: "center",
                    color: "#ef4444",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  <Heart size={16} /> {station.straysReported} strays here
                </span>
                <button
                  style={{
                    background: "transparent",
                    border: "1px solid #ef4444",
                    color: "#ef4444",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                  }}
                >
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
