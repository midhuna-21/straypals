  'use client';

  import React, { useEffect, useRef, useState } from 'react';

  interface GooglePlacesAutocompleteProps {
    onSelect: (place: google.maps.places.PlaceResult) => void;
    error?: string; // 👈 for red border if invalid
  }

  export default function GooglePlacesAutocomplete({
    onSelect,
    error,
  }: GooglePlacesAutocompleteProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

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
        if (!window.google || !inputRef.current) return;
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'in' },
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          onSelect(place);
        });
      }
    }, [onSelect]);

    return (
      <input
        ref={inputRef}
        type="text"
        placeholder="Search for a location..."
        className="small-placeholder"
        style={{
          width: '100%',
          flex: 1,
          padding: '14px 18px',
          background: 'rgba(15, 23, 42, 0.6)',
          border: error
            ? '1px solid #ef4444'
            : isFocused
            ? '1px solid #10b981'
            : '1px solid rgba(71, 85, 105, 0.5)',
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
    );
  }
