// import { useState } from 'react';
// import GooglePlacesAutocomplete from '../hooks/useLoadGoogleMaps';
// import { db, storage, auth } from '../lib/firebase';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { useAuthState } from 'react-firebase-hooks/auth';

// export default function ReportPage() {
//   const [petName, setPetName] = useState('');
//   const [petPhoto, setPetPhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [submittedData, setSubmittedData] = useState(null);

//   const handleSelect = (place) => {
//     if (place.geometry && place.geometry.location) {
//       setSelectedLocation({
//         address: place.formatted_address,
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//       });
//     } else {
//       setSelectedLocation({ address: place.formatted_address });
//     }
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPetPhoto(file);
//       const reader = new FileReader();
//       reader.onloadend = () => setPhotoPreview(reader.result);
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!petName || !petPhoto || !selectedLocation) {
//       alert('Please fill in all fields');
//       return;
//     }

//     setSubmittedData({
//       petName,
//       photoPreview,
//       location: selectedLocation,
//     });

//     alert('Form submitted successfully!');
//   };

//   const handleReset = () => {
//     setPetName('');
//     setPetPhoto(null);
//     setPhotoPreview(null);
//     setSelectedLocation(null);
//     setSubmittedData(null);
//   };

//   return (
//     <div
//       style={{
//         minHeight: '100vh',
//         background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 50%, #eff6ff 100%)',
//         padding: '48px 16px',
//       }}
//     >
//       <div style={{ maxWidth: '672px', margin: '0 auto' }}>
//         <div
//           style={{
//             background: '#ffffff',
//             borderRadius: '24px',
//             boxShadow:
//               '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
//             overflow: 'hidden',
//           }}
//         >
//           {/* Header */}
//           <div
//             style={{
//               background: 'linear-gradient(to right, #9333ea, #ec4899)',
//               padding: '32px',
//               color: '#ffffff',
//               textAlign: 'center',
//             }}
//           >
//             <h1
//               style={{
//                 fontSize: '28px',
//                 fontWeight: 'bold',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 gap: '12px',
//               }}
//             >
//               <span style={{ fontSize: '36px' }}>🐾</span>
//               Pet Location Register
//               <span style={{ fontSize: '36px' }}>🐾</span>
//             </h1>
//             <p style={{ marginTop: '8px', color: '#e9d5ff' }}>
//               Register your furry friend's information
//             </p>
//           </div>

//           {/* Form */}
//           <div style={{ padding: '32px' }}>
//             {/* Pet Name */}
//             <div style={{ marginBottom: '24px' }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '8px',
//                 }}
//               >
//                 Pet Name
//               </label>
//               <input
//                 type="text"
//                 value={petName}
//                 onChange={(e) => setPetName(e.target.value)}
//                 placeholder="Enter your pet's name"
//                 style={{
//                   width: '100%',
//                   padding: '12px 16px',
//                   border: '2px solid #e5e7eb',
//                   borderRadius: '12px',
//                   fontSize: '16px',
//                   outline: 'none',
//                 }}
//                 onFocus={(e) => (e.target.style.borderColor = '#9333ea')}
//                 onBlur={(e) => (e.target.style.borderColor = '#e5e7eb')}
//               />
//             </div>

//             {/* Pet Photo */}
//             <div style={{ marginBottom: '24px' }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '8px',
//                 }}
//               >
//                 Pet Photo
//               </label>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
//                 <label style={{ flex: 1, cursor: 'pointer' }}>
//                   <div
//                     style={{
//                       border: '2px dashed #d1d5db',
//                       borderRadius: '12px',
//                       padding: '24px',
//                       textAlign: 'center',
//                       transition: 'border-color 0.2s',
//                     }}
//                     onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#9333ea')}
//                     onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
//                   >
//                     <span style={{ fontSize: '32px' }}>📸</span>
//                     <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
//                       {petPhoto ? petPhoto.name : 'Click to upload photo'}
//                     </p>
//                   </div>
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handlePhotoChange}
//                     style={{ display: 'none' }}
//                   />
//                 </label>

