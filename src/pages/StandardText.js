// import "./TextStyling.css";
// import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const openaiApiKey = process.env.REACT_APP_API_KEY; // Store API key securely

// const fetchHistoricalQuote = async () => {
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content: `You generate text for a 60-second words-per-minute typing test. 
//                       The text should be engaging,  very simple, and suitable for typing practice.
//                       Avoid numbers, special characters, or difficult vocabulary.`
//           },
//           {
//             role: "user",
//             content: `Generate a passage that is approximately 100-150 words long, made up of short, super simple sentences. 
//                       The passage should resemble a natural paragraph, focusing on a general topic like nature, daily life, or a short fictional story.
//                       Example:
//                       "The sun was shining, and the birds sang in the trees. A cool breeze moved through the open fields. 
//                       A young girl ran along the trail, her dog chasing close behind. The morning was peaceful and full of promise."
//                       Avoid excessive repetition or uncommon words.`
//           }
//         ],
//         max_tokens: 300,
//         temperature: 0.8,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${openaiApiKey}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const quote = response.data.choices[0]?.message?.content || "History is written by the victors.";
//     return quote.split(" ");
//   } catch (error) {
//     console.error("Error fetching historical quote:", error);
//     return ["History", "is", "written", "by", "the", "victors."];
//   }
// };

// const Letter = ({ letter, active, correct }) => {
//   if (correct === true) return <span className="correct">{letter}</span>;
//   if (correct === false) return <span className="incorrect">{letter}</span>;
//   if (active) return <span className="active">{letter}</span>;
//   return <span>{letter}</span>;
// };

// function StandardText() {
//   const [userInput, setUserInput] = useState("");
//   const [activeWordIndex, setActiveWordIndex] = useState(0);
//   const [correctLetters, setCorrectLetters] = useState([]);
//   const [text, setText] = useState([]);
//   const [startCounting, setStartCounting] = useState(false);
//   const [timeRemaining, setTimeRemaining] = useState(60); // Timer state moved here
//   const inputRef = useRef(null);
//   const startedTyping = useRef(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleKeyPress = (event) => {
//       if (!startedTyping.current) {
//         startedTyping.current = true;
//         if (inputRef.current) {
//           inputRef.current.focus();
//         }
//       }
//     };

//     document.addEventListener("keydown", handleKeyPress);
//     return () => document.removeEventListener("keydown", handleKeyPress);
//   }, []);

//   useEffect(() => {
//     const loadQuote = async () => {
//       const generatedText = await fetchHistoricalQuote();
//       setText(generatedText);
//     };
//     loadQuote();
//   }, []);

//   useEffect(() => {
//     let id;
//     if (startCounting && timeRemaining > 0) {
//         id = setInterval(() => {
//             setTimeRemaining((oldTime) => oldTime - 1);
//         }, 1000);
//     } else if (timeRemaining === 0) {
//         console.log("Timer reached 0, navigating..."); // Debugging
//         const correctWords = correctLetters.filter((word) => word?.every(Boolean)).length;
//         const wpm = (correctWords / ((60 - timeRemaining) / 60) || 0).toFixed(0);
        
//         setTimeout(() => { // Delay navigation slightly to ensure render
//             navigate("/results", { state: { wpm } }); 
//         }, 100);
//     }

//     return () => clearInterval(id);
// }, [startCounting, timeRemaining, correctLetters, navigate]);


//   const processInput = (value) => {
//     if (!startCounting) {
//       setStartCounting(true);
//     }

//     if (value.endsWith(" ")) {
//       if (activeWordIndex === text.length - 1) {
//         setStartCounting(false);
//         setUserInput("Finished");
//         return;
//       }

//       setActiveWordIndex((index) => index + 1);
//       setUserInput("");

//       setCorrectLetters((prevCorrectLetters) => {
//         const newCorrectLetters = [...prevCorrectLetters];
//         const currentWord = text[activeWordIndex];
//         const currentWordCorrectness = currentWord.split("").map((letter, index) => letter === value.trim()[index]);
//         newCorrectLetters[activeWordIndex] = currentWordCorrectness;
//         return newCorrectLetters;
//       });
//     } else {
//       setUserInput(value);
//     }
//   };

