// pages/requests.jsx
import { useEffect, useState } from "react";
import RequestsPageUI from "../components/RequestsPage";
import { getIncomingRequests, updateRequestStatus } from "../hooks/firestoreaction";

export default function RequestsRoute() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getIncomingRequests();  // 🔥🔥 fetch requests where receiverId == currentUser.uid
      setRequests(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return <p style={{ color: "white", textAlign: "center" }}>Loading requests...</p>;
  }

  return (
    <RequestsPageUI
      requests={requests}
      handleRequestAction={async (id, status) => {
        await updateRequestStatus(id, status);

        // refresh after action
        const updated = await getIncomingRequests();
        setRequests(updated);
      }}
    />
  );
}
