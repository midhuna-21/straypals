import { ArrowLeft, MapPin, XCircle, Send } from "lucide-react";

export default function SendRequestPage({
  setCurrentPage,   
  selectedHelper,
  helpRequest,
  setHelpRequest,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHelpRequest({
        ...helpRequest,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>

      <button
        onClick={() => setCurrentPage("available-helpers")}
        style={{ display: "flex", gap: 8, background: "none", color: "#10b981" }}>
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ backgroundColor: "#1e293b", padding: 24, borderRadius: 12 }}>
        <h2>Send Request</h2>
        <p>Requesting help from <b style={{ color: "#10b981" }}>{selectedHelper?.name}</b></p>

        {/* Stray Name */}
        <label>Stray Name *</label>
        <input
          type="text"
          value={helpRequest.strayName}
          onChange={e => setHelpRequest({ ...helpRequest, strayName: e.target.value })}
          style={{
            width: "100%", padding: 12, background: "#0f172a",
            borderRadius: 8, border: "1px solid #334155", color: "white"
          }}
        />

        {/* Task Type */}
        <label style={{ marginTop: 12 }}>Task Type *</label>
        <select
          value={helpRequest.taskType}
          onChange={e => setHelpRequest({ ...helpRequest, taskType: e.target.value })}
          style={{
            width: "100%", padding: 12, background: "#0f172a",
            borderRadius: 8, border: "1px solid #334155", color: "white"
          }}
        >
          <option value="">Select task type</option>
          <option value="Feeding">Feeding</option>
          <option value="Medical Help">Medical Help</option>
          <option value="Rescue">Rescue</option>
        </select>

        {/* Location */}
        <label style={{ marginTop: 12 }}>Location *</label>
        <input
          type="text"
          value={helpRequest.location}
          onChange={e => setHelpRequest({ ...helpRequest, location: e.target.value })}
          style={{
            width: "100%", padding: 12, background: "#0f172a",
            borderRadius: 8, border: "1px solid #334155", color: "white"
          }}
        />

        {/* Description */}
        <label style={{ marginTop: 12 }}>Description *</label>
        <textarea
          rows={4}
          value={helpRequest.description}
          onChange={e => setHelpRequest({ ...helpRequest, description: e.target.value })}
          style={{
            width: "100%", padding: 12, background: "#0f172a",
            borderRadius: 8, border: "1px solid #334155", color: "white"
          }}
        />

        {/* Photo Upload */}
        <label style={{ marginTop: 12 }}>Photo</label>
        {helpRequest.photoPreview ? (
          <div style={{ position: "relative" }}>
            <img
              src={helpRequest.photoPreview}
              style={{ width: "100%", borderRadius: 8 }}
            />
            <button
              onClick={() => setHelpRequest({ ...helpRequest, photo: null, photoPreview: null })}
              style={{
                position: "absolute", top: 8, right: 8,
                background: "rgba(0,0,0,0.7)",
                borderRadius: "50%", padding: 6
              }}
            >
              <XCircle color="white" />
            </button>
          </div>
        ) : (
          <label
            style={{
              background: "#0f172a",
              display: "flex", flexDirection: "column",
              alignItems: "center",
              padding: 16, border: "2px dashed #334155",
              borderRadius: 8, cursor: "pointer"
            }}
          >
            <MapPin size={24} color="#94a3b8" />
            Upload image
            <input hidden type="file" accept="image/*" onChange={handleFileChange} />
          </label>
        )}

        {/* Submit */}
        <button
          onClick={() => setCurrentPage("available-helpers")}
          style={{
            width: "100%", padding: 14, marginTop: 16,
            background: "#10b981", borderRadius: 10, border: "none",
            color: "white", fontSize: 16, fontWeight: 600,
            display: "flex", justifyContent: "center", gap: 8
          }}
        >
          <Send /> Send Request
        </button>
      </div>
    </div>
  );
}
