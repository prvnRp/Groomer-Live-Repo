import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for managing blur state
const BlurContext = createContext();

// Provider component for managing blur state
export function BlurProvider({ children }) {
  const [isBlur, setIsBlur] = useState(false); // State to keep track of the blur state

  // Function to toggle the blur state
  const toggleBlur = () => {
    setIsBlur(prevIsBlur => !prevIsBlur);
  };

  return (
    <BlurContext.Provider value={{ isBlur, toggleBlur, setIsBlur }}>
      {children}
    </BlurContext.Provider>
  );
}

// Custom hook to access blur state and toggle function
export function useBlur() {
  return useContext(BlurContext);
}