'use client';

import React, { useEffect, useRef } from 'react';

export default function GooglePlacesAutocomplete({ onSelect }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const existingScript = document.getElementById('googleMaps');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'googleMaps';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }

    function initAutocomplete() {
      if (!window.google) return;
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['geocode'], 
        componentRestrictions: { country: 'in' }, 
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (onSelect) onSelect(place);
      });
    }
  }, [onSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search for a location..."
      style={{
        width: '100%',
        flex: 1,
                  padding: "14px 18px",
                  background: "rgba(15, 23, 42, 0.6)",
                  fontSize: "16px",
                  color: "#ffffff",
                  outline: "none",
                  transition: "all 0.3s ease",
      }}
    />
  );
}