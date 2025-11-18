// pages/available-helpers.jsx
import { useEffect, useState } from "react";
import AvailableHelpersPageUI from "../components/AvailableHelpersPage";
import { getAvailableHelpers } from "../hooks/firestoreaction";
import SendRequestModal from "../components/SendRequestModal";

export default function AvailableHelpersRoute() {
  const [availableHelpers, setAvailableHelpers] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: modal state
  const [selectedHelper, setSelectedHelper] = useState(null);

  useEffect(() => {
    const loadHelpers = async () => {
      try {
        const helpers = await getAvailableHelpers();
        setAvailableHelpers(helpers);
      } catch (err) {
        console.error("Failed to fetch helpers:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHelpers();
  }, []);

  if (loading) {
    return (
      <p style={{ color: "white", textAlign: "center", marginTop: 30 }}>
        Loading helpers...
      </p>
    );
  }

  return (
    <>
      {/* UI PAGE */}
      <AvailableHelpersPageUI 
        availableHelpers={availableHelpers} 
        setSelectedHelper={setSelectedHelper}
      />

      {/* MODAL */}
      {selectedHelper && (
        <SendRequestModal 
          helper={selectedHelper} 
          onClose={() => setSelectedHelper(null)} 
        />
      )}
    </>
  );
}
