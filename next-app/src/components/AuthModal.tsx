import { useEffect, useState, useRef } from "react";
import { FiEye, FiEyeOff, FiMapPin } from "react-icons/fi";
import GooglePlacesAutocomplete from "../hooks/useLoadGoogleMaps";

type Props = { open: boolean; onClose: () => void };

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

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  if (!open) return null;



  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErr("");
    setBusy(true);

    try {
      if (mode === "signup") {
        console.log("Signing up:", { email, password, name, location });
      } else {
        console.log("Signing in:", { email, password });
      }

      setTimeout(() => {
        onClose();
        setBusy(false);
      }, 1000);
    } catch (e: any) {
      setErr(e?.message || "Authentication failed");
      setBusy(false);
    }
  };

    const handleSelect = (place: any) => {
    if (place.geometry && place.geometry.location) {
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
        animation: "fadeIn 0.3s ease-out",
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
          transform: "translateX(0)",
          animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "32px 32px 48px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              top: "-80px",
              right: "-60px",
              filter: "blur(40px)",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              bottom: "-50px",
              left: "-40px",
              filter: "blur(40px)",
            }}
          ></div>

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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
              fontSize: 20,
              zIndex: 10,
            }}
          >
            ×
          </button>

          <h2
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 700,
              color: "black",
              letterSpacing: "-0.02em",
              position: "relative",
              zIndex: 2,
            }}
          >
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

        {/* Form */}
        <div style={{ padding: "32px", flex: 1 }}>
          {mode === "signup" && (
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
                Full Name
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  fontSize: 14,
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  outline: "none",
                  background: "#fafbfc",
                  transition: "all 0.2s",
                }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Email Address
            </label>
            <input
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: 14,
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                outline: "none",
                background: "#fafbfc",
                transition: "all 0.2s",
              }}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: mode === "signup" ? 16 : 20, position: "relative" }}>
            <label
              style={{
                display: "block",
                marginBottom: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "#334155",
              }}
            >
              Password
            </label>

            <input
              style={{
                width: "100%",
                padding: "10px 14px",
                paddingRight: "42px",
                fontSize: 14,
                border: "1.5px solid #e2e8f0",
                borderRadius: 10,
                outline: "none",
                background: "#fafbfc",
              }}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: "12px",
                top: "34px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>

          {mode === "signup" && (
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#334155",
                }}
              >
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
                {/* <input
                  ref={inputRef}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search for a location..."
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 40px",
                    fontSize: "14px",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    background: "#fafbfc",
                    outline: "none",
                  }}
                /> */}
                <GooglePlacesAutocomplete onSelect={handleSelect} error={errors.location} />
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  margin: "6px 0 0 0",
                }}
              >
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
            onClick={handleSubmit}
            disabled={busy}
            style={{
              width: "100%",
              padding: "11px 16px",
              fontSize: 14,
              fontWeight: 600,
              border: "none",
              borderRadius: 10,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              cursor: busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.6 : 1,
              transition: "all 0.3s",
              marginBottom: 10,
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.25)",
            }}
          >
            {busy
              ? "Please wait…"
              : mode === "signup"
              ? "Create Account"
              : "Sign In"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              margin: "1px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                borderBottom: "1.5px solid #e2e8f0",
              }}
            ></div>
            <span
              style={{
                padding: "0 12px",
                color: "#94a3b8",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                borderBottom: "1.5px solid #e2e8f0",
              }}
            ></div>
          </div>

          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              color: "#64748b",
              marginTop: 10,
            }}
          >
            {mode === "signup"
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <span
              onClick={() => {
                setMode(mode === "signup" ? "signin" : "signup");
                setErr("");
              }}
              style={{
                color: "#667eea",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {mode === "signup" ? "Sign In" : "Sign Up"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
