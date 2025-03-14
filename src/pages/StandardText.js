import "./TextStyling.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const openaiApiKey = process.env.REACT_APP_API_KEY;

const fetchHistoricalQuote = async () => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You generate text for a 60-second words-per-minute typing test. 
                      The text should be engaging, very simple, and suitable for typing practice.
                      Avoid numbers, special characters, or difficult vocabulary.`
          },
          {
            role: "user",
            content: `Generate a passage that is approximately 100-150 words long, super simple long sentences. Do not make any references about typing or typing tests.
            Example:
                    "The sun was shining, and the birds sang in the trees. A cool breeze moved through the open fields. 
                    A young girl ran along the trail, her dog chasing close behind. The morning was peaceful and full of promise."
                    Avoid excessive repetition or uncommon words. Avoid too many commas.`
          }
        ],
        max_tokens: 300,
        temperature: 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const quote = response.data.choices[0]?.message?.content || "Something went wrong.";
    return quote.split(" ");
  } catch (error) {
    console.error("Error fetching text:", error);
    return ["Something", "went", "wrong."];
  }
};

const Letter = ({ letter, active, correct }) => {
  if (correct === true) return <span className="correct">{letter}</span>;
  if (correct === false) return <span className="incorrect">{letter}</span>;
  if (active) return <span className="active">{letter}</span>;
  return <span>{letter}</span>;
};

function StandardText() {
  const [userInput, setUserInput] = useState("");
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [typedWords, setTypedWords] = useState({});
  const [correctLetters, setCorrectLetters] = useState([]);
  const [text, setText] = useState([]);
  const [startCounting, setStartCounting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [wpm, setWPM] = useState(0);
  const latestWPMRef = useRef(0);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const startedTyping = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (!startedTyping.current) {
        startedTyping.current = true;
        setStartCounting(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }

      // Prevent Tab key from disrupting input
      if (event.key === "Tab") {
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  // Refocus input field if clicked outside interactive elements
  useEffect(() => {
    const handleClick = (event) => {
      if (
        inputRef.current &&
        event.target !== inputRef.current &&
        !event.target.closest(".buttons")
      ) {
        inputRef.current.focus();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    const loadQuote = async () => {
      setIsLoading(true); // ✅ Start loading
      const generatedText = await fetchHistoricalQuote();
      setText(generatedText);
      setIsLoading(false); // ✅ Stop loading
    };
    loadQuote();
  }, []);

  useEffect(() => {
    if (startCounting && timeRemaining > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            navigate("/results", { state: { wpm: latestWPMRef.current } });
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startCounting, navigate]);

  const processInput = (value) => {
    if (!startCounting) {
      setStartCounting(true);
    }

    const currentWord = text[activeWordIndex] || "";
    const userTypedLength = value.length;

    setCorrectLetters((prevCorrectLetters) => {
      const newCorrectLetters = [...prevCorrectLetters];
      const letterCorrectness = currentWord.split("").map((letter, index) => {
        if (index >= userTypedLength) return null;
        return letter === value[index];
      });

      newCorrectLetters[activeWordIndex] = letterCorrectness;
      return newCorrectLetters;
    });

    if (value === "" && activeWordIndex > 0) {
      const previousWordIndex = activeWordIndex - 1;
      setActiveWordIndex(previousWordIndex);
      setUserInput(typedWords[previousWordIndex] || "");
      return;
    }

    setTypedWords((prevTypedWords) => ({
      ...prevTypedWords,
      [activeWordIndex]: value.trim(),
    }));

    if (value.endsWith(" ")) {
      if (activeWordIndex === text.length - 1) {
        setStartCounting(false);
        const finalWPM = calculateWPM(60 - timeRemaining);
        latestWPMRef.current = finalWPM;

        setTimeout(() => {
          navigate("/results", { state: { wpm: finalWPM } });
        }, 100);
        return;
      }

      setActiveWordIndex((index) => index + 1);
      setUserInput("");
    } else {
      setUserInput(value);
    }

    latestWPMRef.current = calculateWPM(60 - timeRemaining);
  };

  const calculateWPM = (timeUsed) => {
    const correctWords = correctLetters.filter((word) => word?.every(Boolean)).length;
    if (timeUsed > 0) {
      return ((correctWords / (timeUsed / 60)) || 0).toFixed(0);
    } else {
      return "0";
    }
  };

  return (
    <div className="App">
      <h1 className="title">The Typing Dojo</h1>
      <Timer correctWords={correctLetters.filter((word) => word?.every(Boolean)).length} timeRemaining={timeRemaining} />
  
      {isLoading ? (
        <div className="loading-container">
          <p className="loading-text"><b>Loading Text!</b></p>
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div>
          <h3 className="words">
            {text.map((word, wordIndex) => (
              <span key={wordIndex} className="word">
                {word.split("").map((letter, letterIndex) => {
                  // Fix: Ensure the caret is visible on the last letter and space
                  const isActive =
                    wordIndex === activeWordIndex &&
                    (letterIndex === userInput.length || letterIndex === userInput.length - 1);
  
                  const isCorrect = correctLetters[wordIndex]?.[letterIndex];
  
                  return (
                    <Letter
                      key={letterIndex}
                      letter={letter}
                      active={isActive}
                      correct={isCorrect}
                    />
                  );
                })}
  
                {/* Ensure the space after the word is highlighted when moving to the next word */}
                <Letter
                  key={`${wordIndex}-space`}
                  letter=" "
                  active={wordIndex === activeWordIndex && userInput.length === word.length}
                />
              </span>
            ))}
          </h3>
  
          <input
            className="input"
            ref={inputRef}
            type="text"
            value={userInput}
            placeholder="Start typing..."
            onChange={(e) => processInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && userInput === "" && activeWordIndex > 0) {
                setActiveWordIndex(activeWordIndex - 1);
                setUserInput(typedWords[activeWordIndex - 1] || "");
                e.preventDefault();
              }
            }}
            style={{ display: timeRemaining === 0 ? "none" : "block" }}
            disabled={timeRemaining === 0}
          />
        </div>
      )}
    </div>
  );
}
  

// Timer Component Now Included
const Timer = ({ correctWords, timeRemaining }) => {
  return (
    <div className="stats">
      <p>
        <b>Time Remaining</b><br /> {timeRemaining}s
      </p>
      <p>
        <b>WPM</b><br /> {(correctWords / ((60 - timeRemaining) / 60) || 0).toFixed(0)}
      </p>
      <button className="buttons" onClick={() => window.location.reload(false)}>
        Restart
      </button>
    </div>
  );
};

export default StandardText;







