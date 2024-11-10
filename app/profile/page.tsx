"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLogoutHook } from '../lib/logoutHook';
import { onAuthStateChanged, User } from "firebase/auth"; // Import getAuth instead of auth


const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const logout = useLogoutHook();

    const fetchUserFullName = async (uid: string) => {
        try {
            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setUserFullName(data?.name || null);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchUserFullName(user.uid);
            } else {
                setUser(null);
                setUserFullName(null);
            }
        });

        return () => unsubscribe();
    }, []);

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

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        // Add any logic to save/update the email in your database here
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Welcome, {userFullName ? userFullName : 'User'}
                </h2>

                {/* Display email text or input based on editing state */}
                <div className="flex items-center justify-center space-x-2">
                    {isEditing ? (
                        <input
                            type="text"
                            value={email}
                            onChange={handleEmailChange}
                            className="text-gray-700 border rounded px-2 py-1"
                        />
                    ) : (
                        <p className="text-gray-700">Email: {email}</p>
                    )}

                    <button
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                        className="px-0 py-0 border border-black"
                    >
                        <img
                            src="https://img.freepik.com/free-vector/illustration-paper_53876-5846.jpg?t=st=1731253527~exp=1731257127~hmac=1f8289bbfbb36e4432fc2da351f79516e0c30fe216cd930a165bd04d50441f81&w=826"
                            alt="Edit Email"
                            className="w-8 h-8 cursor-pointer"
                        />
                    </button>


                </div>

                <p className="mt-4">This is your profile page.</p>

                <button
                    className="mt-8 px-6 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-teal-700 hover:to-green-700 transition-all"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );

};

export default ProfilePage;



