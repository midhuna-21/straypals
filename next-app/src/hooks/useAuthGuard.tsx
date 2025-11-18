import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setShowAuthModal(false);
      } else {
        setUser(null);
        // Allow only home page
        if (pathname !== "/") {
          router.push("/?showAuth=true");
        }
        setShowAuthModal(true);
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return { showAuthModal, setShowAuthModal, user };
}
