"use client"

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


const LoginPage = () => {

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const router = useRouter();

    const handleLoginSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const data = {email: loginEmail, password: loginPassword};

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if(response.ok){
                console.log('Login Successful');
                router.push('/');
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error during login: ', error);
        }
    };


    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <div className="text-right">
              <button className="button" type='submit'>Log In</button>
            </div>
          </form>
          <p className="mt-4 text-center">
            Forgot password? <a href="/password-reset" className="text-green-500">Reset Password</a>
          </p>
          <p className="mt-4 text-center">
            Don't have an account? <a href="/signup" className="text-green-500">Sign Up</a>
          </p>
        </div>
      </div>
    );
  };
  
  export default LoginPage;