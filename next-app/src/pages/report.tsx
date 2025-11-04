"use client";

import { Camera, MapPin, Heart, Upload, X } from "lucide-react";
import { useState } from "react";
import GooglePlacesAutocomplete from '../hooks/useLoadGoogleMaps';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../lib/firebase';

export default function ReportPage() {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState("");
  const [petName, setPetName] = useState('');
  const [petPhoto, setPetPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [hoveredButton, setHoveredButton] = useState(null);

  const handleSelect = (place) => {
    if (place.geometry && place.geometry.location) {
      setSelectedLocation({
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    } else {
      setSelectedLocation({ address: place.formatted_address });
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(auth.currentUser);
    if (!petName || !petPhoto || !selectedLocation) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      console.log('is that working propelry')
      const storageRef = ref(storage, `pets/${Date.now()}_${petPhoto.name}`);
      await uploadBytes(storageRef, petPhoto);
      const photoURL = await getDownloadURL(storageRef);

      console.log(photoURL, 'photoURL')
      await addDoc(collection(db, 'pets'), {
        name: petName,
        photoURL: photoURL,
        location: selectedLocation.address,
        coordinates: {
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
        },
        createdAt: serverTimestamp(),
      });

      alert('🐾 Pet info saved successfully!');

      setPetName('');
      setPetPhoto(null);
      setPhotoPreview(null);
      setSelectedLocation(null);

    } catch (err) {
      console.error('Error saving pet data:', err);
      alert('Error saving data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };



  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`);
        },
        (error) => {
          alert("Unable to get location. Please enter manually.");
        }
      );
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      // background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      padding: "40px 20px",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    }}>
      {/* Background pattern */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />

      <div style={{
        maxWidth: "700px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}>
        {/* Header Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "48px",
        }}>
          <div style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "30px",
            marginBottom: "20px",
          }}>
            <span style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "#10b981",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}>
              🐾 Let’s do something for the strays, yeah?
            </span>
          </div>

          <h1 style={{
            margin: "0 0 16px 0",
            fontSize: "40px",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.7px",
            wordSpacing: "",
            lineHeight: "1.2",
          }}>
            They’re smiling ‘cause of you.
          </h1>

          <p style={{
            margin: 0,
            fontSize: "18px",
            color: "#94a3b8",
            lineHeight: "1.6",
            maxWidth: "600px",
            marginLeft: "auto",
            marginRight: "auto",
          }}>
            You turned a lonely moment into hope — that’s enough to make a difference.
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: "rgba(30, 41, 59, 0.6)",
          border: "1px solid rgba(51, 65, 85, 0.6)",
          borderRadius: "20px",
          padding: "40px",
          backdropFilter: "blur(10px)",
        }}>
          {/* Pet Name Field */}
          <div style={{ marginBottom: "32px" }}>

            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f1f5f9",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(245, 158, 11, 0.15)",
              }}>
                <Heart size={14} style={{ color: "#f59e0b" }} />
              </div>
              <span>Who’s this lovely soul?</span>
            </label>

            <div style={{ width: '100%' }}>
              {/* Pet name input */}
              <input
                type="text"
                className="small-placeholder"
                placeholder="e.g., Lucky, Bella, Scout..."
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: isFocused ? '1px solid #10b981' : '1px solid rgba(71, 85, 105, 0.5)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </div>

            <p style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "#64748b",
              fontStyle: "italic",
            }}>
              A name makes them real, makes them home
            </p>
          </div>

          {/* Photo Upload */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f1f5f9",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(59, 130, 246, 0.15)",
              }}>
                <Camera size={14} style={{ color: "#3b82f6" }} />
              </div>
              <span>Share a photo of your new friend</span>
            </label>

            {!image ? (
              <label style={{
                display: "block",
                padding: "48px 24px",
                background: "rgba(15, 23, 42, 0.6)",
                border: "2px dashed rgba(71, 85, 105, 0.5)",
                borderRadius: "12px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = "2px dashed #10b981";
                  e.currentTarget.style.background = "rgba(16, 185, 129, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = "2px dashed rgba(71, 85, 105, 0.5)";
                  e.currentTarget.style.background = "rgba(15, 23, 42, 0.6)";
                }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                <Upload size={40} style={{ color: "#64748b", marginBottom: "12px" }} />
                <p style={{ margin: 0, fontSize: "16px", color: "#cbd5e1", marginBottom: "4px" }}>
                  Click to upload
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                  A picture speaks a thousand words
                </p>
              </label>
            ) : (
              <div style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
              }}>
                <img
                  src={image}
                  alt="Uploaded pet"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <button
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.9)",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#dc2626";
                    e.currentTarget.style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(239, 68, 68, 0.9)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <X size={18} style={{ color: "#ffffff" }} />
                </button>
              </div>
            )}
          </div>

          {/* Location Field */}
          <div style={{ marginBottom: "40px" }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "14px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#f1f5f9",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                borderRadius: "6px",
                background: "rgba(16, 185, 129, 0.15)",
              }}>
                <MapPin size={14} style={{ color: "#10b981" }} />
              </div>
              <span>Where did you meet them?</span>
            </label>

            <div style={{ display: "flex", gap: "12px" }}>

              <GooglePlacesAutocomplete onSelect={handleSelect} />

            </div>
            <p style={{
              marginTop: "8px",
              fontSize: "13px",
              color: "#64748b",
              fontStyle: "italic",
            }}>
              This helps us coordinate care and find them again
            </p>
          </div>

          {/* Submit Button */}
          <button
            style={{
              width: "100%",
              padding: "16px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "none",
              borderRadius: "12px",
              color: "#ffffff",
              fontSize: "17px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 20px rgba(16, 185, 129, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 30px rgba(16, 185, 129, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(16, 185, 129, 0.3)";
            }}
          >
            Share to Care
          </button>

          {/* Encouraging Message */}
          <div style={{
            marginTop: "24px",
            padding: "20px",
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "12px",
            textAlign: "center",
          }}>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#cbd5e1",
              lineHeight: "1.6",
            }}>
              💚 Your kindness matters. Now, you're connecting them with
              people who can provide food, medical care, and maybe even a forever home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}