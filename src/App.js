import "./App.css"
import { useState, react, useRef, useEffect } from "react"
import { useNavigate, Routes, Route } from "react-router-dom"
import StandardText from "./pages/StandardText"
import RandomText from "./pages/RandomText"

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<StandardText />} />
        <Route path="/randomize" element={<RandomText />} />
      </Routes>
    </main>
  )
}

export default App
