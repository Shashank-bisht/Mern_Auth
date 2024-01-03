import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signInStart, signInSuccess, signInFailure } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
const Signin = () => {
  const [formData, setFormData] = useState({});
 const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  // formdata syntax => username: shanky, email: 9wUgQ@example.com
  // console.log(formData)

  // Axios automatically sets the Content-Type header to 'application/json;charset=utf-8' but fetch does not

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // setLoading(true);
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        // The body: JSON.stringify(formData) part of a fetch request is used to convert a JavaScript object (formData) into a JSON-formatted string. This is necessary when sending data in the body of an HTTP request, especially when the server expects JSON data.
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      if (!res.ok) {
        // Handle the case where the server responds with an error
        const errorData = await res.json();
        // setLoading(false);
        dispatch(signInFailure(errorData));
        // setError(true);
      }
      navigate('/')
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-70">
          {loading ? "loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't Have an account?</p>
        <Link to="/sign-up">
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      <p className="text-red-500">
        {/* if error is true show this statement */}
        {error && "Something went wrong, please try again"}
      </p>
    </div>
  );
};

export default Signin;
