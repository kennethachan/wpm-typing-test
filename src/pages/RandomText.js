import "./TextStyling.css"
import { useState, react, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const getCloud = () =>
  `the bikers rode down the long and narrow path to reach the city park when they reached a good spot to rest they began to look for signs of spring the sun was bright and a lot of bright red and blue blooms proved to all that warm spring days were the very best spring rides were planned they had a burger at the lake and then rode farther up the mountain as one rider started to get off his bike he slipped and fell`
    .split(" ")
    .sort(() => (Math.random() > 0.5 ? 1 : -1))

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

const Timer = (props) => {
  const { correctWords, startCounting } = props
  const [timeElapsed, setTimeElapsed] = useState(0)

  useEffect(() => {
    let id
    if (startCounting) {
      id = setInterval(() => {
        setTimeElapsed((oldTime) => oldTime + 1)
      }, 1000)
    }

    return () => {
      clearInterval(id)
    }
  }, [props.startCounting])

  const minutes = timeElapsed / 60

  return (
    <div className="stats">
      <p>
        <b>Time Elapsed:</b> {timeElapsed}s
      </p>
      <p>
        <b>Speed:</b> {(correctWords / minutes || 0).toFixed(0)} WPM
      </p>
    </div>
  )
}

function RandomText() {
  const [userInput, setUserInput] = useState("")
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const cloud = useRef(getCloud())
  const [correctWordArray, setCorrectWordArray] = useState([])
  const [startCounting, setStartCounting] = useState(false)
  let navigate = useNavigate()

  const processInput = (value) => {
    if (!startCounting) {
      setStartCounting(true)
    }

    if (value.endsWith(" ")) {
      if (activeWordIndex === cloud.current.length - 1 || 0) {
        setStartCounting(false)
        setUserInput("Finished")
        return
      }

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
      <Timer
        startCounting={startCounting}
        correctWords={correctWordArray.filter(Boolean).length}
      />
      <h3 className="words">
        {cloud.current.map((word, index) => {
          return (
            <Word
              text={word}
              active={index === activeWordIndex}
              correct={correctWordArray[index]}
            />
          )
        })}
      </h3>

      <input
        type="text"
        value={userInput}
        placeholder="Type Here"
        onChange={(e) => processInput(e.target.value)}
      ></input>
      <br></br>
      <div className="buttons">
        <button
          className="restart"
          onClick={() => window.location.reload(false)}
        >
          Restart
        </button>
        <button className="randomize" onClick={() => navigate("/")}>
          Back
        </button>
      </div>
    </div>
  )
}

export default RandomText
