// App.js
// This component represents the main entry point for the "Salons" page.
import React from "react";
import TopImageWithText from "./TopImageWithText";
import SquareCardsContainer from "./SquareCardsContainer";
import Footer from "./Footer";

function App() {
  return (
    <div className="app">
      <TopImageWithText /> {/* Render the top image with text component */}
      <SquareCardsContainer />{" "}
      {/* Render the square cards container, displaying salon information */}
      <Footer /> {/* Render the footer component at the bottom of the page */}
    </div>
  );
}

export default App;
