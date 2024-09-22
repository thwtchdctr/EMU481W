import {auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(req){
    //Set a data variable equal to the json data of the POST request
    const data = await req.json();

    //Set variables equal to appropriate data from data.
    const {name, password, email, keywords} = data;

    try {
        //Create a new user with firebase authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        //create document of user, add to db
        await setDoc(doc(db, 'users', user.uid), {
            name: name,
            email: email,
            keywords: keywords,
        });

        return new Response(JSON.stringify({message: 'User has been registered successfully'}), {status: 200});

    } catch (error) {
        return new Response(JSON.stringify({message: 'Error creating user', error: error.message}), {status: 400})
    }
}
