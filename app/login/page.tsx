//Mark as client-side component
"use client"

//Import statements
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {auth} from '../lib/firebase';
import { signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth';


const LoginPage = () => {
    //States to store loginEmail, loginPassword, login errors
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    //Initialize router to allow for navigation between pages
    const router = useRouter();

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {

          await setPersistence(auth, browserSessionPersistence); //Temporary until logout function is implemented
          const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
          console.log("User logged in successfully as: ", userCredential.user);
          router.push('/');
       
        } catch (error) {
            console.error('Error during login: ', error);
            setError('Login failed. Please check your credentials');
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 gradientBackground">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>

        {/* Display error message if login fails */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleLoginSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
                            className="w-full px-4 py-2 border border-[#B3E4D1] rounded-lg focus:outline-none focus:border-[#04C05F]"
                            placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
                            className="w-full px-4 py-2 border border-[#B3E4D1] rounded-lg focus:outline-none focus:border-[#04C05F]"
                            placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </div>
                    <div className="text-right">
                        <button className="bg-transparent border border-[#25B954] text-[#25B954] font-medium py-1.5 px-4 rounded-md hover:bg-[#25B954] hover:text-white transition-colors duration-300 ease-in-out" type="submit">
                            Log In
                        </button>
                    </div>

                    <div className="flex justify-end items-center space-x-2 mt-4">
                        <p className="subtext">
                            Forgot password? <Link href="/password-reset" className="bg-transparent border border-[#25B954] text-[#25B954] font-medium py-1.5 px-4 rounded-md hover:bg-[#25B954] hover:text-white transition-colors duration-300 ease-in-out mb-4" type="submit">Reset Password</Link>
                        </p>
                    </div>

                    <div className="flex justify-end items-center space-x-2 mt-4">
                        <p className="subtext">Don't have an account?</p>
                        <Link href="/signup" className="bg-transparent border border-[#25B954] text-[#25B954] font-medium py-1.5 px-4 rounded-md hover:bg-[#25B954] hover:text-white transition-colors duration-300 ease-in-out mb-4" type="submit">
                            Sign Up
                        </Link>
                    </div>

        </form>
      </div>
    </div>
  );
  };
  
  export default LoginPage;