//Client component
"use client";

//Import statements
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  onAuthStateChanged,
  User,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

//News categories
const categories = ["RealEstate", "Politics", "Economy", "Technology", "Finance"];

/* @function: profilePage() ->
 */
const ProfilePage = () => {
  //State vars
  //user and user data
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState({
    name: "",
    interests: [] as string[],
    isAdmin: false,
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);

  //loading states
  const [loading, setLoading] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);

  //router for nav + auth for auth
  const router = useRouter();
  const auth = getAuth();

  /* @function -> useEffect(): React hook to manage auth state changes and fetch user data by watching for auth state changes in firebase.
     also fetches user information
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "users", currentUser.uid);
  
        //Fetch current user's data from Firestore
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserData({
            name: userData.name || currentUser.displayName || "",
            interests: userData.interests || [],
            isAdmin: userData.isAdmin || false,
          });
  
          //If logged in user is admin, fetch all users
          if (userData.isAdmin) {
            fetchAllUsers();
          }
        } else {
          //Fallback to Firebase Auth displayName if no Firestore data exists
          setUserData({
            name: currentUser.displayName || "",
            interests: [],
            isAdmin: false,
          });
        }
      } else {
        setUser(null);

        //push to login page
        router.push("/login");
      }
    });
  
    return () => unsubscribe();
  }, [auth, router]);
  

  /* @function -> fetchAllUsers(): function to fetch all users from the user collection in the Firebase db. Sets fetching users
     to true while fetching users, pulls in the users from the database, and sets allUsers to that data
   */
  const fetchAllUsers = async () => {
    //Set fetching users to true while fetching users
    setFetchingUsers(true);
    try {
      //Get users from firestore db
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      //Set all users to data
      setAllUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      //Done fetching users
      setFetchingUsers(false);
    }
  };

  /* @function -> toggleInterest(): Function to toggle users interst in a specific category
     @params -> category (string): String representing the news category being toggled
     @returns -> Updates the user's interest state to reflect the added/removed category
   */
  const toggleInterest = (category: string) => {
    setUserData((prev) => {
      const isSelected = prev.interests.includes(category);
      const updatedInterests = isSelected
        ? prev.interests.filter((interest) => interest !== category)
        : [...prev.interests, category];
      return { ...prev, interests: updatedInterests };
    });
  };

  /* @function -> handleUpdateProfile(): Function to update the profile upon form submission. Updates the user information in the
     Firebase store and displays an alert to the user (success/failure).
   */
  const handleUpdateProfile = async () => {
    //set loading equal to true while committing profile changes
    setLoading(true);
    try {
      if (user) {
        //Get user info
        const userDocRef = doc(db, "users", user.uid);
        
        //set doc data
        await setDoc(
          userDocRef,
          {
            name: userData.name,
            interests: userData.interests,
          },
          { merge: true }
        );

        //update user's display name
        await updateProfile(user, {
          displayName: userData.name,
        });
      }
      //success alert
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      //failure alert
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * @function -> handleDeleteUser(): function that handles the deletion of a user from the admin panel. Allows an admin to delete a user from
     Firebase auth and Firebase store. 
   * @param -> userId (string): String that represents the id of the user to delete from the collection in firebase db and auth
   */
  const handleDeleteUser = async (userId: string) => {
    //Confirm the user wants to delete the user
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        //delete document from collection "users"
        await deleteDoc(doc(db, "users", userId));
        //alert
        alert("User deleted successfully!");
        //refresh user list
        fetchAllUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  /*
   * @function -> handleToggleAdmin(): function that handles the promotion and demotion of a user->admin/admin->user. Pulls in isAdmin from doc
     and sets to opposite value.
   * @param -> userId (string): 
   * @param -> isAdmin (boolean): 
   */
  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(
        userDocRef,
        {
          isAdmin: !isAdmin,
        },
        { merge: true }
      );
      alert(`User has been ${!isAdmin ? "elevated to" : "demoted from"} admin.`);
      fetchAllUsers(); // Refresh user list
    } catch (error) {
      console.error("Error toggling admin status:", error);
      alert("Failed to update admin status. Please try again.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-wrap gap-8 w-full max-w-6xl">
        {/* Profile Section */}
        <div className="bg-white p-8 rounded-lg shadow-md w-full lg:w-1/2">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          {/* Email (Read-Only) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Interests */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleInterest(category)}
                  className={`px-4 py-2 rounded-full border ${
                    userData.interests.includes(category)
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-200 text-gray-700 border-gray-300"
                  } transition-all`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdateProfile}
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>

        {/* Admin Section */}
        {userData.isAdmin && (
          <div className="bg-white p-8 rounded-lg shadow-md w-full lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            {fetchingUsers ? (
              <p>Loading users...</p>
            ) : (
              <div className="overflow-y-auto max-h-96">
                {allUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center p-4 border-b"
                  >
                    <div>
                      <p className="font-bold">{user.name || "Unnamed User"}</p>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.isAdmin)}
                        className={`px-4 py-2 rounded-md ${
                          user.isAdmin
                            ? "bg-gray-400 text-white hover:bg-gray-500"
                            : "bg-teal-500 text-white hover:bg-teal-600"
                        }`}
                      >
                        {user.isAdmin ? "Demote" : "Elevate"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;



