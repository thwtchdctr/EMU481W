import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export const useLogoutHook = () => {
    const router = useRouter();
  
    const logout = async () => {
      try {
        await signOut(auth);
        console.log('User logged out successfully');
        router.push('/');
      } catch (error) {
        console.error('Error logging out:', error);
      }
    };
  
    return logout;
};
