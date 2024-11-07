"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, User } from "firebase/auth"; // Import getAuth instead of auth

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const auth = getAuth(); // Initialize auth instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, router]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">
          Welcome, {user.displayName || user.email}
        </h2>
        <p className="text-gray-700">Email: {user.email}</p>
        <p className="mt-4">This is your profile page.</p>
      </div>
    </div>
  );
};

export default ProfilePage;



