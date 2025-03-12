import { useNavigate, useLocation } from "react-router-dom";
import "./TextStyling.css";

const Results = () => {
const navigate = useNavigate();
const location = useLocation();  
const wpm = location.state?.wpm || 0; // Get WPM from navigation state

  return (
    <div>
  <h1 className="results-title" onClick={() => navigate("/")} >The Typing Dojo</h1>
    <div className="results">
    <p className="wpm-result"><b>Your WPM:</b> {wpm}</p>
    <button className="try-again" onClick={() => navigate("/")}>Try Again</button>
    </div>

    </div>
  );
}

export default Results;
