"use client";
import { useState, useEffect } from "react";
import { MapPin, Users, MessageCircle, UserPlus, UserCheck } from "lucide-react";
 import { db } from '../lib/firebase'
import { collection, getDocs } from "firebase/firestore";

export default function CommunityPage() {
  const [loggedInUser] = useState({ id: "12345", name: "John Doe" });
  const [connections, setConnections] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const userList = usersSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => user.id !== loggedInUser.id); // exclude self

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [loggedInUser.id]);

  const handleConnect = (userId: string) => {
    setConnections((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0f1a",
        color: "#ffffff",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <Users size={32} color="#10b981" />
          <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>
            Community
          </h1>
        </div>
        <p style={{ color: "#94a3b8", fontSize: "16px", margin: 0 }}>
          Connect with other community members and help make a difference
          together
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "30px",
        }}
      >
        <input
          type="text"
          placeholder="Search community members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 20px",
            backgroundColor: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "12px",
            color: "#ffffff",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div
          style={{
            textAlign: "center",
            color: "#94a3b8",
            padding: "60px 0",
            fontSize: "18px",
          }}
        >
          Loading community members...
        </div>
      )}

      {/* Users Grid */}
      {!loading && filteredUsers.length > 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredUsers.map((user) => {
            const isConnected = connections.includes(user.id);

            return (
              <div
                key={user.id}
                style={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#334155";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* User Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#10b981",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}
                  >
                    {user.avatar || user.name?.[0]?.toUpperCase() || "U"}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "4px",
                      }}
                    >
                      {user.name}
                    </h3>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        backgroundColor: "#0f172a",
                        borderRadius: "6px",
                        fontSize: "12px",
                        color: "#10b981",
                      }}
                    >
                      {user.status || "Member"}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    marginBottom: "12px",
                    color: "#94a3b8",
                    fontSize: "14px",
                  }}
                >
                  <MapPin
                    size={16}
                    style={{ marginTop: "2px", flexShrink: 0 }}
                  />
                  <span style={{ wordBreak: "break-word" }}>
                    {user.location || "Unknown"}
                  </span>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                    padding: "12px",
                    backgroundColor: "#0f172a",
                    borderRadius: "8px",
                  }}
                >
                  <MessageCircle size={16} color="#10b981" />
                  <span style={{ fontSize: "14px", color: "#cbd5e1" }}>
                    {user.reportsCount || 0} reports submitted
                  </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => handleConnect(user.id)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      backgroundColor: isConnected ? "#0f172a" : "#10b981",
                      color: isConnected ? "#10b981" : "#ffffff",
                      border: isConnected ? "1px solid #10b981" : "none",
                      borderRadius: "10px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isConnected ? (
                      <>
                        <UserCheck size={18} />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} />
                        Connect
                      </>
                    )}
                  </button>

                  <button
                    style={{
                      padding: "12px 16px",
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <MessageCircle size={18} color="#10b981" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredUsers.length === 0 && (
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
            padding: "60px 20px",
            color: "#64748b",
          }}
        >
          <Users size={48} style={{ marginBottom: "16px" }} />
          <p style={{ fontSize: "18px" }}>No community members found</p>
        </div>
      )}
    </div>
  );
}
