//Client component
"use client";

//Import Statements
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";

//List of interest for news subscription
const interestsList = [
  "RealEstate",
  "Finance",
  "Economy",
  "Politics",
  "Technology",
  "Other",
];

//Signup page React component
const SignupPage: React.FC = () => {
  //State variables for user details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false); // Admin checkbox state

  //Initialize router for page navigation
  const router = useRouter();

  /* @toggleInterest: Function to allow users to select interests to subscribe to while registering
     params: interest (string), represents the selected interest */
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  /* @isSelected: Function to check if the interest is selected 
     params: interest (string), represents interest
     return: boolean -> represents whether an interest has been selected */
  const isSelected = (interest: string) => selectedInterests.includes(interest);

  /* @handleSignupSubmit: Function to handle the submission of the signup form
     params: e (FormEvent), event of the form being submitted */
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      //Create the user credential in Firebase Auth and set user variable
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      //Update user profile display name in Firebase to allow for representation in application
      await updateProfile(user, { displayName: name });

      //Create user document in Firestore with name, email, interests, and admin status
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        interests: selectedInterests,
        isAdmin, // Store admin status in Firestore
      });

      //Sign user out (createUserWithEmailAndPassword automatically signs user in on registration complete)
      await signOut(auth);

      //Console success and push to login page
      console.log("User registered and additional data stored in Firestore");
      router.push("/login");
    } catch (error) {
      console.error("Error at registration: ", error);
      setError("Registration failed. Please check your details");
    }
  };

  // UI
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignupSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <h2 className="text-lg font-semibold mb-2">Select Your Interests</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {interestsList.map((interest) => (
              <button
                key={interest}
                type="button"
                className={`px-3 py-2 border rounded-lg ${
                  isSelected(interest)
                    ? "bg-green-500 text-white"
                    : "bg-gray-400 text-white"
                }`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="mr-2"
              />
              Register as Admin
            </label>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="text-right">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-green-500">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;

