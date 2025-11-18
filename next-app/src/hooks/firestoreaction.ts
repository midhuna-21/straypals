import { auth, db, storage } from "../lib/firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  setDoc,
   getDocs, query, where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// AUTO-ID for AVAILABILITY
// export const updateAvailability = async (data) => {
//   return await addDoc(collection(db, "availability",), {
//     ...data,
//     id:data.uid,
//     createdAt: serverTimestamp(),
//   });
// };

export const getAvailableHelpers = async () => {
  const uid = auth.currentUser?.uid;

  // 1. Get available users
  const q = query(
    collection(db, "availability"),
    where("isAvailable", "==", true)
  );

  const snapshot = await getDocs(q);

  let availabilityList = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));

  // Remove current user
  availabilityList = availabilityList.filter((h) => h.id !== uid);

  console.log(availabilityList,'availity')
  // 2. Fetch profile for each helper
  const helpersWithProfile = await Promise.all(
    availabilityList.map(async (helper) => {
      const userDoc = await getDocs(
        query(collection(db, "users"), where("__name__", "==", helper.id))
      );

      let profile = userDoc.docs[0]?.data() || {};

      return {
        ...helper,
        ...profile,         // Merge user profile into helper data
      };
    })

  );

  return helpersWithProfile;
};


export const updateAvailability = async (data) => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("User not logged in");

  return await setDoc(
    doc(db, "availability", uid),   // SAME document each time
    {
      ...data,
      id: uid,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
};
export const getIncomingRequests = async () => {
  const uid = auth.currentUser?.uid;

  const q = query(
    collection(db, "requests"),
    where("receiverId", "==", uid)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
};


// UPDATE request status
export const updateRequestStatus = async (id, status) => {
  return await updateDoc(doc(db, "requests", id), {
    status,
    updatedAt: serverTimestamp(),
  });
};

// IMAGE UPLOAD
export const uploadImage = async (file, folder) => {
  const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
};

// SUBSCRIBE to requests (live)
export const subscribeToRequests = (callback) => {
  return onSnapshot(collection(db, "requests"), (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

// SUBSCRIBE to available helpers (live)
export const subscribeToAvailableHelpers = (callback) => {
  return onSnapshot(collection(db, "availability"), (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    callback(items);
  });
};

export const addHelpRequest = async (data) => {
  return await addDoc(collection(db, "requests"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp(),
  });
};
