"use client";
import React, { useEffect, useRef, useState } from "react";
import { Users, MessageCircle } from "lucide-react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AuthModal from "../components/AuthModal";

export default function CommunityPage() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [loggedInUser, setLoggedInUser] = useState<{ id: string; name: string } | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [users, setUsers] = useState<Array<{ id: string; name?: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [connections, setConnections] = useState<string[]>([]);

  const [selectedUser, setSelectedUser] = useState<{ id: string; name?: string } | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<any>>([]);
  const [messageText, setMessageText] = useState("");
  const unsubscribeRef = useRef<() => void | null>(null);
  const messagesScrollRef = useRef<HTMLDivElement | null>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (!messagesScrollRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesScrollRef.current;
    // if near the bottom, consider at bottom
    setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 20);
  };

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (isAtBottom && messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  // -------------------- Real-time messages listener --------------------
  const startListeningMessages = (cId: string) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const messagesRef = collection(db, `chats/${cId}/messages`);
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const docs = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setMessages(docs);

        // Auto-scroll
        if (messagesScrollRef.current) {
          messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
        }
      },
      (err) => console.error("messages onSnapshot error:", err)
    );

    unsubscribeRef.current = unsub;
  };

  // -------------------- Open chat with a user --------------------
  const openChatWith = async (otherUser: { id: string; name?: string }) => {
    if (!loggedInUser) {
      setShowAuthModal(true);
      return;
    }
    if (otherUser.id === loggedInUser.id) return;

    setSelectedUser(otherUser);
    setMessages([]);
    setChatId(null);

    try {
      const cQuery = query(collection(db, "chats"), where("members", "array-contains", loggedInUser.id));
      const cSnap = await getDocs(cQuery);

      let foundId: string | null = null;
      cSnap.forEach((docSnap) => {
        const d = docSnap.data() as any;
        if (
          Array.isArray(d.members) &&
          d.members.length === 2 &&
          d.members.includes(otherUser.id) &&
          d.members.includes(loggedInUser.id)
        ) {
          foundId = docSnap.id;
        }
      });

      if (foundId) {
        setChatId(foundId);
        startListeningMessages(foundId);
        return;
      }

      // Create new chat
      const newChatRef = await addDoc(collection(db, "chats"), {
        members: [loggedInUser.id, otherUser.id],
        lastMessage: "",
        lastAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      setChatId(newChatRef.id);
      startListeningMessages(newChatRef.id);
    } catch (err) {
      console.error("openChatWith error:", err);
    }
  };

  // -------------------- Send a message --------------------
  const sendMessage = async () => {
    if (!chatId || !messageText.trim() || !loggedInUser || !selectedUser) return;
    const text = messageText.trim();

    setMessageText("");

    try {
      await addDoc(collection(db, `chats/${chatId}/messages`), {
        senderId: loggedInUser.id,
        senderName: loggedInUser.name,
        text,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "chats", chatId), {
        lastMessage: text,
        lastAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  // -------------------- Auth listener --------------------
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setAuthUser(null);
        setLoggedInUser(null);
        setShowAuthModal(true);
      } else {
        setAuthUser(u);
        setShowAuthModal(false);
        try {
          const userDocRef = doc(db, "users", u.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as any;
            setLoggedInUser({ id: u.uid, name: data.name || u.displayName || u.email || "User" });
          } else {
            setLoggedInUser({ id: u.uid, name: u.displayName || u.email || "User" });
          }
        } catch (err) {
          console.error("Failed to load user profile:", err);
          setLoggedInUser({ id: u.uid, name: u.displayName || u.email || "User" });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // -------------------- Fetch users --------------------
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const list = usersSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .filter((u) => u.id !== loggedInUser?.id);
        setUsers(list);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };
    if (loggedInUser) fetchUsers();
  }, [loggedInUser]);


  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // -------------------- Cleanup listener on unmount --------------------
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, []);

  if (!loggedInUser) {
    return (
      <div style={{ height: "100vh", backgroundColor: "#0a0f1a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <AuthModal open={true} onClose={() => { }} onSelect={() => { }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0f1a", color: "#fff", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Users size={32} color="#10b981" />
          <h1 style={{ fontSize: 28, fontWeight: 700 }}>Community</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "360px 1fr", gap: 20 }}>
        {/* -------------------- Members list -------------------- */}
        <div style={{ background: "#071023", borderRadius: 14, padding: 16, height: "78vh", overflow: "auto" }}>
          <input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10, background: "#0f1724", border: "1px solid #263243", color: "#fff" }}
          />
          <div style={{ marginTop: 12 }}>
            {loadingUsers ? (
              <div style={{ color: "#94a3b8" }}>Loading members...</div>
            ) : filteredUsers.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>No members found</div>
            ) : (
              filteredUsers.map((u) => (
                <div key={u.id} style={{ marginTop: 12, background: "#0f1724", padding: 12, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontWeight: 600 }}>{u.name}</div></div>
                  <div>
                    <button title="Open chat" onClick={() => openChatWith(u)} style={{ padding: 8, background: "#071023", border: "1px solid #263243", borderRadius: 8 }}>
                      <MessageCircle size={18} color="#10b981" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* -------------------- Chat panel -------------------- */}
        <div style={{ background: "#071023", borderRadius: 14, padding: 16, height: "78vh", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedUser ? selectedUser.name : "Select user to chat"}</div>
            <div style={{ fontSize: 13, color: "#94a3b8" }}>{loggedInUser?.name}</div>
          </div>

          <div
            ref={messagesScrollRef}
            onScroll={handleScroll}
            style={{ flex: 1, overflow: "auto", background: "#061225", padding: 12, borderRadius: 10 }}
          >
            {chatId == null ? (
              <div style={{ color: "#94a3b8" }}>Open a chat to view messages</div>
            ) : messages.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>No messages yet — say hello 👋</div>
            ) : (
              messages.map((m) => {
                const mine = m.senderId === loggedInUser.id;
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
                    <div style={{ maxWidth: "75%", padding: 10, background: mine ? "#10b981" : "#0f1724", borderRadius: 8, color: mine ? "#000" : "#fff" }}>
                      {!mine && <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{m.senderName || selectedUser?.name}</div>}
                      <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                      <div style={{ fontSize: 11, opacity: 0.55, marginTop: 6, textAlign: "right" }}>
                        {m.createdAt?.toDate ? new Date(m.createdAt.toDate()).toLocaleString() : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* <div ref={messagesScrollRef} style={{ flex: 1, overflow: "auto", background: "#061225", padding: 12, borderRadius: 10 }}>
            {chatId == null ? (
              <div style={{ color: "#94a3b8" }}>Open a chat to view messages</div>
            ) : messages.length === 0 ? (
              <div style={{ color: "#94a3b8" }}>No messages yet — say hello 👋</div>
            ) : (
              messages.map((m) => {
                const mine = m.senderId === loggedInUser.id;
                return (
                  <div key={m.id} style={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start", marginBottom: 8 }}>
                    <div style={{ maxWidth: "75%", padding: 10, background: mine ? "#10b981" : "#0f1724", borderRadius: 8, color: mine ? "#000" : "#fff" }}>
                      {!mine && <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{m.senderName || selectedUser?.name}</div>}
                      <div style={{ whiteSpace: "pre-wrap" }}>{m.text}</div>
                      <div style={{ fontSize: 11, opacity: 0.55, marginTop: 6, textAlign: "right" }}>
                        {m.createdAt?.toDate ? new Date(m.createdAt.toDate()).toLocaleString() : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div> */}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={selectedUser ? `Message ${selectedUser.name}...` : "Select user"}
              disabled={!selectedUser}
              style={{ flex: 1, padding: 10, borderRadius: 10, background: "#0f1724", border: "1px solid #263243", color: "#fff" }}
            />
            <button
              onClick={sendMessage}
              disabled={!selectedUser || !messageText.trim()}
              style={{ padding: "10px 14px", borderRadius: 10, background: messageText.trim() ? "#10b981" : "#0f1724", color: messageText.trim() ? "#000" : "#666" }}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
