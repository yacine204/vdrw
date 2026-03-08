import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Join from "./pages/join";



function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      localStorage.removeItem("user");
    }
  }, []);

  return (
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path="/signup" element={<Signup></Signup>}></Route>
      <Route path="/join" element={<Join user={user}></Join>}></Route>
    </Routes>
  )};


export default App;
