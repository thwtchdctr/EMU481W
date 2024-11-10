"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useLogoutHook } from '../lib/logoutHook';
import { onAuthStateChanged, User } from "firebase/auth"; // Import getAuth instead of auth

// List of interests for selection
const interestsList = [
    'Technology',
    'Sports',
    'Music',
    'Movies',
    'Travel',
    'Art',
    'Food',
    'Fitness',
    'Science',
    'Fashion',
];


const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState(user?.email || '');
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
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

    const toggleInterest = (interest: string) => {
        setSelectedInterests((prev) =>
            prev.includes(interest)
                ? prev.filter((item) => item !== interest)
                : [...prev, interest]
        );
    };

    const isSelected = (interest: string) => selectedInterests.includes(interest);

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
                        <p className="text-gray-700">Email: {user.email}</p>
                    )}

                    <button
                        onClick={isEditing ? handleSaveClick : handleEditClick}
                        className="px-2 py-1 border border-black"
                    >
                       Edit
                    </button>


                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {interestsList.map((interest) => (
                        <button
                            key={interest}
                            type="button"
                            className={`px-3 py-2 border rounded-lg ${isSelected(interest) ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                            onClick={() => toggleInterest(interest)}
                        >
                            {interest}
                        </button>
                    ))}
                </div>

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



