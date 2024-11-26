"use client" //Client component

//Import statements
import { FormEvent, useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

/* @function -> PasswordResetPage(): Page that allows for a user to reset their account password via a reset email.
   functionality is almost entirely provided by built in Firebase functions.
 * @returns -> JSX Ui for the reset password page
 */
const PasswordResetPage = () => {
    //State vars
    const [resetEmail, setResetEmail] = useState('');

    //Router for nav
    const router = useRouter();

    /* @function -> handleResetSubmit(): Function that handles the submission of password reset
     * @param -> e (FormEvent): Event object from form submission
     */
    const handleResetSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            //Send password reset email
            await sendPasswordResetEmail(auth, resetEmail);
            console.log('Password email sent');

            //push to home page
            router.push('/');
        } catch (error) {
            console.error('Error sending password reset email: ', error);
        }
    }
    
    //UI
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
            <form onSubmit={handleResetSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}/>
              </div>
              <div className="text-right">
                <button className="button" type='submit'>Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      );
};

export default PasswordResetPage;