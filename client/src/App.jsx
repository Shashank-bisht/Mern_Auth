import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import PrivatRoute from "./components/PrivatRoute";
import Forgot from "./pages/Forgot";
import Resetpassword from "./pages/Resetpassword";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route  element={<PrivatRoute/>} >
        <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/forgot-passowrd" element={<Forgot />} />
        <Route path="/reset-password/:id/:token" element={<Resetpassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
