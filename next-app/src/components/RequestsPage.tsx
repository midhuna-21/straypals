import { ArrowLeft, MapPin, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/router";

export default function RequestsPage({ requests, handleRequestAction }) {
  const router = useRouter();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>

      <button
        onClick={() => router.push("/pass-the-bowl")}
        style={{ display: "flex", gap: 8, background: "none", color: "#10b981" }}
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h2>Incoming Help Requests</h2>

      {requests.length === 0 && (
        <p>No requests yet.</p>
      )}

      {requests.map(req => (
        <div key={req.id} style={{
          background: "#1e293b",
          padding: 20,
          borderRadius: 12,
          marginTop: 16
        }}>
          <h3>{req.strayName}</h3>
          <p><MapPin size={14} /> {req.location}</p>
          <p>{req.description}</p>

          {req.photo && <img src={req.photo} width={150} />}

          {req.status === "pending" ? (
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => handleRequestAction(req.id, "accepted")}
                style={{ background: "#10b981", padding: 10, borderRadius: 6 }}>
                Accept
              </button>
              <button onClick={() => handleRequestAction(req.id, "declined")}
                style={{ background: "#ef4444", padding: 10, borderRadius: 6 }}>
                Decline
              </button>
            </div>
          ) : (
            <p>Status: {req.status}</p>
          )}
        </div>
      ))}
    </div>
  );
}
