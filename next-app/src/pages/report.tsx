"use client";

import { Camera, MapPin, Heart, Upload, X } from "lucide-react";
import { useState, useEffect } from "react";
import GooglePlacesAutocomplete from "../hooks/useLoadGoogleMaps";
import { db, storage, auth } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import LoginWidget from "../components/LoginWidget";
import AuthModal from "../components/AuthModal";
import Header from "../components/Header";

interface FormErrors {
  petName?: string;
  photo?: string;
  location?: string;
}

interface SelectedLocation {
  address: string;
  lat?: number;
  lng?: number;
}

export default function ReportPage() {
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [petName, setPetName] = useState<string>("");
  const [petPhoto, setPetPhoto] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => setShowSuccessModal(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessModal]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && showLoginModal) setShowLoginModal(false);
  }, [user, showLoginModal]);

  const handleSelectLocation = (place: any) => {
    console.log("User selected location:", place);
  };

  const handleSelect = (place: any) => {
    if (place?.geometry && place.geometry.location) {
      setSelectedLocation({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      setSelectedLocation({ address: place.formatted_address });
    }
    setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPetPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, photo: "" }));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPetPhoto(null);
  };

  const validateFields = (): boolean => {
    const newErrors: FormErrors = {};
    if (!petName.trim()) newErrors.petName = "Please enter a name.";
    if (!petPhoto) newErrors.photo = "Please upload a photo.";
    if (!selectedLocation) newErrors.location = "Please select a location.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!validateFields()) return;

    try {
      setLoading(true);
      const storageRef = ref(storage, `pets/${Date.now()}_${petPhoto?.name}`);
      await uploadBytes(storageRef, petPhoto!);
      const photoURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "pets"), {
        name: petName,
        photoURL,
        location: selectedLocation?.address,
        coordinates: {
          lat: selectedLocation?.lat,
          lng: selectedLocation?.lng,
        },
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      setShowSuccessModal(true);
      setPetName("");
      setPetPhoto(null);
      setImage(null);
      setSelectedLocation(null);
      setErrors({});
    } catch (err: any) {
      console.error("Error saving pet data:", err);
      alert("Error saving data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // === NEW: single container style used across the page ===
  const CONTAINER_STYLE: React.CSSProperties = {
    maxWidth: "1200px",      // change once to affect whole page alignment
    padding: "70px 55px",       // left/right gutter
    margin: "0 auto",
    boxSizing: "border-box",
    width: "100%",
  };

  return (
    <div>
         <Header/>
            <div
      style={{
        minHeight: "100vh",
        padding: "40px 0",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        position: "relative",
        background: "#000",
      }}
    >
   
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} onSelect={handleSelectLocation} />
          </div>
        </div>
      )}

      {/* subtle dot texture (global) */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.03,
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* ====== PAGE INNER (uses single container) ====== */}
      <div style={{ ...CONTAINER_STYLE, paddingTop: "100px", paddingBottom: "100px" }}>
        {/* TWO-COLUMN WRAPPER - keeps exact left/right alignment as other pages */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* LEFT - TEXT (keeps same horizontal position as other pages using CONTAINER_STYLE) */}
          <div style={{ paddingRight: "20px" }}>
            <h1
              style={{
                fontSize: "52px",
                color: "#fff",
                fontFamily: "Playfair Display",
                fontWeight: 700,
                marginBottom: "20px",
                lineHeight: "1.15",
                letterSpacing: "-1px",
              }}
            >
              Report a stray,
              <span style={{ color: "var(--gold-light)", display: "block" }}>
                show some kindness.
              </span>
            </h1>

            <p
              style={{
                fontSize: "20px",
                lineHeight: "1.7",
                color: "rgba(255,255,255,0.65)",
                maxWidth: "500px",
              }}
            >
              Each report helps connect a stray to the right people—volunteers,
              feeders, rescuers, and the community. Your compassion creates a path to safety.
            </p>

            <p
              style={{
                marginTop: "30px",
                fontSize: "17px",
                color: "rgba(255,255,255,0.45)",
                maxWidth: "450px",
                lineHeight: "1.6",
              }}
            >
              Share a name, a photo, and the place you last met them. That’s all it takes to make sure they’re noticed and cared for.
            </p>
          </div>

          {/* RIGHT - FORM (small, minimal, same width fields) */}
          <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "420px", marginLeft: "auto", padding: "0" }}>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "15px", color: "rgba(255,255,255,0.85)", marginBottom: "8px", fontWeight: 500 }}>
              Who’s this lovely soul?
              </label>

              <input
                type="text"
                value={petName}
                placeholder="Shadow, Luna, Ranger…"
                onChange={(e) => setPetName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 0",
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff",
                  fontSize: "15px",
                  outline: "none",
                  transition: "0.15s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderBottom = "1px solid rgba(255,255,255,0.45)")}
                onBlur={(e) => (e.currentTarget.style.borderBottom = "1px solid rgba(255,255,255,0.18)")}
              />
              {errors.petName && <p style={{ color: "#e04f5f", marginTop: "6px", fontSize: "12px" }}>{errors.petName}</p>}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "15px", color: "rgba(255,255,255,0.85)", marginBottom: "8px", fontWeight: 500 }}>
              Share a photo of your new friend
              </label>

              {!image ? (
                <label style={{ display: "block", width: "100%", padding: "32px 0", textAlign: "center", border: "1px dashed rgba(255,255,255,0.18)", borderRadius: "8px", cursor: "pointer" }}>
                  <input type="file" onChange={handleImageUpload} style={{ display: "none" }} />
                  <Upload size={28} color="rgba(255,255,255,0.4)" />
                  <p style={{ marginTop: "8px", fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>Click to upload</p>
                </label>
              ) : (
                <div style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={image as string} style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }} />
                  <button type="button" onClick={removeImage} style={{ position: "absolute", top: "10px", right: "10px", width: "28px", height: "28px", borderRadius: "50%", background: "rgba(0,0,0,0.8)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <X size={16} color="#fff" />
                  </button>
                </div>
              )}

              {errors.photo && <p style={{ color: "#e04f5f", marginTop: "6px", fontSize: "12px" }}>{errors.photo}</p>}
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label style={{ display: "block", fontSize: "15px", color: "rgba(255,255,255,0.85)", marginBottom: "8px", fontWeight: 500 }}>
                Where did you meet them?
              </label>

              <div style={{ marginBottom: "6px" }}>
                <GooglePlacesAutocomplete onSelect={handleSelect} error={errors.location} />
              </div>

              {errors.location && <p style={{ color: "#e04f5f", fontSize: "12px" }}>{errors.location}</p>}
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 0",
                background: "#1a1a1a",
                color: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#2a2a2a";
                (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a";
                (e.currentTarget as HTMLButtonElement).style.border = "1px solid rgba(255,255,255,0.12)";
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>

      {/* success modal */}
      {showSuccessModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "rgba(30,41,59,0.95)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", padding: "28px 36px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, margin: "0 auto 12px", borderRadius: "50%", background: "rgba(207,168,92,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" style={{ width: 28, height: 28 }}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>

            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Much love!</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.4 }}>Look at you! Making the world a better place for furry friends.</p>
          </div>
        </div>
      )}
    </div>
    </div>

  );
}
  