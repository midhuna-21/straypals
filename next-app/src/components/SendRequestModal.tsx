import { useState } from "react";
import { uploadImage, addHelpRequest } from "../hooks/firestoreaction";
import { auth } from "../lib/firebase";

export default function SendRequestModal({ helper, onClose }) {
  const [form, setForm] = useState({
    strayName: "",
    location: "",
  });

  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async () => {
    if (!form.strayName || !form.location) {
      alert("Please fill all fields");
      return;
    }

    setUploading(true);

    let photoURL = null;
    if (photo) {
      photoURL = await uploadImage(photo, "requests");
    }

    await addHelpRequest({
      senderId: auth.currentUser?.uid,
      receiverId: helper.id,
      strayName: form.strayName,
      location: form.location,
      photo: photoURL,
      status: "pending",
    });

    setUploading(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        width: 400,
        background: "#1e293b",
        borderRadius: 12,
        padding: 20,
        color: "white"
      }}>
        <h2>Send Request to {helper.name}</h2>

        <label>Stray Name</label>
        <input 
          type="text"
          value={form.strayName}
          onChange={(e) => setForm({ ...form, strayName: e.target.value })}
          style={{ width: "100%", padding: 10, borderRadius: 8 }}
        />

        <label style={{ marginTop: 10 }}>Location</label>
        <input 
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          style={{ width: "100%", padding: 10, borderRadius: 8 }}
        />

        <label style={{ marginTop: 10 }}>Photo</label>
        <input 
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button 
          onClick={handleSubmit}
          disabled={uploading}
          style={{
            width: "100%", marginTop: 20,
            padding: 12, background: "#10b981",
            borderRadius: 8, border: "none", color: "white"
          }}
        >
          {uploading ? "Sending..." : "Send Request"}
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%", marginTop: 10,
            padding: 10, background: "#ef4444",
            borderRadius: 8, border: "none", color: "white"
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
