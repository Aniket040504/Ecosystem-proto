import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BhalswaDashboard from "./Bhalswa"; 
import LandingPage from "./Landing";  
import { motion } from "framer-motion";

function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<LandingPage navigate={navigate} />} />
      <Route path="/bhalswa" element={<BhalswaDashboard />} />
    </Routes>
  );
}

export default App;
