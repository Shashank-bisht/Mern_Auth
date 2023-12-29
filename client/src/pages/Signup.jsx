import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
const Signup = () => {
  const [formData, setFormData] = useState({})
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  // console.log(formData)

  // Axios automatically sets the Content-Type header to 'application/json;charset=utf-8'
  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      setLoading(false)
      if (!res.ok) {
        // Handle the case where the server responds with an error
        const errorData = await res.json();
        setLoading(false)
        setError(true)
      }
      
    } catch (error) {
      setLoading(false)
      setError(true)
    }
   
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold my-7'>Signup</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
      <input type="text" placeholder='Username' id='username' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
      <input type="email" placeholder='Email' id='email' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
      <input type="password" placeholder='Password' id='password' className='bg-slate-100 p-3 rounded-lg' onChange={handleChange}/>
      <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-70'>{loading? 'loading...' : 'Sign Up'}</button>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Have an account?</p>
      <Link to='/sign-in'>
      <span className='text-blue-700'>Sign in</span>
      </Link>
    </div>
    <p className='text-red-500'>{error && 'Something went wrong, please try again'}</p> 
    </div>
  )
}

export default Signup