import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

const Forgot = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [message, setmessage] = useState("");
 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // formdata syntax => {username: shanky, email: 9wUgQ@example.com, password: 123}
  // console.log(formData)

  // Axios automatically sets the Content-Type header to 'application/json;charset=utf-8' but fetch does not

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // see vite.config.js file for path realted query
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // in axios stringify is not needed
        body: JSON.stringify(formData),
        // The body: JSON.stringify(formData) part of a fetch request is used to convert a JavaScript object (formData) into a JSON-formatted string. This is necessary when sending data in the body of an HTTP request, especially when the server expects JSON data.
      });
    

      if (!res.ok) {
        const errorData = await res.json();
        console.log(errorData);
        setError(true);
      } else {
        // Redirect to sign-in page only if the signup is successful
        setmessage("Check your email for further instructions");
      }

    } catch (error) {
      setError(true);
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Enter Your Email</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        {/* email */}
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-70">
          Send
        </button>
      </form>
      <p className="text-green-500">{message}</p>
      <p className="text-red-500">
        {/* if error is true show this statement */}
        {error && "Something went wrong"}
      </p>
    </div>
  );
};

export default Forgot;
