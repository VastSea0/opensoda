import React, { useState, useEffect } from 'react';
import "../styles/Zirve.css";

function CircularProgressBar({ percentage }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(percentage);
  }, [percentage]);  

  return (
    <div className="circular-progress" data-percentage={percentage}>
      <div className="circle">
        <span className="progress-bar" style={{ width: `${progress}%` }}></span>
      </div>
      <div className="text">{progress}%</div>
    </div>
  );
}

export default CircularProgressBar;
