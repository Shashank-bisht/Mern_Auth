import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import OAuth from "../components/OAuth";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      // see vite.config.js file for path realted query
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // in axios stringify is not needed
        body: JSON.stringify(formData),
        // The body: JSON.stringify(formData) part of a fetch request is used to convert a JavaScript object (formData) into a JSON-formatted string. This is necessary when sending data in the body of an HTTP request, especially when the server expects JSON data.
      });
      setLoading(false);

      if (!res.ok) {
        // Handle the case where the server responds with an error
        const errorData = await res.json();
        console.log(errorData);
        setLoading(false);
        setError(true);
      }
      // if response is ok, redirect to sign-in page 
      navigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Signup</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        {/* username */}
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        {/* email */}
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        {/* password */}
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />

        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-70">
          {loading ? "loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      <p className="text-red-500">
        {/* if error is true show this statement */}
        {error && "Something went wrong, please try again"}
      </p>
    </div>
  );
};

export default Signup;
