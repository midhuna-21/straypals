'use client';

import React, { useEffect, useRef } from 'react';

export default function GooglePlacesAutocomplete({ onSelect }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Load Google script dynamically (frontend only)
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
        types: ['geocode'], // You can use ['(cities)'] for city-only
        componentRestrictions: { country: 'in' }, // restrict to India
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
        padding: '10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        fontSize: '16px',
      }}
    />
  );
}
