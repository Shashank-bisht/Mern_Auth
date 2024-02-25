import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { getDownloadURL, getStorage } from "firebase/storage";
import { app } from "../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import {useDispatch} from 'react-redux'
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signout} from '../redux/user/userSlice'

const Profile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch()
  const [image, setImage] = useState(undefined);
  const [showMessage, setShowMessage] = useState(false);
  const [imagePercent, setImagePercent] = useState(0);
  const [formData, setFormData] = useState({});
  const [Error, setError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [updatesuccess, setupdatesuccess] = useState(false)
  const { currentUser, loading, error } = useSelector((state) => state.user);

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

 

  const handleChange = (e) => {
    setFormData({
      ...formData,[e.target.id]: e.target.value
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      console.log(res)
      if(data.success===false){
        console.log(data)
        dispatch(updateUserFailure(data))
        return 
      }else{
        dispatch(updateUserSuccess(data))
        setupdatesuccess(true)
         // Show the message
        setShowMessage(true);
        // Hide the message after 3 seconds
        setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      }
      }catch(error){
        dispatch(updateUserFailure(error))
      }   
  }

  const handlesignout = async() => {
    try {
      await fetch ('/api/auth/signout')
      dispatch(signout())
    } catch (error) {
    console.log(error)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      })
      const data = await res.json()
      if(data.success===false){
        dispatch(deleteUserFailure(data))
        return
      }
      dispatch(deleteUserSuccess())
    }catch(error){
      dispatch(deleteUserFailure(error))
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
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
            // if imagepercent is greater than 0 and less than 100 then show the percentage else show upload complete
            <span className="text-slate-700">{imagePercent}% uploading</span>
          ) : imagePercent === 100 ? (
            <span className="text-slate-700">Upload complete</span>
          ) : (
            <span></span>
          )}
        </p>
        <input onChange={handleChange}
          defaultValue={currentUser.username}
          type="text"
          id="username"
          placeholder="Username"
          className="bg-gray-100 rounded-lg w-4/5 h-11 px-3 py-1"
        />
        <input onChange={handleChange}
          defaultValue={currentUser.email}
          type="email"
          id="email"
          placeholder="Email"
          className="bg-gray-100 rounded-lg w-4/5 h-11 px-3 py-1"
        />
        <input onChange={handleChange}
          type="password" 
          id="password"
          placeholder="Password"
          className="bg-gray-100 rounded-lg w-4/5 h-11 px-3 py-1"
        />
        <button className="bg-slate-700 text-white p-3 w-4/5 rounded-lg uppercase hover:opacity-85 disabled:opacity-70">{
        loading ? "Updating..." : "Update"
        }
        </button>
      </form>
      <div className="flex flex-row items-center gap-3 justify-evenly mt-7">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer ">Delete</span>
        <div><p className="text-red-700 ">{error && "Something went wrong"}</p>
      <p className="text-green-700 "> {showMessage && <div>Profile updated successfully</div>}</p></div>
        <span onClick={handlesignout} className="text-red-700 cursor-pointer ">Sign Out</span>
      </div>
    </div>
  );
};

export default Profile;
