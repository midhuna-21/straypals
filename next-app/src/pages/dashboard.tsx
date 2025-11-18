import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStrayReported, setTotalStrayReported] = useState(0);
  const [totalStrayReportedByYou, setTotalStrayReportedByYou] = useState(0);
  const [totalAccepted, setTotalAccepted] = useState(0);
  const [totalDeclined, setTotalDeclined] = useState(0);

  const reportData = [
    { name: "Reported", value: totalStrayReported },
    { name: "Not Reported", value: totalUsers - totalStrayReported },
  ];

  const personalReportData = [
    { name: "You Reported", value: totalStrayReportedByYou },
    { name: "Others", value: totalStrayReported - totalStrayReportedByYou },
  ];

  const trendData = [
    { month: "Jan", reports: 20 },
    { month: "Feb", reports: 35 },
    { month: "Mar", reports: 28 },
    { month: "Apr", reports: 50 },
    { month: "May", reports: 60 },
  ];

  const smallCard = {
    background: "#1f1f1f",
    padding: "10px 15px",
    borderRadius: "8px",
    fontSize: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #333",
    color: "#fff",
    minWidth: "120px",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("uid");

        // Total users
        const usersSnap = await getDocs(collection(db, "users"));
        setTotalUsers(usersSnap.size);

        // Total strays
        const reportSnap = await getDocs(collection(db, "pets"));
        setTotalStrayReported(reportSnap.size);

        // Strays reported by the logged user
        // const qUserReports = query(collection(db, "pets"), where("userId", "==", userId));
        const qUserReports = query(collection(db, "pets"), where("userId", "==", userId));

        
        
        const userReportsSnap = await getDocs(qUserReports);
        console.log(userReportsSnap.size,'userReportsSnap')
        setTotalStrayReportedByYou(userReportsSnap.size);

        // Requests Accepted
        const qAccepted = query(collection(db, "request"), where("userId", "==", userId), where("status", "==", "accepted"));
        const acceptedSnap = await getDocs(qAccepted);
        setTotalAccepted(acceptedSnap.size);

        // Requests Declined
        const qDeclined = query(collection(db, "request"), where("userId", "==", userId), where("status", "==", "declined"));
        const declinedSnap = await getDocs(qDeclined);
        setTotalDeclined(declinedSnap.size);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "#fff", background: "#0d0f14", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "15px", fontSize: "24px", fontWeight: 600 }}>Dashboard Overview</h2>

      {/* SMALL ONE-LINE STATS */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "nowrap", overflowX: "auto" }}>
        {[{
          title: "Total Users",
          value: totalUsers,
        }, {
          title: "Total Strays",
          value: totalStrayReported,
        }, {
          title: "You Reported",
          value: totalStrayReportedByYou,
        }, {
          title: "Accepted",
          value: totalAccepted,
        }, {
          title: "Declined",
          value: totalDeclined,
        }].map((card, idx) => (
          <div key={idx} >
            <span style={{ fontWeight: "600", opacity: 0.8 }}>{card.title}</span>
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>{card.value}</span>
          </div>
        ))}
      </div>

      {/* TWO PIE CHARTS IN ONE ROW + GRAPH ON RIGHT */}
      <div style={{ marginTop: "25px", display: "flex", gap: "20px" }}>

        {/* LEFT: TWO PIE CHARTS SIDE BY SIDE */}
        <div style={{ flex: 1, border: "1px solid #333", borderRadius: "10px", padding: "10px", background: "#15171d" }}>
          <h4 style={{ marginBottom: "10px" }}>Reports Summary</h4>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>All Users</span>
              <div style={{ width: "100%", height: "160px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={reportData} dataKey="value" nameKey="name" outerRadius={55} fill="#ffb74d" />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ flex: 1, textAlign: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>Your Contribution</span>
              <div style={{ width: "100%", height: "160px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={personalReportData} dataKey="value" nameKey="name" outerRadius={55} fill="#64b5f6" />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT GRAPH SMALLER */}
        <div style={{ flex: 1.2, border: "1px solid #333", borderRadius: "10px", padding: "10px", background: "#15171d" }}>
          <h4 style={{ marginBottom: "10px" }}>Monthly Reporting Trend</h4>
          <div style={{ width: "100%", height: "260px" }}>
            <ResponsiveContainer>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#ffa726" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
