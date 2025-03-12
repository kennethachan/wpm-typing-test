import { useNavigate, useLocation } from "react-router-dom";
import "./TextStyling.css";

const Results = () => {
const navigate = useNavigate();
const location = useLocation();  
const wpm = location.state?.wpm || 0; // Get WPM from navigation state
// const accuracy = location.state?.accuracy || 0; // Get WPM from navigation state
// const longestStreak = location.state?.longestStreak || 0; 
// const totalMistakes = location.state?.totalMistakes || 0; 

  return (
    <div>
  <h1 className="results-title" onClick={() => navigate("/")} >The Typing Dojo</h1>
    <div className="results">
    <p className="wpm-result"><b>Your WPM:</b> {wpm}</p>
    {/* <p><b>Accuracy:</b> placeholder</p>
    <p><b>Longest Letter Streak:</b> placeholder</p>
    <p><b>Total Mistakes:</b> placeholder</p> */}
    <button className="try-again" onClick={() => navigate("/")}>Try Again</button>
    </div>

    </div>
  );
}

export default Results;
