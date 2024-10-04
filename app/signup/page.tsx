"use client" //Client component


//Import Statements
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';

const SignupPage = () => {


    //Variable for name state, represents user's full name
    const [name, setName] = useState('');

    //Variable for email state, represents user's email address
    const [email, setEmail] = useState('');

    //Varaible for password state, represents user's password
    const [password, setPassword] = useState('');

    //Variable for error state, is either string or null, initialized to null
    const [error, setError] = useState<string | null>(null);

    //Initialize router for page navigation
    const router = useRouter();

    //BE function to handle submission of signup form
    const handleSignupSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {

            //Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            //user variable to represent the created user
            const user = userCredential.user;

            //Create document of user in db
            await setDoc(doc(db, 'users', user.uid), {
              name,
              email
            });

            //TO-DO: Create popup on successful registration for user
            console.log('User registered and additional data stored in Firestore');
            router.push('/login');

        } catch (error) {
            console.error("Error at registration: ", error);
            setError('Registration failed. Please check your details');
        }
    };

    //UI
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
                onChange={(e)=>setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Create a password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <button className="button" type="submit">Sign Up</button>
            </div>
          </form>
          <p className="mt-4 text-center">
            Already have an account? <a href="/login" className="text-green-500">Log In</a>
          </p>
        </div>
      </div>
    );
  };
  
  export default SignupPage;