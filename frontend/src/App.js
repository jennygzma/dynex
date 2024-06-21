// Filename - App.js

// Importing modules
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OnePiece from "./pages/one-piece";
import FistUxProto from "./pages/first-ux-proto";
import SecondUxProto from "./pages/second-ux-proto";
import Home from "./pages/current";
import { PlanProvider } from "./pages/current/hooks/plan-context";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PlanProvider>
              <Home />
            </PlanProvider>
          }
        />
        <Route path="/proto-2" element={<SecondUxProto />} />
        <Route path="/proto-1" element={<FistUxProto />} />
        <Route path="/one-piece" element={<OnePiece />} />
        {/* </Route> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
