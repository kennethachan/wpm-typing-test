import "./TextStyling.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const getCloud = () =>
  `The bikers rode down the long and narrow path to reach the city park. When they reached a good spot to rest, they began to look for signs of spring. The sun was bright, and a lot of bright red and blue blooms proved to all that warm spring days were the very best. Spring rides were planned. They had a burger at the lake and then rode farther up the mountain. As one rider started to get off his bike, he slipped and fell.`.split(" ");

const Letter = (props) => {
  const { letter, active, correct } = props;

  if (correct === true) {
    return <span className="correct">{letter}</span>;
  }

  if (correct === false) {
    return <span className="incorrect">{letter}</span>;
  }

  if (active) {
    return <span className="active">{letter}</span>;
  }

  return <span>{letter}</span>;
};

const Timer = (props) => {
  const { correctWords, startCounting } = props;
  const [timeRemaining, setTimeRemaining] = useState(60);
  let navigate = useNavigate();

  useEffect(() => {
    let id;
    if (startCounting && timeRemaining > 0) {
      id = setInterval(() => {
        setTimeRemaining((oldTime) => oldTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(id);
    };
  }, [startCounting, timeRemaining]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="stats">
      <p>
        <b>Time Remaining</b><br /> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
      <p>
        <b>WPM</b><br /> {(correctWords / ((60 - timeRemaining) / 60) || 0).toFixed(0)}
      </p>
      <button className="buttons" onClick={() => window.location.reload(false)}>
        Restart
      </button>
      <button className="buttons" onClick={() => navigate("/randomize")}>
        Randomize
      </button>
    </div>
  );
};

function StandardText() {
  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [correctLetters, setCorrectLetters] = useState([]);
  const cloud = useRef(getCloud());
  const [startCounting, setStartCounting] = useState(false);
  const inputRef = useRef(null); // Reference to the input field
  const startedTyping = useRef(false); // Prevent multiple event triggers

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!startedTyping.current) {
        startedTyping.current = true;
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const processInput = (value) => {
    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(" ")) {
      if (activeWordIndex === cloud.current.length - 1) {
        setStartCounting(false);
        setUserInput("Finished");
        return;
      }

      setActiveWordIndex((index) => index + 1);
      setUserInput("");

      setCorrectLetters((prevCorrectLetters) => {
        const newCorrectLetters = [...prevCorrectLetters];
        const currentWord = cloud.current[activeWordIndex];
        const currentWordCorrectness = currentWord.split("").map((letter, index) => {
          return letter === value.trim()[index];
        });
        newCorrectLetters[activeWordIndex] = currentWordCorrectness;
        return newCorrectLetters;
      });
    } else {
      setUserInput(value);
    }
  };

  return (
    <div className="App">
      <h1>WPM Typing Test</h1>
      <Timer startCounting={startCounting} correctWords={correctLetters.filter((word) => word.every(Boolean)).length} />
      <h3 className="words">
        {cloud.current.map((word, wordIndex) => {
          return (
            <span key={wordIndex} className="word">
              {word.split("").map((letter, letterIndex) => {
                const isActive = wordIndex === activeWordIndex && letterIndex === userInput.length;
                return <Letter key={letterIndex} letter={letter} active={isActive} correct={correctLetters[wordIndex]?.[letterIndex]} />;
              })}{" "}
            </span>
          );
        })}
      </h3>

      <input className="input"
        ref={inputRef}
        type="text"
        value={userInput}
        placeholder="Start typing..."
        onChange={(e) => processInput(e.target.value)}
      />
    </div>
  );
}

export default StandardText;

