// import "./TextStyling.css"
// import { useState, useRef, useEffect } from "react"
// import { useNavigate } from "react-router-dom"

// const getCloud = () =>
//   `The bikers rode down the long and narrow path to reach the city park. When they reached a good spot to rest, they began to look for signs of spring. The sun was bright, and a lot of bright red and blue blooms proved to all that warm spring days were the very best. Spring rides were planned. They had a burger at the lake and then rode farther up the mountain. As one rider started to get off his bike, he slipped and fell.`.split(
//     " "
//   )

// const Word = (props) => {
//   const { text, active, correct } = props

//   if (correct === true) {
//     return <span className="correct">{text} </span>
//   }

//   if (correct === false) {
//     return <span className="incorrect">{text} </span>
//   }

//   if (active) {
//     return <span className="active">{text} </span>
//   }

//   return <span>{text} </span>
// }

// const Timer = (props) => {
//   const { correctWords, startCounting } = props
//   const [timeRemaining, setTimeRemaining] = useState(60)

//   useEffect(() => {
//     let id
//     if (startCounting && timeRemaining > 0) {
//       id = setInterval(() => {
//         setTimeRemaining((oldTime) => oldTime - 1)
//       }, 1000)
//     }

//     return () => {
//       clearInterval(id)
//     }
//   }, [startCounting, timeRemaining])

//   const minutes = Math.floor(timeRemaining / 60)
//   const seconds = timeRemaining % 60

//   return (
//     <div className="stats">
//       <p>
//         <b>Time Remaining:</b> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//       </p>
//       <p>
//         <b>Speed:</b> {(correctWords / ((60 - timeRemaining) / 60) || 0).toFixed(0)} WPM
//       </p>
//     </div>
//   )
// }

// function StandardText() {
//   const [userInput, setUserInput] = useState("")
//   const [activeWordIndex, setActiveWordIndex] = useState(0)
//   const cloud = useRef(getCloud())
//   const [correctWordArray, setCorrectWordArray] = useState([])
//   const [startCounting, setStartCounting] = useState(false)

//   let navigate = useNavigate()

//   const processInput = (value) => {
//     if (!startCounting) {
//       setStartCounting(true)
//     }

//     if (value.endsWith(" ")) {
//       if (activeWordIndex === cloud.current.length - 1) {
//         setStartCounting(false)
//         setUserInput("Finished")
//         return
//       }

//       setActiveWordIndex((index) => index + 1)
//       setUserInput("")

//       setCorrectWordArray((data) => {
//         const word = value.trim()
//         const newResult = [...data]
//         newResult[activeWordIndex] = word === cloud.current[activeWordIndex]
//         return newResult
//       })
//     } else {
//       setUserInput(value)
//     }
//   }

//   return (
//     <div className="App">
//       <h1>WPM Typing Test</h1>
//       <Timer
//         startCounting={startCounting}
//         correctWords={correctWordArray.filter(Boolean).length}
//       />
//       <h3 className="words">
//         {cloud.current.map((word, index) => {
//           return (
//             <Word
//               key={index}
//               text={word}
//               active={index === activeWordIndex}
//               correct={correctWordArray[index]}
//             />
//           )
//         })}
//       </h3>

//       <input
//         type="text"
//         value={userInput}
//         placeholder="Type Here"
//         onChange={(e) => processInput(e.target.value)}
//       ></input>
//       <br></br>
//       <div className="buttons">
//         <button
//           className="restart"
//           onClick={() => window.location.reload(false)}
//         >
//           Restart
//         </button>
//         <button className="randomize" onClick={() => navigate("/randomize")}>
//           Randomize
//         </button>
//       </div>
//     </div>
//   )
// }

// export default StandardText


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
    return <span className="active">{letter}</span>; // Active letter
  }

  return <span>{letter}</span>; // Neutral letter
};

const Timer = (props) => {
  const { correctWords, startCounting } = props;
  const [timeRemaining, setTimeRemaining] = useState(60);

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
        <b>Time Remaining:</b> {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </p>
      <p>
        <b>Speed:</b> {(correctWords / ((60 - timeRemaining) / 60) || 0).toFixed(0)} WPM
      </p>
    </div>
  );
};

function StandardText() {
  const [userInput, setUserInput] = useState(""); // The text that the user types
  const [activeWordIndex, setActiveWordIndex] = useState(0); // Track the word that the user is currently typing
  const [correctLetters, setCorrectLetters] = useState([]); // Store correctness of each letter typed
  const cloud = useRef(getCloud()); // The text that the user has to type
  const [startCounting, setStartCounting] = useState(false); // Timer flag

  let navigate = useNavigate();

  // Process user input and check for correctness
  const processInput = (value) => {
    if (!startCounting) {
      setStartCounting(true); // Start the timer when typing begins
    }

    if (value.endsWith(" ")) {
      // Move to next word when space is pressed
      if (activeWordIndex === cloud.current.length - 1) {
        setStartCounting(false); // Stop the timer when all words are typed
        setUserInput("Finished");
        return;
      }

      setActiveWordIndex((index) => index + 1); // Go to the next word
      setUserInput(""); // Reset the user input

      // Store the correctness of each letter in the word
      setCorrectLetters((prevCorrectLetters) => {
        const newCorrectLetters = [...prevCorrectLetters];
        const currentWord = cloud.current[activeWordIndex];
        const currentWordCorrectness = currentWord.split("").map((letter, index) => {
          return letter === value.trim()[index]; // Compare each letter
        });
        newCorrectLetters[activeWordIndex] = currentWordCorrectness;
        return newCorrectLetters;
      });
    } else {
      setUserInput(value); // Update the user input as they type
    }
  };

  const getCurrentWord = () => {
    return cloud.current[activeWordIndex] || "";
  };

  return (
    <div className="App">
      <h1>WPM Typing Test</h1>
      <Timer
        startCounting={startCounting}
        correctWords={correctLetters.filter((word) => word.every(Boolean)).length}
      />
      <h3 className="words">
        {cloud.current.map((word, wordIndex) => {
          return (
            <span key={wordIndex} className="word">
              {word.split("").map((letter, letterIndex) => {
                const isActive = wordIndex === activeWordIndex && letterIndex === userInput.length;
                const isCorrect =
                  wordIndex === activeWordIndex &&
                  letterIndex < userInput.length &&
                  userInput[letterIndex] === letter;
                const isIncorrect =
                  wordIndex === activeWordIndex &&
                  letterIndex < userInput.length &&
                  userInput[letterIndex] !== letter;

                return (
                  <Letter
                    key={letterIndex}
                    letter={letter}
                    active={isActive}
                    correct={correctLetters[wordIndex] && correctLetters[wordIndex][letterIndex] !== undefined ? correctLetters[wordIndex][letterIndex] : null}
                  />
                );
              })}
              {" "}
            </span>
          );
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
        <button className="randomize" onClick={() => navigate("/randomize")}>
          Randomize
        </button>
      </div>
    </div>
  );
}

export default StandardText;

