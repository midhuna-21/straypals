// PassTheBowlSystem.jsx
import React, { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  Bell,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

import {
  updateAvailability,
  addHelpRequest,
  uploadImage,
  subscribeToRequests,
  subscribeToAvailableHelpers,
  updateRequestStatus,
} from "../hooks/firestoreaction";

import { auth } from "../lib/firebase"; 

export default function PassTheBowlSystem() {
  const [currentPage, setCurrentPage] = useState("availability");
  const [userAvailability, setUserAvailability] = useState({
    isAvailable: true,
    location: "Ernakulam, Kochi, Kerala",
    radius: "5km",
  });

  const [selectedHelper, setSelectedHelper] = useState(null);

  const [helpRequest, setHelpRequest] = useState({
    strayName: "",
    taskType: "",
    location: "",
    urgency: "normal",
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [requests, setRequests] = useState([]);
  const [availableHelpers, setAvailableHelpers] = useState([]);

  // Replace with real auth UID when you set up auth. For now use fallback:
  const userId = auth?.currentUser?.uid || "USER_ID"; // change "USER_ID" to real id in production
  const userDisplayName = auth?.currentUser?.displayName || "You";

  useEffect(() => {
    // Subscribe to requests (realtime)
    const unsubRequests = subscribeToRequests((items) => {
      setRequests(items);
    });

    // Subscribe to available helpers (realtime)
    const unsubHelpers = subscribeToAvailableHelpers((items) => {
      // Map availability docs to helper-like objects for UI convenience
      const helpers = items.map((h, idx) => ({
        id: h.id,
        name: h.name || `Helper ${idx + 1}`,
        avatar: (h.name || "H").split(" ").map(s => s[0]).slice(0,2).join(""),
        location: h.location || h.city || "Unknown",
        distance: h.distance || "—",
        availableSince: h.updatedAt ? "recently" : "just now",
        tasksCompleted: h.tasksCompleted || 0,
        rating: h.rating || 4.5,
        raw: h,
      }));
      setAvailableHelpers(helpers);
    });

    return () => {
      unsubRequests();
      unsubHelpers();
    };
  }, []);

  // Handle file selection for image preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHelpRequest((prev) => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      }));
    }
  };

  // Toggle availability and persist to Firestore
  const handleToggleAvailability = async () => {
    try {
      const newState = !userAvailability.isAvailable;
      const updated = { ...userAvailability, isAvailable: newState };
      setUserAvailability(updated);

      // Add optional fields like name for other users to see
      const availabilityDoc = {
        ...updated,
        name: userDisplayName,
        // you may add latitude/longitude or other metadata
      };

      await updateAvailability(availabilityDoc);
      window.alert(newState ? "You are now available to help" : "You are now offline");
    } catch (err) {
      console.error("updateAvailability error:", err);
      window.alert("Failed to update availability.");
    }
  };

  const handleSendRequest = async () => {
    try {
      if (!helpRequest.strayName || !helpRequest.taskType || !helpRequest.location || !helpRequest.description) {
        window.alert("Please fill all required fields");
        return;
      }

      let photoUrl = helpRequest.photoPreview || null;
      // If user selected a File object (not only preview) upload it to storage
      if (helpRequest.photo && helpRequest.photo instanceof File) {
        photoUrl = await uploadImage(helpRequest.photo, "requests");
      }

      const newRequest = {
        from: userDisplayName,
        fromId: userId,
        helperId: selectedHelper?.id || null,
        helperName: selectedHelper?.name || null,
        strayName: helpRequest.strayName,
        taskType: helpRequest.taskType,
        location: helpRequest.location,
        urgency: helpRequest.urgency,
        description: helpRequest.description,
        photoUrl: photoUrl,
        status: "pending",
      };

      await addHelpRequest(newRequest);

      window.alert(`Request sent to ${selectedHelper?.name || "helpers"}!`);
      setCurrentPage("available-helpers");

      setHelpRequest({
        strayName: "",
        taskType: "",
        location: "",
        urgency: "normal",
        description: "",
        photo: null,
        photoPreview: null,
      });

      setSelectedHelper(null);
    } catch (err) {
      console.error("handleSendRequest error:", err);
      window.alert("Failed to send request.");
    }
  };

  // Accept / decline request (update status)
  const handleRequestAction = async (requestId, action) => {
    try {
      await updateRequestStatus(requestId, action);
      // Local state will update via realtime subscription
    } catch (err) {
      console.error("handleRequestAction error:", err);
      window.alert("Failed to update request status.");
    }
  };

  // UI Pages ---------------------------------------------------------
  const AvailabilityPage = () => (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 20px 0", fontSize: 24, fontWeight: "bold" }}>Your Availability Status</h2>

        <div
          style={{
            backgroundColor: userAvailability.isAvailable ? "rgba(16,185,129,0.12)" : "#0f172a",
            border: `2px solid ${userAvailability.isAvailable ? "#10b981" : "#334155"}`,
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: userAvailability.isAvailable ? "#10b981" : "#64748b" }} />
              <span style={{ fontSize: 18, fontWeight: 600, color: userAvailability.isAvailable ? "#10b981" : "#94a3b8" }}>
                {userAvailability.isAvailable ? "Available to Help" : "Not Available"}
              </span>
            </div>

            <button
              onClick={handleToggleAvailability}
              style={{
                padding: "8px 20px",
                backgroundColor: userAvailability.isAvailable ? "#ef4444" : "#10b981",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {userAvailability.isAvailable ? "Go Offline" : "Go Online"}
            </button>
          </div>

          {userAvailability.isAvailable && <p style={{ margin: 0, fontSize: 14, color: "#94a3b8" }}>Others can send you help requests for strays in your area</p>}
        </div>

        {userAvailability.isAvailable && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Your Location</label>
              <input
                type="text"
                value={userAvailability.location}
                onChange={(e) => {
                  setUserAvailability((prev) => ({ ...prev, location: e.target.value }));
                  // Optionally persist on change or debounce + persist
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Help Radius</label>
              <select
                value={userAvailability.radius}
                onChange={(e) => setUserAvailability((prev) => ({ ...prev, radius: e.target.value }))}
                style={{
                  width: "100%",
                  padding: 12,
                  backgroundColor: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: 8,
                  color: "#ffffff",
                  fontSize: 14,
                  outline: "none",
                  cursor: "pointer",
                  boxSizing: "border-box",
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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <button
          onClick={() => setCurrentPage("available-helpers")}
          style={{
            padding: 16,
            backgroundColor: "#10b981",
            color: "#ffffff",
            border: "none",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Find Helpers
        </button>

        <button
          onClick={() => setCurrentPage("requests")}
          style={{
            padding: 16,
            backgroundColor: "#0f172a",
            color: "#ffffff",
            border: "1px solid #334155",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
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
                backgroundColor: "#ef4444",
                color: "#ffffff",
                borderRadius: "50%",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {requests.filter((r) => r.status === "pending").length}
            </span>
          )}
        </button>
      </div>
    </div>
  );

  const AvailableHelpersPage = () => (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      <button
        onClick={() => setCurrentPage("availability")}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, backgroundColor: "transparent", border: "none", color: "#10b981", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 style={{ margin: "0 0 8px 0", fontSize: 28, fontWeight: "bold" }}>Available Helpers Near You</h2>
      <p style={{ margin: "0 0 24px 0", color: "#94a3b8", fontSize: 16 }}>Send a help request to available community members</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {availableHelpers.length === 0 && (
          <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
            <p style={{ color: "#94a3b8" }}>No helpers available nearby right now.</p>
          </div>
        )}

        {availableHelpers.map((helper) => (
          <div
            key={helper.id}
            style={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 12,
              padding: 20,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onClick={() => {
              setSelectedHelper(helper);
              setCurrentPage("send-request");
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 50, height: 50, borderRadius: "50%", backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: "bold", position: "relative" }}>
                {helper.avatar}
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 14, height: 14, backgroundColor: "#10b981", border: "2px solid #1e293b", borderRadius: "50%" }} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{helper.name}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#94a3b8" }}>
                  <Clock size={14} /> Available {helper.availableSince}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, fontSize: 14, color: "#94a3b8" }}>
              <MapPin size={16} color="#10b981" /> {helper.location} • {helper.distance} away
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 13 }}>
              <div style={{ padding: "8px 12px", backgroundColor: "#0f172a", borderRadius: 6, color: "#cbd5e1" }}>⭐ {helper.rating}</div>
              <div style={{ padding: "8px 12px", backgroundColor: "#0f172a", borderRadius: 6, color: "#cbd5e1" }}>✓ {helper.tasksCompleted} tasks</div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedHelper(helper);
                setCurrentPage("send-request");
              }}
              style={{
                width: "100%",
                padding: 12,
                backgroundColor: "#10b981",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Send size={16} /> Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const SendRequestPage = () => (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <button
        onClick={() => setCurrentPage("available-helpers")}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, backgroundColor: "transparent", border: "none", color: "#10b981", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24 }}>
        <h2 style={{ margin: "0 0 8px 0", fontSize: 24, fontWeight: "bold" }}>Send Help Request</h2>
        <p style={{ margin: "0 0 20px 0", color: "#94a3b8", fontSize: 14 }}>
          Requesting help from <strong style={{ color: "#10b981" }}>{selectedHelper?.name || "helpers"}</strong>
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Stray Name/Description *</label>
            <input
              type="text"
              value={helpRequest.strayName}
              onChange={(e) => setHelpRequest((p) => ({ ...p, strayName: e.target.value }))}
              placeholder="e.g., Brown puppy, White cat"
              style={{ width: "100%", padding: 12, backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Task Type *</label>
            <select
              value={helpRequest.taskType}
              onChange={(e) => setHelpRequest((p) => ({ ...p, taskType: e.target.value }))}
              style={{ width: "100%", padding: 12, backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#ffffff", fontSize: 14, outline: "none", cursor: "pointer", boxSizing: "border-box" }}
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

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Location *</label>
            <input
              type="text"
              value={helpRequest.location}
              onChange={(e) => setHelpRequest((p) => ({ ...p, location: e.target.value }))}
              placeholder="e.g., Ernakulam Market, Kochi"
              style={{ width: "100%", padding: 12, backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#ffffff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Urgency Level</label>

            <div style={{ display: "flex", gap: 12 }}>
              {["normal", "urgent", "emergency"].map((level) => (
                <button
                  key={level}
                  onClick={() => setHelpRequest((p) => ({ ...p, urgency: level }))}
                  style={{
                    flex: 1,
                    padding: 12,
                    backgroundColor:
                      helpRequest.urgency === level ? (level === "emergency" ? "#ef4444" : level === "urgent" ? "#f59e0b" : "#10b981") : "#0f172a",
                    color: "#ffffff",
                    border: `1px solid ${helpRequest.urgency === level ? "transparent" : "#334155"}`,
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Description *</label>
            <textarea
              value={helpRequest.description}
              onChange={(e) => setHelpRequest((p) => ({ ...p, description: e.target.value }))}
              placeholder="Describe the situation and what help is needed..."
              rows={4}
              style={{ width: "100%", padding: 12, backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: 8, color: "#ffffff", fontSize: 14, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: 8, fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>Photo (Optional)</label>

            {helpRequest.photoPreview ? (
              <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
                <img src={helpRequest.photoPreview} alt="Preview" style={{ width: "100%", height: 200, objectFit: "cover" }} />
                <button
                  onClick={() => setHelpRequest((p) => ({ ...p, photo: null, photoPreview: null }))}
                  style={{ position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <XCircle size={20} color="#ffffff" />
                </button>
              </div>
            ) : (
              <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: "#0f172a", border: "2px dashed #334155", borderRadius: 8, cursor: "pointer" }}>
                <MapPin size={24} color="#94a3b8" style={{ marginBottom: 8 }} />
                <span style={{ fontSize: 14, color: "#94a3b8" }}>Click to upload photo</span>
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              </label>
            )}
          </div>

          <button
            onClick={handleSendRequest}
            style={{
              width: "100%",
              padding: 14,
              backgroundColor: "#10b981",
              color: "#ffffff",
              border: "none",
              borderRadius: 10,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 8,
            }}
          >
            <Send size={18} /> Send Help Request
          </button>
        </div>
      </div>
    </div>
  );

  const RequestsPage = () => (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <button
        onClick={() => setCurrentPage("availability")}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, backgroundColor: "transparent", border: "none", color: "#10b981", fontSize: 16, fontWeight: 600, cursor: "pointer", marginBottom: 20 }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 style={{ margin: "0 0 8px 0", fontSize: 28, fontWeight: "bold" }}>Help Requests</h2>
      <p style={{ margin: "0 0 24px 0", color: "#94a3b8", fontSize: 16 }}>Requests from community members who need your help</p>

      {requests.length === 0 ? (
        <div style={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <Bell size={48} color="#64748b" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 16, color: "#94a3b8", margin: 0 }}>No help requests yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {requests.map((request) => (
            <div
              key={request.id}
              style={{
                backgroundColor: "#1e293b",
                border: `2px solid ${request.urgency === "emergency" ? "#ef4444" : request.urgency === "urgent" ? "#f59e0b" : "#334155"}`,
                borderRadius: 12,
                padding: 20,
                opacity: request.status !== "pending" ? 0.6 : 1,
              }}
            >
              {request.urgency !== "normal" && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    backgroundColor: request.urgency === "emergency" ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                    border: `1px solid ${request.urgency === "emergency" ? "#ef4444" : "#f59e0b"}`,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: request.urgency === "emergency" ? "#ef4444" : "#f59e0b",
                    marginBottom: 12,
                    textTransform: "uppercase",
                  }}
                >
                  <AlertCircle size={14} /> {request.urgency}
                </div>
              )}

              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                {request.photoUrl && <img src={request.photoUrl} alt={request.strayName} style={{ width: 120, height: 120, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />}

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: "bold" }}>
                      {(request.from || "U").split(" ").map(s => s[0]).slice(0,2).join("")}
                    </div>

                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#cbd5e1" }}>{request.from || "Unknown"}</div>
                      <div style={{ fontSize: 12, color: "#94a3b8" }}>{request.createdAt ? new Date(request.createdAt.seconds * 1000).toLocaleString() : request.time || ""}</div>
                    </div>
                  </div>

                  <h3 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600, color: "#ffffff" }}>{request.strayName}</h3>

                  <div style={{ display: "flex", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ padding: "4px 10px", backgroundColor: "#0f172a", borderRadius: 6, fontSize: 13, color: "#10b981", fontWeight: 600 }}>{request.taskType}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "#94a3b8" }}><MapPin size={14} /> {request.location}</span>
                  </div>

                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#cbd5e1" }}>{request.description}</p>
                </div>
              </div>

              {request.status === "pending" && (
                <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                  <button
                    onClick={() => handleRequestAction(request.id, "accepted")}
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor: "#10b981",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <CheckCircle size={18} /> Accept & Help
                  </button>

                  <button
                    onClick={() => handleRequestAction(request.id, "declined")}
                    style={{
                      flex: 1,
                      padding: 12,
                      backgroundColor: "#0f172a",
                      color: "#cbd5e1",
                      border: "1px solid #334155",
                      borderRadius: 8,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <XCircle size={18} /> Decline
                  </button>
                </div>
              )}

              {request.status !== "pending" && (
                <div
                  style={{
                    marginTop: 16,
                    padding: 12,
                    backgroundColor: request.status === "accepted" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                    border: `1px solid ${request.status === "accepted" ? "#10b981" : "#ef4444"}`,
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    color: request.status === "accepted" ? "#10b981" : "#ef4444",
                  }}
                >
                  {request.status === "accepted" ? (
                    <>
                      <CheckCircle size={18} /> Request Accepted
                    </>
                  ) : (
                    <>
                      <XCircle size={18} /> Request Declined
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
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1a", color: "#ffffff", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", marginBottom: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <MessageSquare size={32} color="#10b981" />
          <h1 style={{ fontSize: 32, fontWeight: "bold", margin: 0 }}>Pass the Bowl</h1>
        </div>
        <p style={{ color: "#94a3b8", fontSize: 16, margin: 0 }}>Connect with nearby helpers to save strays together</p>
      </div>

      {currentPage === "availability" && <AvailabilityPage />}
      {currentPage === "available-helpers" && <AvailableHelpersPage />}
      {currentPage === "send-request" && <SendRequestPage />}
      {currentPage === "requests" && <RequestsPage />}
    </div>
  );
}
