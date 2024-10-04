import { auth } from './firebase'; // Import Firebase auth instance
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const logoutHook = () => {
    const router = useRouter(); // useRouter is only used within this hook, which is a valid usage of hooks
  
    const logout = async () => {
      try {
        await signOut(auth); // Sign out the current user
        console.log('User logged out successfully');
        router.push('/'); // Redirect to the homepage after logout
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  
    return logout; // Return the logout function
  };