//                 {photoPreview && (
//                   <div
//                     style={{
//                       width: '128px',
//                       height: '128px',
//                       borderRadius: '12px',
//                       overflow: 'hidden',
//                       border: '4px solid #e9d5ff',
//                       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//                     }}
//                   >
//                     <img
//                       src={photoPreview}
//                       alt="Pet preview"
//                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                     />
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Location */}
//             <div style={{ marginBottom: '24px' }}>
//               <label
//                 style={{
//                   display: 'block',
//                   fontSize: '14px',
//                   fontWeight: '600',
//                   color: '#374151',
//                   marginBottom: '8px',
//                 }}
//               >
//                 Location
//               </label>
//               <GooglePlacesAutocomplete onSelect={handleSelect} />
//               {selectedLocation && (
//                 <div
//                   style={{
//                     marginTop: '8px',
//                     padding: '12px',
//                     background: '#f0fdf4',
//                     border: '1px solid #bbf7d0',
//                     borderRadius: '8px',
//                     fontSize: '14px',
//                     color: '#166534',
//                   }}
//                 >
//                   ✓ Location selected: {selectedLocation.address}
//                 </div>
//               )}
//             </div>

//             {/* Buttons */}
//             <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
//               <button
//                 onClick={handleSubmit}
//                 style={{
//                   flex: 1,
//                   background: 'linear-gradient(to right, #9333ea, #ec4899)',
//                   color: '#fff',
//                   padding: '12px',
//                   borderRadius: '12px',
//                   fontWeight: '600',
//                   border: 'none',
//                   cursor: 'pointer',
//                   fontSize: '16px',
//                   boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.transform = 'translateY(-2px)';
//                   e.currentTarget.style.boxShadow =
//                     '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.transform = 'translateY(0)';
//                   e.currentTarget.style.boxShadow =
//                     '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
//                 }}
//               >
//                 Submit
//               </button>
//               <button
//                 onClick={handleReset}
//                 style={{
//                   padding: '12px 24px',
//                   background: '#e5e7eb',
//                   color: '#374151',
//                   borderRadius: '12px',
//                   fontWeight: '600',
//                   border: 'none',
//                   cursor: 'pointer',
//                   fontSize: '16px',
//                 }}
//                 onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#d1d5db')}
//                 onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e5e7eb')}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           {/* Submitted Data */}
//           {submittedData && (
//             <div
//               style={{
//                 margin: '0 32px 32px 32px',
//                 padding: '24px',
//                 background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)',
//                 borderRadius: '16px',
//                 border: '2px solid #e9d5ff',
//               }}
//             >
//               <h3
//                 style={{
//                   fontSize: '18px',
//                   fontWeight: 'bold',
//                   color: '#1f2937',
//                   marginBottom: '16px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px',
//                 }}
//               >
//                 <span>✨</span> Submitted Information
//               </h3>
//               <div style={{ display: 'grid', gap: '16px' }}>
//                 <div>
//                   <p style={{ fontSize: '14px', color: '#6b7280' }}>Pet Name</p>
//                   <p style={{ fontWeight: '600', color: '#1f2937' }}>
//                     {submittedData.petName}
//                   </p>
//                 </div>
//                 <div>
//                   <p style={{ fontSize: '14px', color: '#6b7280' }}>Location</p>
//                   <p style={{ fontWeight: '600', color: '#1f2937' }}>
//                     {submittedData.location.address}
//                   </p>
//                 </div>
//                 {submittedData.location.lat && (
//                   <>
//                     <div>
//                       <p style={{ fontSize: '14px', color: '#6b7280' }}>Latitude</p>
//                       <p style={{ fontWeight: '600', color: '#1f2937' }}>
//                         {submittedData.location.lat}
//                       </p>
//                     </div>
//                     <div>
//                       <p style={{ fontSize: '14px', color: '#6b7280' }}>Longitude</p>
//                       <p style={{ fontWeight: '600', color: '#1f2937' }}>
//                         {submittedData.location.lng}
//                       </p>
//                     </div>
//                   </>
//                 )}
//                 <div style={{ marginTop: '8px' }}>
//                   <p style={{ fontSize: '14px', color: '#6b7280' }}>Pet Photo</p>
//                   <div
//                     style={{
//                       width: '160px',
//                       height: '160px',
//                       borderRadius: '12px',
//                       overflow: 'hidden',
//                       border: '4px solid #c084fc',
//                       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//                     }}
//                   >
//                     <img
//                       src={submittedData.photoPreview}
//                       alt="Submitted pet"
//                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState } from 'react';
import GooglePlacesAutocomplete from '../hooks/useLoadGoogleMaps';
import { db, storage } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

    if (!petName || !petPhoto || !selectedLocation) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Upload photo to Firebase Storage
      const photoRef = ref(storage, `pets/${Date.now()}_${petPhoto.name}`);
      await uploadBytes(photoRef, petPhoto);
      const photoURL = await getDownloadURL(photoRef);

      // 2️⃣ Save info to Firestore
      await addDoc(collection(db, 'pets'), {
        petName,
        photoURL,
        location: selectedLocation,
        createdAt: serverTimestamp(),
      });

      alert('Pet info saved successfully! 🐾');
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
