import "./TextStyling.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const openaiApiKey = process.env.REACT_APP_API_KEY; // Store API key securely

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
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const quote = response.data.choices[0]?.message?.content || "History is written by the victors.";
    return quote.split(" ");
  } catch (error) {
    console.error("Error fetching historical quote:", error);
    return ["History", "is", "written", "by", "the", "victors."];
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
  const [correctLetters, setCorrectLetters] = useState([]);
  const [text, setText] = useState([]);
  const [startCounting, setStartCounting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [wpm, setWPM] = useState(0);
  const latestWPMRef = useRef(0); // ✅ Stores latest WPM value
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const startedTyping = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = () => {
      if (!startedTyping.current) {
        startedTyping.current = true;
        setStartCounting(true);
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const loadQuote = async () => {
      const generatedText = await fetchHistoricalQuote();
      setText(generatedText);
    };
    loadQuote();
  }, []);

  useEffect(() => {
    if (startCounting && timeRemaining > 0 && !timerRef.current) {
      console.log("Starting timer...");

      timerRef.current = setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            console.log("Timer reached 0, using latest WPM:", latestWPMRef.current);

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

    if (value.endsWith(" ")) {
      if (activeWordIndex === text.length - 1) {
        setStartCounting(false);
        console.log("User finished typing, calculating WPM...");

        const finalWPM = calculateWPM(60 - timeRemaining);
        latestWPMRef.current = finalWPM; // ✅ Store latest WPM

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

    // ✅ Update latest WPM on every keystroke
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
      <h1 className="title" onClick={() => navigate("/")}>The Typing Dojo</h1>
      <Timer correctWords={correctLetters.filter((word) => word?.every(Boolean)).length} timeRemaining={timeRemaining} />
      <h3 className="words">
        {text.map((word, wordIndex) => (
          <span key={wordIndex} className="word">
            {word.split("").map((letter, letterIndex) => {
              const isActive = wordIndex === activeWordIndex && letterIndex === userInput.length;
              const isCorrect = correctLetters[wordIndex]?.[letterIndex];

              return <Letter key={letterIndex} letter={letter} active={isActive} correct={isCorrect} />;
            })}{" "}
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
        style={{ display: timeRemaining === 0 ? "none" : "block" }} 
        disabled={timeRemaining === 0}
      />
    </div>
  );
}

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

