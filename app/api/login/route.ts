import { NextRequest } from 'next/server';
import { auth } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: NextRequest) {
    try {
            const {email, password} = await req.json();
        
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
        
            return new Response(JSON.stringify({message: 'Login successful', user}), { status: 200});
    } catch (err) {
        const error = err as Error;
        return new Response(JSON.stringify({message: 'login failed', error: error.message}), {status: 401});
    }
}