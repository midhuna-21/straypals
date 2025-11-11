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

  // ✅ Close login modal after login
  useEffect(() => {
    if (user && showLoginModal) setShowLoginModal(false);
  }, [user, showLoginModal]);

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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // ✅ Open AuthModal instead of LoginWidget
  //   if (!user) {
  //     setShowAuthModal(true);
  //     return;
  //   }

  //   if (!validateFields()) return;

  //   try {
  //     setLoading(true);
  //     const storageRef = ref(storage, `pets/${Date.now()}_${petPhoto?.name}`);
  //     await uploadBytes(storageRef, petPhoto!);
  //     const photoURL = await getDownloadURL(storageRef);

  //     await addDoc(collection(db, "pets"), {
  //       name: petName,
  //       photoURL,
  //       location: selectedLocation?.address,
  //       coordinates: {
  //         lat: selectedLocation?.lat,
  //         lng: selectedLocation?.lng,
  //       },
  //       createdAt: serverTimestamp(),
  //       userId: user.uid,
  //     });

  //     alert("🐾 Pet info saved successfully!");
  //     setPetName("");
  //     setPetPhoto(null);
  //     setImage(null);
  //     setSelectedLocation(null);
  //     setErrors({});
  //   } catch (err: any) {
  //     console.error("Error saving pet data:", err);
  //     alert("Error saving data: " + err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        position: "relative",
      }}
    >
      {/* ✅ Login Modal */}
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
            <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
          </div>
        </div>
      )}

      {/* Background pattern */}
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

      <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "10px 20px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "30px",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#10b981",
                textTransform: "uppercase",
              }}
            >
              🐾 Let’s do something for the strays, yeah?
            </span>
          </div>

          <h1
            style={{
              fontSize: "40px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            They’re smiling ‘cause of you.
          </h1>
          <p
            style={{
              fontSize: "18px",
              color: "#94a3b8",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: "1.6",
            }}
          >
            You turned a lonely moment into hope — that’s enough to make a difference.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px solid rgba(51, 65, 85, 0.6)",
            borderRadius: "20px",
            padding: "40px",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Pet Name */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: "rgba(245, 158, 11, 0.15)",
                }}
              >
                <Heart size={14} style={{ color: "#f59e0b" }} />
              </div>
              <span>Who’s this lovely soul?</span>
            </label>

            <input
              type="text"
              value={petName}
              onChange={(e) => {
                setPetName(e.target.value);
                if (errors.petName) setErrors((prev) => ({ ...prev, petName: "" }));
              }}
              placeholder="e.g., Lucky, Bella, Scout..."
              style={{
                width: "100%",
                padding: "14px 18px",
                background: "rgba(15, 23, 42, 0.6)",
                border: errors.petName
                  ? "1px solid #ef4444"
                  : isFocused
                    ? "1px solid #10b981"
                    : "1px solid rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                fontSize: "16px",
                color: "#ffffff",
                outline: "none",
                transition: "all 0.3s ease",
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            {errors.petName && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                {errors.petName}
              </p>
            )}
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: "rgba(59, 130, 246, 0.15)",
                }}
              >
                <Camera size={14} style={{ color: "#3b82f6" }} />
              </div>
              <span>Share a photo of your new friend</span>
            </label>

            {!image ? (
              <label
                style={{
                  display: "block",
                  padding: "48px 24px",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: errors.photo
                    ? "2px dashed #ef4444"
                    : "2px dashed rgba(71, 85, 105, 0.5)",
                  borderRadius: "12px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <Upload size={40} style={{ color: "#64748b", marginBottom: "12px" }} />
                <p style={{ fontSize: "16px", color: "#cbd5e1" }}>Click to upload</p>
              </label>
            ) : (
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
                <img
                  src={image}
                  alt="Uploaded pet"
                  style={{ width: "100%", height: "300px", objectFit: "cover" }}
                />
                <button
                  onClick={removeImage}
                  type="button"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "rgba(24, 24, 24, 0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: "32px",
                    height: "32px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <X size={18} color="#fff" />
                </button>
              </div>
            )}
            {errors.photo && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                {errors.photo}
              </p>
            )}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "40px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "14px",
                fontSize: "15px",
                fontWeight: 600,
                color: "#f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  background: "rgba(16, 185, 129, 0.15)",
                }}
              >
                <MapPin size={14} style={{ color: "#10b981" }} />
              </div>
              <span>Where did you meet them?</span>
            </label>

            <GooglePlacesAutocomplete onSelect={handleSelect} error={errors.location} />
            {errors.location && (
              <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>
                {errors.location}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
              fontSize: "17px",
              fontWeight: 600,
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Share to Care"}
          </button>
        </form>

      </div>

      {showSuccessModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          <div
            style={{
              background: "rgba(30, 41, 59, 0.9)",
              border: "1px solid rgba(51, 65, 85, 0.6)",
              borderRadius: "16px",
              padding: "30px 40px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              backdropFilter: "blur(10px)",
              animation: "slideUp 0.3s ease-out",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                margin: "0 auto 16px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#10b981"
                stroke="none"
                style={{ width: "34px", height: "34px" }}
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
           4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 
           14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 
           6.86-8.55 11.54L12 21.35z" />
              </svg>

            </div>

            <h2
              style={{
                color: "#f1f5f9",
                fontSize: "20px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Much love!
            </h2>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "15px",
                lineHeight: "1.5",
                maxWidth: "280px",
                margin: "0 auto",
              }}
            >
              Look at you! Making the world a better place for furry friends.
            </p>
          </div>
        </div>
      )}



    </div>


  );
}

