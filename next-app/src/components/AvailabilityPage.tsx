  import { useState } from "react";
  import { updateAvailability } from "../hooks/firestoreaction";
import { useRouter } from "next/navigation";

  export default function AvailabilityPage({
    setCurrentPage,
    userAvailability,
    setUserAvailability,
    requests,
  }) {
    const [formData, setFormData] = useState({
      location: "",
      radius: "",
    });

    const router = useRouter(); 
    const [showForm, setShowForm] = useState(false);

    // ============== HANDLE GO ONLINE ==================
    const handleGoOnline = async () => {
      if (!formData.location || !formData.radius) {
        alert("Please enter location and radius");
        return;
      }

      // Update global state
      setUserAvailability({
        isAvailable: true,
        location: formData.location,
        radius: formData.radius,
      });

      // Save to Firestore
      await updateAvailability({
        isAvailable: true,
        location: formData.location,
        radius: formData.radius,
      });

      setShowForm(false); // Hide form
    };

    // ============== HANDLE GO OFFLINE ==================
    const handleGoOffline = async () => {
      setUserAvailability((prev) => ({
        ...prev,
        isAvailable: false,
      }));

      await updateAvailability({
        isAvailable: false,
        location: userAvailability.location,
        radius: userAvailability.radius,
      });
    };

    return (
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 16,
            padding: 24,
            marginBottom: 20,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: "bold" }}>
            Your Availability Status
          </h2>

          {/* STATUS CARD */}
          <div
            style={{
              backgroundColor: userAvailability.isAvailable ? "#10b98120" : "#0f172a",
              border: `2px solid ${
                userAvailability.isAvailable ? "#10b981" : "#334155"
              }`,
              padding: 20,
              borderRadius: 12,
              marginBottom: 20,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: userAvailability.isAvailable
                      ? "#10b981"
                      : "#64748b",
                  }}
                />

                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    color: userAvailability.isAvailable ? "#10b981" : "#94a3b8",
                  }}
                >
                  {userAvailability.isAvailable ? "Online" : "Offline"}
                </span>
              </div>

              {/* Online / Offline Button */}
              {!userAvailability.isAvailable ? (
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#10b981",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Go Online
                </button>
              ) : (
                <button
                  onClick={handleGoOffline}
                  style={{
                    padding: "8px 20px",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Go Offline
                </button>
              )}
            </div>
          </div>

          {/* ========== ONLINE FORM ========== */}
          {showForm && !userAvailability.isAvailable && (
            <div
              style={{
                backgroundColor: "#0f172a",
                padding: 20,
                borderRadius: 12,
                border: "1px solid #334155",
                marginBottom: 20,
              }}
            >
              <h3 style={{ marginBottom: 10 }}>Go Online</h3>

              <label>Location</label>
              <input
                type="text"
                placeholder="Enter your location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                  backgroundColor: "#1e293b",
                  borderRadius: 8,
                  border: "1px solid #334155",
                  color: "white",
                }}
              />

              <label style={{ marginTop: 16, display: "block" }}>Radius</label>
              <select
                value={formData.radius}
                onChange={(e) =>
                  setFormData({ ...formData, radius: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: 12,
                  marginTop: 8,
                  backgroundColor: "#1e293b",
                  borderRadius: 8,
                  border: "1px solid #334155",
                  color: "white",
                }}
              >
                <option value="">Select radius</option>
                <option>2km</option>
                <option>5km</option>
                <option>10km</option>
                <option>15km</option>
              </select>

              <button
                onClick={handleGoOnline}
                style={{
                  marginTop: 16,
                  width: "100%",
                  padding: 14,
                  backgroundColor: "#10b981",
                  color: "white",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Confirm & Go Online
              </button>
            </div>
          )}

          {/* BUTTONS */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 20,
            }}
          >
            <button
              onClick={() => setCurrentPage("available-helpers")}
              style={{
                padding: 16,
                backgroundColor: "#10b981",
                borderRadius: 12,
                color: "white",
                fontSize: 16,
              }}
            >
              Find Helpers
            </button>

            <button
          
              onClick={() => router.push("/requests")}
              style={{
                padding: 16,
                backgroundColor: "#0f172a",
                borderRadius: 12,
                border: "1px solid #334155",
                color: "white",
                fontSize: 16,
                position: "relative",
              }}
            >
              My Requests
              {requests.filter((r) => r.status === "pending").length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    background: "#ef4444",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                  }}
                >
                  {requests.filter((r) => r.status === "pending").length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
