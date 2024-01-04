import React, { useEffect } from "react";

const OTPTimer = ({ onTimeout, timer, setTimer }) => {
  useEffect(() => {
    let interval;
    if (timer === 1) {
      onTimeout(); // Trigger timeout action
    }
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [timer, onTimeout]);

  return (
    <div>
      <p>Time remaining: {timer} seconds</p>
    </div>
  );
};

export default OTPTimer;
