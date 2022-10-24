import "./App.css"
import { useState, react, useRef } from "react"

const getCloud = () =>
  `testing hello world random words this is a test`
    .split(" ")
    .sort(() => (Math.random() > 0.5 ? 1 : -1))

function App() {
  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveIndex] = useState(0)

  const cloud = useRef(getCloud())

  return (
    <div className="App">
      <h1>WPM Typing Test</h1>

      <p>
        {cloud.current.map((word, index) => {
          if (index === activeWordIndex) {
            return <b>{word} </b>
          }

          return <span>{word} </span>
        })}
      </p>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      ></input>
    </div>
  )
}

export default App
