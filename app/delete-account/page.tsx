"use client";

import { FormEvent, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const AccountDeletionPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleAccountDeletionSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const user = auth.currentUser;
        if(user && email === user.email){
          try {
            const credential = EmailAuthProvider.credential(email, password);
            await reauthenticateWithCredential(user, credential);
            const userDocRef = doc(db, 'users', user.uid);
            await deleteDoc(userDocRef);
            await deleteUser(user);
            console.log("User data deleted");
            router.push('/');
            
          } catch (error) {
            console.error('Error deleting account: ', error);
          }
        } else if(user === null){
          console.log("User not logged in. Unable to delete account");
        } else {
          console.log("Email is incorrect. Unable to delete user.");
        }
        
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
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
