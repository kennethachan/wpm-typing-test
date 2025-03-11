// import { useNavigate, useLocation } from "react-router-dom";
// import "./TextStyling.css";

// const Results = () => {
//   const navigate = useNavigate();
//   const location = useLocation();





//   return (
//     <div className="results-container">
//       <h1>Typing Test Results</h1>
//       <div className="stats-card">
//         <p><b>Words Per Minute (WPM):</b> {wpm}</p>
//       </div>

//       <div className="buttons">
//         <button className="restart-btn" onClick={() => navigate("/")}>Try Again</button>
//         <button className="home-btn" onClick={() => navigate("/")}>Home</button>
//       </div>
//     </div>
//   );
// };

// export default Results;







import { useNavigate, useLocation } from "react-router-dom";
import "./TextStyling.css";

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the typing stats from location state
  const { correctWords, totalWords, correctChars, totalChars, timeTaken } = location.state || {};

  // Calculate WPM (Words Per Minute)
  const wpm = timeTaken > 0 ? ((correctWords / timeTaken) * 60).toFixed(0) : 0;

  // Calculate Accuracy
  const accuracy = totalChars > 0 ? ((correctChars / totalChars) * 100).toFixed(2) : 0;

  return (
    <div className="results-container">
      <h1>Typing Test Results</h1>
      <div className="stats-card">
        <p><b>Words Per Minute (WPM):</b> {wpm}</p>
        <p><b>Accuracy:</b> {accuracy}%</p>
        <p><b>Total Words Typed:</b> {totalWords}</p>
        <p><b>Total Characters Typed:</b> {totalChars}</p>
        <p><b>Correct Characters:</b> {correctChars}</p>
        <p><b>Time Taken:</b> {timeTaken} seconds</p>
      </div>

      <div className="buttons">
        <button className="restart-btn" onClick={() => navigate("/")}>Try Again</button>
      </div>
    </div>
  );
};

export default Results;
