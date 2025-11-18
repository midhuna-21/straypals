import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff, FiMapPin } from "react-icons/fi";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (place: SelectedLocation) => void;
};

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

export default function AuthModal({ open, onClose, onSelect }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [location, setLocation] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;

    function initAutocomplete() {
      if (!window.google || !inputRef.current) {
        setTimeout(initAutocomplete, 100);
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current!, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place || !place.geometry) return;

        const selected = {
          address: place.formatted_address || "",
          lat: place.geometry.location?.lat(),
          lng: place.geometry.location?.lng(),
        };

        setLocation(selected.address);
        setSelectedLocation(selected);
        onSelect(selected);
      });
    }

    if (!window.google) {
      const existingScript = document.getElementById("googleMaps");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "googleMaps";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = initAutocomplete;
        document.body.appendChild(script);
      } else {
        setTimeout(initAutocomplete, 100);
      }
    } else {
      setTimeout(initAutocomplete, 100);
    }
  }, [open, onSelect]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErr("");
  //   setBusy(true);

  //   try {
  //     if (mode === "signup") {
  //       console.log("Signing up:", { email, password, name, location });
  //     } else {
  //       console.log("Signing in:", { email, password });
  //     }

  //     setTimeout(() => {
  //       onClose();
  //       setBusy(false);
  //     }, 1000);
  //   } catch (e: any) {
  //     setErr(e?.message || "Authentication failed");
  //     setBusy(false);
  //   }
  // };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      if (mode === "signup") {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "users", user.uid), {
          name,
          email,
          location: selectedLocation?.address || location || "",
          lat: selectedLocation?.lat || null,
          lng: selectedLocation?.lng || null,
          createdAt: new Date().toISOString(),
        });

        console.log("User registered:", user.uid);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in successfully");
      }

      setBusy(false);
      onClose();
    } catch (error: any) {
      console.error("Auth error:", error);
      setErr(error.message || "Authentication failed");
      setBusy(false);
    }
  };


  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "100vw",
        zIndex: 1000,
        display: "flex",
        justifyContent: "flex-end",
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "440px",
          maxWidth: "100vw",
          background: "white",
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.3)",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "32px 32px 48px 32px", position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,0.2)",
              color: "black",
              cursor: "pointer",
              fontSize: 20,
            }}
          >
            ×
          </button>

          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "black" }}>
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

        {/* Form */}
        <div style={{ padding: "32px", flex: 1 }}>
          <form onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                  Full Name
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                  }}
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                Email Address
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                }}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20, position: "relative" }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                Password
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  paddingRight: "42px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                }}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "34px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            {mode === "signup" && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600 }}>
                  Location
                </label>
                <div style={{ position: "relative" }}>
                  <FiMapPin
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#94a3b8",
                    }}
                    size={16}
                  />
                  <input
                    ref={inputRef}
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search for a location..."
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 40px",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: 10,
                    }}
                  />
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
                  Help us connect you with local opportunities
                </p>
              </div>
            )}

            {err && (
              <div
                style={{
                  padding: "10px 14px",
                  marginBottom: 16,
                  background: "#fef2f2",
                  color: "#dc2626",
                  fontSize: 13,
                  borderRadius: 8,
                  border: "1px solid #fecaca",
                }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={{
                width: "100%",
                padding: "11px 16px",
                fontWeight: 600,
                border: "none",
                borderRadius: 10,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "Please wait…" : mode === "signup" ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 10 }}>
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setErr("");
              }}
              style={{ color: "#667eea", fontWeight: 600, cursor: "pointer" }}
            >
              {mode === "signup" ? "Sign In" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
