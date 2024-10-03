"use client"

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

const SignupPage = () => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleSignupSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = {name, email, password};

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if(response.ok){
                console.log('User registered successfully');
                router.push('/');
            } else{
                console.log('Registration failed');
            }
        } catch (error) {
            console.error("Error at registration: ", error);
        }
    };


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