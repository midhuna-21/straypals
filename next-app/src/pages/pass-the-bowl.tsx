import { useState } from "react";
import { MessageSquare } from "lucide-react";

import AvailabilityPage from "../components/AvailabilityPage";
import SendRequestPage from "../components/SendRequestsPage";
import RequestsPage from "../components/RequestsPage";

import { useRouter } from "next/router";

export default function PassTheBowlSystem() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState("availability");
  const [selectedHelper, setSelectedHelper] = useState(null);

  const [userAvailability, setUserAvailability] = useState({
    isAvailable: false,
    location: "",
    radius: "",
  });

  const [helpRequest, setHelpRequest] = useState({
    strayName: "",
    taskType: "",
    location: "",
    urgency: "normal",
    description: "",
    photo: null,
    photoPreview: null,
  });

  const [requests, setRequests] = useState([]);

  const handleRequestAction = (requestId, action) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: action } : req
      )
    );
  };
  console.log(requests, 'requestsss fr')

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0f1a",
        color: "white",
        padding: 20,
      }}
    >

      {/* Availability */}
      {currentPage === "availability" && (
        <AvailabilityPage
          setCurrentPage={setCurrentPage}
          userAvailability={userAvailability}
          setUserAvailability={setUserAvailability}
          requests={requests}
        />
      )}

      {/* Send Request Page */}
      {currentPage === "send-request" && (
        <SendRequestPage
          setCurrentPage={setCurrentPage}
          selectedHelper={selectedHelper}
          helpRequest={helpRequest}
          setHelpRequest={setHelpRequest}
        />
      )}

      {/* Requests Page */}
      {currentPage === "requests" && (
        <RequestsPage
          requests={requests}
          handleRequestAction={handleRequestAction}
        />

      )}
    </div>
  );
}

