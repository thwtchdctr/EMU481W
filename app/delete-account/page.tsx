"use client";

import { FormEvent, useState } from 'react';

const AccountDeletionPage = () => {

    const [email, setEmail] = useState('');

    const handleAccountDeletionSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // Handle the account deletion logic here
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Delete Account</h2>
          <form onSubmit={handleAccountDeletionSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Confirm Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="text-right">
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg" type="submit">Delete Account</button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default AccountDeletionPage;
