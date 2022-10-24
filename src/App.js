import "./App.css"
import { useState, react } from "react"

function App() {
  const [userInput, setUserInput] = useState("")

  return (
    <div className="App">
      <h1>WPM Typing Test</h1>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></input>
    </div>
  )
}

export default App
