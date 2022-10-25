import "./App.css"
import { useState, react, useRef } from "react"

const getCloud = () =>
  `Studying is the main source of knowledge. Books are indeed never failing friends of man. For a mature mind, reading is the greatest source of pleasure and solace to distressed minds. The study of good books ennobles us and broadens our outlook. Therefore, the habit of reading should be cultivated. A student should never confine himself to his schoolbooks only. He should not miss the pleasure locked in the classics, poetry, drama, history, philosophy etc. We can derive benefit from other’s experiences with the help of books. The various sufferings, endurance and joy described in books enable us to have a closer look at human life. They also inspire us to face the hardships of life courageously. Nowadays there are innumerable books and time is scarce. So we should read only the best and the greatest among them. With the help of books we shall be able to make our thinking mature and our life more meaningful and worthwhile.`.split(
    " "
  )
// .sort(() => (Math.random() > 0.5 ? 1 : -1))

const Word = (props) => {
  const { text, active, correct, incorrect } = props

  if (correct === true) {
    return <span className="correct">{text} </span>
  }

  if (correct === false) {
    return <span className="incorrect">{text} </span>
  }

  if (active) {
    return <span className="active">{text} </span>
  }

  return <span>{text} </span>
}

function App() {
  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const cloud = useRef(getCloud())
  const [correctWordArray, setCorrectWordArray] = useState([])

  const processInput = (value) => {
    if (value.endsWith(" ")) {
      setActiveWordIndex((index) => index + 1)
      setUserInput("")

      setCorrectWordArray((data) => {
        const word = value.trim()
        const newResult = [...data]
        newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
        return newResult
      })
    } else {
      setUserInput(value)
    }
  }

  return (
    <div className="App">
      <h1>WPM Typing Test</h1>

      <p>
        {cloud.current.map((word, index) => {
          return (
            <Word
              text={word}
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
          )
        })}
      </p>

      <input
        type="text"
        value={userInput}
        onChange={(e) => processInput(e.target.value)}
      ></input>
    </div>
  )
}

export default App
