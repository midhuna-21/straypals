"use client";
import { useEffect, useState } from "react";
import { MapPin, Clock, Heart, Navigation } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, doc, getDoc, orderBy, query } from "firebase/firestore";

interface Pet {
    id: string;
    name?: string;
    location?: string;
    photoURL?: string;
    createdAt?: { seconds: number };
    userId?: string; // 👈 important
}

export default function SpottedPage() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchReports = async () => {
            try {
                const q = query(collection(db, "pets"), orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);

                const petsData = await Promise.all(
                    snapshot.docs.map(async (docSnap) => {
                        const petData = { id: docSnap.id, ...docSnap.data() } as Pet;
                        let reporterName = "";

                        if (petData.userId) {
                            try {
                                const userDoc = await getDoc(doc(db, "users", petData.userId));
                                if (userDoc.exists()) {
                                    const userData = userDoc.data();
                                    console.log('userDoc', userData)
                                    reporterName = userData.name || "Anonymous";
                                }
                            } catch (error) {
                                console.warn("Error fetching user:", error);
                            }
                        }

                        return { ...petData, reporterName };
                    })
                );

                setReports(petsData);
            } catch (error) {
                console.error("Error fetching reports:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    //       useEffect(() => {
    //      const fetchReports = async () => {
    //       try {
    //         // ✅ Fetch all pet reports
    //         const q = query(collection(db, "pets"), orderBy("createdAt", "desc"));
    //         const snapshot = await getDocs(q);

    //         const petsData = await Promise.all(
    //           snapshot.docs.map(async (docSnap) => {
    //             const petData = { id: docSnap.id, ...docSnap.data() };

    //             // ✅ Fetch reporter’s name from users collection
    //             let reporterName = "";
    //             try {
    //               if (petData.reportedBy) {
    //                 const userDoc = await getDoc(doc(db, "users", petData.reportedBy));
    //                 if (userDoc.exists()) {
    //                   const userData = userDoc.data();
    //                   reporterName = userData.name || "Anonymous";
    //                 }
    //               }
    //             } catch (e) {
    //               console.warn("Error fetching user for", petData.reportedBy, e);
    //             }

    //             return { ...petData, reporterName };
    //           })
    //         );

    //         setReports(petsData);
    //       } catch (error) {
    //         console.error("Error fetching reports:", error);
    //       } finally {
    //         setLoading(false);
    //       }
    //     };

    //     fetchReports();
    //   }, []);

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp?.seconds) return "recently";
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return "just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return "yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return date.toLocaleDateString();
    };

    // useEffect(() => {
    //     // Simulating data fetch - replace with your Firebase logic
    //     setTimeout(() => {
    //         setReports([
    //             {
    //                 id: "1",
    //                 name: "ggg",
    //                 location: "Ernakulam South, Kochi, Kerala, India",
    //                 photoURL: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500",
    //                 createdAt: { seconds: 1730203038 },
    //                 reportedBy: "Sarah Johnson"
    //             },
    //             {
    //                 id: "2",
    //                 name: "Fluffy",
    //                 location: "Downtown District, Kochi, Kerala, India",
    //                 photoURL: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500",
    //                 createdAt: { seconds: 1730189038 },
    //                 reportedBy: "Mike Chen"
    //             },
    //             {
    //                 id: "3",
    //                 name: "Buddy",
    //                 location: "Marine Drive, Kochi, Kerala, India",
    //                 photoURL: "https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=500",
    //                 createdAt: { seconds: 1730175038 },
    //                 reportedBy: "Priya Sharma"
    //             }
    //         ]);
    //         setLoading(false);
    //     }, 500);
    // }, []);

    // const getTimeAgo = (timestamp) => {
    //     if (!timestamp) return "recently";
    //     const date = new Date(timestamp.seconds * 1000);
    //     const now = new Date();
    //     const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    //     if (diffInHours < 1) return "just now";
    //     if (diffInHours < 24) return `${diffInHours}h ago`;
    //     const diffInDays = Math.floor(diffInHours / 24);
    //     if (diffInDays === 1) return "yesterday";
    //     if (diffInDays < 7) return `${diffInDays} days ago`;
    //     return date.toLocaleDateString();
    // };

    return (
        <div style={{
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden"
        }}>
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                backgroundSize: "40px 40px",
                pointerEvents: "none"
            }} />

            <div style={{
                maxWidth: "1400px",
                margin: "0 auto",
                padding: "60px 24px",
                position: "relative",
                zIndex: 1
            }}>
                <div style={{
                    marginBottom: "48px",
                    textAlign: "center"
                }}>
                    <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        borderRadius: "24px",
                        padding: "6px 16px",
                        marginBottom: "20px"
                    }}>
                        <Heart size={16} color="#10b981" fill="#10b981" />
                        <span style={{ color: "#10b981", fontSize: "14px", fontWeight: "500" }}>
                            Community Alerts
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: "40px",
                        fontWeight: 700,
                        color: "#ffffff",
                        marginBottom: "16px",
                    }}>
                        They're smiling 'cause of you.
                    </h1>

                    <p style={{
                        fontSize: "18px",
                        color: "#94a3b8",
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: "1.6"
                    }}>
                        See where strays have been spotted in your area. Every report helps us reach them faster with food, care, and safety.
                    </p>
                </div>
                {loading && (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px"
                    }}>
                        <div style={{
                            display: "inline-block",
                            width: "50px",
                            height: "50px",
                            border: "4px solid rgba(251, 191, 36, 0.2)",
                            borderTop: "4px solid #fbbf24",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite"
                        }} />
                        <p style={{ color: "#94a3b8", marginTop: "20px", fontSize: "16px" }}>
                            Loading recent sightings...
                        </p>
                    </div>
                )}

                {!loading && reports.length === 0 && (
                    <div style={{
                        background: "rgba(15, 23, 42, 0.6)",
                        backdropFilter: "blur(10px)",
                        border: "2px dashed rgba(255, 255, 255, 0.1)",
                        borderRadius: "20px",
                        padding: "60px 40px",
                        textAlign: "center",
                        maxWidth: "600px",
                        margin: "0 auto"
                    }}>
                        <MapPin size={48} color="#64748b" style={{ marginBottom: "20px" }} />
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "600",
                            color: "#e2e8f0",
                            marginBottom: "12px"
                        }}>
                            No sightings yet
                        </h3>
                        <p style={{ color: "#64748b", fontSize: "16px", lineHeight: "1.6" }}>
                            Be the first to report a stray in your area. Your report can help save a life.
                        </p>
                    </div>
                )}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "32px",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    {reports.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                borderRadius: "24px",
                                overflow: "hidden",
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                cursor: "pointer",
                                position: "relative",
                                boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-8px)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                                e.currentTarget.style.boxShadow = "0 4px 24px rgba(0, 0, 0, 0.1)";
                            }}
                        >
                            <div style={{
                                position: "relative",
                                overflow: "hidden",
                                height: "280px"
                            }}>
                                <img
                                    src={item.photoURL}
                                    alt={item.name || "Spotted stray"}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "scale(1.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                />
                                <div style={{
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: "50%",
                                    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
                                    pointerEvents: "none"
                                }} />
                                <div style={{
                                    position: "absolute",
                                    top: "16px",
                                    right: "16px",
                                    background: "rgba(239, 68, 68, 0.95)",
                                    backdropFilter: "blur(12px)",
                                    color: "#fff",
                                    padding: "8px 16px",
                                    borderRadius: "24px",
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)"
                                }}>
                                    <div style={{
                                        width: "8px",
                                        height: "8px",
                                        background: "#fff",
                                        borderRadius: "50%",
                                        animation: "pulse 2s infinite"
                                    }} />
                                    Needs Help
                                </div>
                                <div style={{
                                    position: "absolute",
                                    bottom: "16px",
                                    left: "16px",
                                    background: "rgba(15, 23, 42, 0.9)",
                                    backdropFilter: "blur(12px)",
                                    color: "#94a3b8",
                                    padding: "8px 14px",
                                    borderRadius: "12px",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    border: "1px solid rgba(255, 255, 255, 0.1)"
                                }}>
                                    <Clock size={14} color="#94a3b8" />
                                    {getTimeAgo(item.createdAt)}
                                </div>
                            </div>
                            <div style={{ padding: "20px" }}>
                                <h3 style={{
                                    fontSize: "24px",
                                    fontWeight: "700",
                                    color: "#ffffff",
                                    marginBottom: "20px",
                                    letterSpacing: "-0.02em",
                                    lineHeight: "1.2"
                                }}>
                                    {item.name || ""}
                                </h3>
                                <div style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "12px",
                                    minHeight: "28px",
                                    marginBottom: "24px",
                                }}>
                                    <MapPin size={20} color="#10b981" style={{ marginTop: "2px", flexShrink: 0 }} />
                                    <span
                                        style={{
                                            fontSize: "14px",
                                            color: "#e2e8f0",
                                            lineHeight: "1.6",
                                            fontWeight: "500",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "block",
                                            maxWidth: "100%",
                                        }}
                                    >
                                        {item.location || "Unknown location"}
                                    </span>

                                </div>
                                <div style={{
                                    height: "1px",
                                    background: "rgba(255, 255, 255, 0.06)",
                                    marginBottom: "20px"
                                }} />
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: "20px"
                                }}>
                                    <span style={{
                                        fontSize: "13px",
                                        color: "#64748b",
                                        fontWeight: "500"
                                    }}>
                                        Reported by
                                    </span>
                                    <span style={{
                                        fontSize: "14px",
                                        color: "#cbd5e1",
                                        fontWeight: "600"
                                    }}>
                                        {item.reporterName}
                                    </span>
                                </div>
                                <button
                                    style={{
                                        width: "100%",
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        color: "#000",
                                        border: "none",
                                        borderRadius: "14px",
                                        padding: "16px 24px",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "10px",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        boxShadow: "0 4px 14px rgba(16, 185, 129, 0.25)",
                                        letterSpacing: "0.02em"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateY(-2px)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.25)";
                                    }}
                                >
                                    <Navigation size={18} />
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && reports.length > 0 && (
                    <div style={{
                        marginTop: "60px",
                        textAlign: "center",
                        padding: "40px 24px",
                        borderRadius: "20px"
                    }}>
                        <h3 style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#f1f5f9",
                            marginBottom: "12px"
                        }}>
                            Spotted a stray?
                        </h3>
                        <p style={{
                            fontSize: "16px",
                            color: "#94a3b8",
                            marginBottom: "24px"
                        }}>
                            Report it now and help your community take action
                        </p>
                        <button
                            style={{
                                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                                color: "#000",
                                border: "none",
                                borderRadius: "12px",
                                padding: "14px 32px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            Report a Sighting
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}