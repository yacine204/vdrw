import { Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Join from "./pages/join";
import Chat from "./pages/game_interface/chat";
import Canvas from "./pages/game_interface/canvas";
import Vdrw from "./pages/game_interface/vdrw";
import Host from "./pages/host";
import Menu from "./pages/menu";

function StaticCanvasPreview() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  return (
    <Canvas
      canvasRef={canvasRef}
      color="#000000"
      size={4}
      sendStroke={() => {}}
      canDraw={false}
    />
  );
}

function App() {

  const [user] = useState<any>(() => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
  });

  return (
    <Routes>
      <Route path='/' element={<Home></Home>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path="/signup" element={<Signup></Signup>}></Route>
      <Route path="/join" element={<Join user={user}></Join>}></Route>
      <Route path="/chat" element={<Chat user={user}></Chat>}></Route>
      <Route path="/canvas" element={<StaticCanvasPreview />}></Route>
      <Route path='/vdrw' element={<Vdrw user={user}></Vdrw>}></Route>
      <Route path="/host" element={<Host user={user}></Host>}></Route>
      <Route path='/menu' element = {<Menu user={user}></Menu>}></Route>
    </Routes>
  )};


export default App;
