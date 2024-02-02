import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { getDownloadURL, getStorage } from "firebase/storage";
import { app } from "../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
const Profile = () => {
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [formData, setFormData] = useState({});
  console.log(formData);
  const [imageError, setImageError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    // inside image there is property of name
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
        // console.log('Upload is ' + progress + '% done')
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({
            ...formData,
            profilePicture: downloadURL,
          });
        });
      }
    );
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col items-center gap-3">
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          className="h-24 w-24 self-center cursor-pointer rounded-full object-cover"
          alt=""
          onClick={() => fileRef.current.click()}
        />
        <p>
          {imageError ? (
            <span className="text-red-700">Something went wrong</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-slate-700">{imagePercent}% uploading</span>
          ) : imagePercent === 100 ? (
            <span className="text-slate-700">Upload complete</span>
          ) : (
            <span></span>
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-gray-100 rounded-lg w-4/5 h-11 px-3 py-1"
        />
        <input
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-gray-100 rounded-lg w-4/5 h-11 px-3 py-1"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-gray-100 rounded-lg w-4/5 h-11 px-3 py-1"
        />
        <button className="bg-slate-700 text-white p-3 w-4/5 rounded-lg uppercase hover:opacity-85 disabled:opacity-70">
          Update
        </button>
      </form>
      <div className="flex flex-row items-center gap-3 justify-evenly mt-7">
        <span className="text-red-700 cursor-pointer ">Delete</span>
        <span className="text-red-700 cursor-pointer ">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
