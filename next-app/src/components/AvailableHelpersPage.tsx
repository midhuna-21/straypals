import { ArrowLeft, MapPin, Clock, Send } from "lucide-react";
import { useRouter } from "next/router";

export default function AvailableHelpersPage({ 
  availableHelpers = [], 
  setSelectedHelper
}) {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>

      {/* Back Button */}
      <button
        onClick={() => router.push("/pass-the-bowl")}
        style={{ display: "flex", gap: 8, background: "none", color: "#10b981" }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2 style={{ fontSize: 28, fontWeight: "bold" }}>
        Available Helpers Near You
      </h2>

      <p style={{ color: "#94a3b8" }}>
        Send a help request to a nearby helper
      </p>

      {/* If no helpers available */}
      {(!Array.isArray(availableHelpers) || availableHelpers.length === 0) && (
        <p style={{ marginTop: 20, color: "#94a3b8" }}>
          No helpers available right now.
        </p>
      )}

      {/* Helpers Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 16,
        marginTop: 20
      }}>
        {availableHelpers.map(helper => (
          <div
            key={helper.id}
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 12,
              padding: 20,
            }}
          >
            {/* Avatar + Name */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{
                backgroundColor: "#10b981",
                width: 50,
                height: 50,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold"
              }}>
                {helper.avatar || helper.name?.charAt(0) || "?"}
              </div>

              <div>
                <h3 style={{ margin: 0 }}>{helper.name || "Unknown User"}</h3>

                <div style={{ display: "flex", gap: 4, color: "#94a3b8" }}>
                  <Clock size={14} /> Available now
                </div>
              </div>
            </div>

            {/* Location */}
            <div style={{ display: "flex", gap: 4, marginTop: 12, color: "#94a3b8" }}>
              <MapPin size={14} />
              {helper.location || "Not given"}
            </div>

            {/* Send Request Button */}
            <button
              onClick={() => {
                setSelectedHelper(helper);
                // router.push("/send-request");
              }}
              style={{
                width: "100%",
                marginTop: 16,
                backgroundColor: "#10b981",
                padding: 10,
                borderRadius: 8,
                border: "none",
                color: "white",
                fontWeight: 600,
                display: "flex",
                justifyContent: "center",
                gap: 8
              }}
            >
              <Send size={16} /> Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
