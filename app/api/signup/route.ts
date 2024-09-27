import {auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest){
    //Set a data variable equal to the json data of the POST request
    const data = await req.json();

    //Set variables equal to appropriate data from data.
    const {name, password, email} = data;

    try {
        //Create a new user with firebase authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        //create document of user, add to db
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email
        });

        return new Response(JSON.stringify({message: 'User has been registered successfully'}), {status: 200});

    } catch (err) {
        const error = err as Error;
        return new Response(JSON.stringify({message: 'Error creating user', error: error.message}), {status: 400})
    }
}