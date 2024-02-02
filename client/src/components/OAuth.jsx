import React from 'react';
import { GoogleAuthProvider } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import {useNavigate} from 'react-router-dom'
const OAuth = () => {
    const dispatch = useDispatch();
const navigate = useNavigate()
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);
           //*console.log(result.user.email);
            // Check if user is defined before accessing properties
            if (result.user) {
                const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        // displayName , email , photoURL are key inside result.user
                        name: result.user.displayName,
                        email: result.user.email,
                        photo: result.user.photoURL,
                    }),
                });

                // Check if the response status is OK (2xx)
                if (res.ok) {
                    // .json() returns a promise that resolves with the parsed JSON data
                    const data = await res.json();
                    console.log('Data from server:', data);
                    // Adding data to the state
                    dispatch(signInSuccess(data));
                    navigate('/')

                } else {
                    console.error('Server error:', res.status, res.statusText);
                    // Handle error appropriately, e.g., display an error message
                }
            } else {
                console.log('User information not available.');
            }
        } catch (error) {
            console.error('Could not login with Google', error);
            // Handle error appropriately, e.g., display an error message
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full bg-red-500 text-white px-7 py-3 text-sm font-medium uppercase hover:opacity-65 rounded"
        >
            Continue with Google
        </button>
    );
};

export default OAuth;
