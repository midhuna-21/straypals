import { useState } from 'react';
import GooglePlacesAutocomplete from '../hooks/useLoadGoogleMaps';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../lib/firebase';


export default function ReportPage() {
  const [petName, setPetName] = useState('');
  const [petPhoto, setPetPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPetPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
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

    console.log(photoURL,'photoURL')
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


  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 50%, #eff6ff 100%)',
        padding: '48px 16px',
      }}
    >
      <div style={{ maxWidth: '672px', margin: '0 auto' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(to right, #9333ea, #ec4899)',
              padding: '32px',
              color: '#ffffff',
              textAlign: 'center',
            }}
          >
            <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>🐾 Pet Report 🐾</h1>
            <p style={{ marginTop: '8px', color: '#e9d5ff' }}>
              Report or register a pet with its location
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
            {/* Pet Name */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Pet Name
              </label>
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Enter pet's name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Pet Photo */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Pet Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ marginBottom: '12px' }}
              />
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  style={{
                    width: '160px',
                    height: '160px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '3px solid #c084fc',
                  }}
                />
              )}
            </div>

            {/* Location */}
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px',
                }}
              >
                Location
              </label>
              <GooglePlacesAutocomplete onSelect={handleSelect} />
              {selectedLocation && (
                <div
                  style={{
                    marginTop: '8px',
                    padding: '12px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#166534',
                  }}
                >
                  ✓ {selectedLocation.address}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading
                  ? '#a78bfa'
                  : 'linear-gradient(to right, #9333ea, #ec4899)',
                color: '#fff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {loading ? 'Saving...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
