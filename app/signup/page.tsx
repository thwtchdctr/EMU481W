"use client"; // Client component

// Import Statements
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

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

const SignupPage: React.FC = () => { // Added return type annotation React.FC
  // State variables for user details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Initialize router for page navigation
  const router = useRouter();

  // Function to handle interest selection
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };

  const isSelected = (interest: string) => selectedInterests.includes(interest);

  // Function to handle form submission
  const handleSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore with name, email, and interests
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        interests: selectedInterests,
      });

      console.log('User registered and additional data stored in Firestore');
      router.push('/login');
    } catch (error) {
      console.error('Error at registration: ', error);
      setError('Registration failed. Please check your details');
    }
  };

  // UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
                className={`px-3 py-2 border rounded-lg ${isSelected(interest) ? 'bg-green-500 text-white' : 'bg-gray-400'}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </button>
            ))}
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="text-right">
            <button className="px-4 py-2 bg-green-500 text-white rounded-lg" type="submit">Sign Up</button>
          </div>
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-green-500">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;


