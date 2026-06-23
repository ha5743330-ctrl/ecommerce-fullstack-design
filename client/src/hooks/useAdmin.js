import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useAdmin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("Logged in User UID:", user.uid); // <--- CHECK YE CONSOLE MEIN
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            console.log("Document data:", userDoc.data()); // <--- CHECK YE CONSOLE MEIN
            if (userDoc.data().role === "admin") {
              setIsAdmin(true);
            } else {
              console.log("Role is NOT admin");
            }
          } else {
            console.log("No such document found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching role:", error);
        }
      } else {
        console.log("No user logged in");
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, loading };
};