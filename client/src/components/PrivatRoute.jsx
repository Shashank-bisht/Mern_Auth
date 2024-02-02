import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
const PrivatRoute = () => {
    const {currentUser} = useSelector((state) => state.user)
  return (
    // if user is logged in show profile page else show sign in page
    currentUser?<Outlet/>: <Navigate to='/sign-in' />
  )
}

export default PrivatRoute