'use client';

import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, User, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userFullName, setUserFullName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfilePicture, setUserProfilePicture] = useState<string | null>(null);
  const [birthdate, setBirthdate] = useState<string | null>(null); // Birthdate state
  const [newProfilePictureUrl, setNewProfilePictureUrl] = useState<string | null>(null); // URL for the new profile picture
  const [newProfilePictureFile, setNewProfilePictureFile] = useState<File | null>(null); // File for the new profile picture
  const router = useRouter();

  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserFullName(user.displayName || 'User');
        setUserEmail(user.email);
        setUserProfilePicture(user.photoURL || 'https://pbs.twimg.com/media/DCd2v0SXkAAT6EU.jpg'); // Default avatar

        // Safely handle the case where creationTime might be undefined
        setBirthdate(user.metadata.creationTime || null); // If creationTime is undefined, set birthdate as null
      } else {
        router.push('/login'); // Redirect to login if user is not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'displayName') {
      setUserFullName(e.target.value);
    }
    if (e.target.name === 'birthdate') {
      setBirthdate(e.target.value);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewProfilePictureFile(file);

      // Create a storage reference
      const storageRef = ref(storage, 'profile_pictures/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Monitor upload progress (optional)
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          // Get the uploaded file's download URL
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setNewProfilePictureUrl(downloadURL); // Store the URL of the uploaded image
            setUserProfilePicture(downloadURL);  // Set the user's profile picture to the new image
          });
        }
      );
    }
  };

  const handleProfilePictureUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setNewProfilePictureUrl(url); // Update the URL input field value
    setUserProfilePicture(url); // Set the profile picture to the new URL
  };

  const saveChanges = async () => {
    if (user) {
      try {
        // Update displayName
        await updateProfile(user, { displayName: userFullName || '' });

        // If there's a new profile picture URL or file, update the profile
        if (newProfilePictureUrl) {
          await updateProfile(user, { photoURL: newProfilePictureUrl });
        }

        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

        {user ? (
          <div>
            {/* Profile Picture */}
            <div className="text-center mb-6">
              <img
                src={userProfilePicture || 'https://pbs.twimg.com/media/DCd2v0SXkAAT6EU.jpg'}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
            </div>

            {/* Image Upload and URL Input */}
            <div className="mb-6">
              {/* Image Upload */}
              <div className="mb-4">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-600"
                />
              </div>

              {/* URL Input for Profile Picture */}
              <div className="mb-4">
                <label htmlFor="profilePictureUrl" className="block text-gray-700">Or Enter Image URL</label>
                <input
                  type="text"
                  id="profilePictureUrl"
                  value={newProfilePictureUrl || ''}
                  onChange={handleProfilePictureUrlChange}
                  className="mt-2 p-2 w-full border rounded-md"
                  placeholder="Enter image URL"
                />
              </div>
            </div>

            {/* Profile Form */}
            <form>
              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="displayName">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  id="displayName"
                  value={userFullName || ''}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail || ''}
                  disabled
                  className="mt-2 p-2 w-full border bg-gray-100 rounded-md cursor-not-allowed"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="birthdate">
                  Birthdate
                </label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthdate || ''}
                  onChange={handleInputChange}
                  className="mt-2 p-2 w-full border rounded-md"
                />
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={saveChanges}
                  className="w-full bg-teal-500 text-white py-2 rounded-md shadow-md hover:bg-teal-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <p>Please log in to view your profile.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