//   return (
//     <div className="App">
//       <h1 className="title" >The Typing Dojo</h1>
//       <Timer startCounting={startCounting} correctWords={correctLetters.filter((word) => word?.every(Boolean)).length} timeRemaining={timeRemaining} />
//       <h3 className="words">
//         {text.map((word, wordIndex) => (
//           <span key={wordIndex} className="word">
//             {word.split("").map((letter, letterIndex) => {
//               const isActive = wordIndex === activeWordIndex && letterIndex === userInput.length;
//               return <Letter key={letterIndex} letter={letter} active={isActive} correct={correctLetters[wordIndex]?.[letterIndex]} />;
//             })}{" "}
//           </span>
//         ))}
//       </h3>
//       <input
//         className="input"
//         ref={inputRef}
//         type="text"
//         value={userInput}
//         placeholder="Start typing..."
//         onChange={(e) => processInput(e.target.value)}
//         style={{ display: timeRemaining === 0 ? "none" : "block" }} 
//         disabled={timeRemaining === 0} // Prevents typing when timer reaches 0
//       />
//     </div>
//   );
// }

// const Timer = ({ correctWords, startCounting, timeRemaining }) => {
//   return (
//     <div className="stats">
//       <p>
//         <b>Time Remaining</b><br /> {timeRemaining}s
//       </p>
//       <p>
//         <b>WPM</b><br /> {(correctWords / ((60 - timeRemaining) / 60) || 0).toFixed(0)}
//       </p>
//       <button className="buttons" onClick={() => window.location.reload(false)}>
//         Restart
//       </button>
//     </div>
//   );
// };

// export default StandardText;






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
                      The text should be engaging,  very simple, and suitable for typing practice.
                      Avoid numbers, special characters, or difficult vocabulary.`
          },
          {
            role: "user",
            content: `Generate a passage that is approximately 100-150 words long, made up of short, super simple sentences. 
                      The passage should resemble a natural paragraph, focusing on a general topic like nature, daily life, or a short fictional story.
                      Example:
                      "The sun was shining, and the birds sang in the trees. A cool breeze moved through the open fields. 
                      A young girl ran along the trail, her dog chasing close behind. The morning was peaceful and full of promise."
                      Avoid excessive repetition or uncommon words.`
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
  const inputRef = useRef(null);
  const startedTyping = useRef(false);
  const navigate = useNavigate();

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
    let id;
    if (startCounting && timeRemaining > 0) {
      id = setInterval(() => {
        setTimeRemaining((oldTime) => oldTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      console.log("Timer reached 0, navigating...");
      const correctWords = correctLetters.filter((word) => word?.every(Boolean)).length;
      const wpm = ((correctWords / ((60 - timeRemaining) / 60)) || 0).toFixed(0);
      
      setTimeout(() => { 
        navigate("/results", { state: { wpm } }); 
      }, 100);
    }

    return () => clearInterval(id);
  }, [startCounting, timeRemaining, correctLetters, navigate]);

  const processInput = (value) => {
    if (!startCounting) {
      setStartCounting(true);
    }

    if (value.endsWith(" ")) {
      if (activeWordIndex === text.length - 1) {
        setStartCounting(false);

        // Calculate WPM when user finishes typing
        const correctWords = correctLetters.filter((word) => word?.every(Boolean)).length;
        const timeUsed = 60 - timeRemaining;
        const wpm = timeUsed > 0 ? ((correctWords / (timeUsed / 60)) || 0).toFixed(0) : 0;

        setTimeout(() => {
          navigate("/results", { state: { wpm } }); // 🚀 Navigate immediately when finished
        }, 100);

        return;
      }

      setActiveWordIndex((index) => index + 1);
      setUserInput("");

      setCorrectLetters((prevCorrectLetters) => {
        const newCorrectLetters = [...prevCorrectLetters];
        const currentWord = text[activeWordIndex];
        const currentWordCorrectness = currentWord.split("").map((letter, index) => letter === value.trim()[index]);
        newCorrectLetters[activeWordIndex] = currentWordCorrectness;
        return newCorrectLetters;
      });
    } else {
      setUserInput(value);
    }
  };

  return (
    <div className="App">
      <h1 className="title" onClick={() => navigate("/")}>The Typing Dojo</h1>
      <Timer startCounting={startCounting} correctWords={correctLetters.filter((word) => word?.every(Boolean)).length} timeRemaining={timeRemaining} />
      <h3 className="words">
        {text.map((word, wordIndex) => (
          <span key={wordIndex} className="word">
            {word.split("").map((letter, letterIndex) => {
              const isActive = wordIndex === activeWordIndex && letterIndex === userInput.length;
              return <Letter key={letterIndex} letter={letter} active={isActive} correct={correctLetters[wordIndex]?.[letterIndex]} />;
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




