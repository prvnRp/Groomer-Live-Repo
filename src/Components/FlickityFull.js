// React component for a full-page carousel using the Flickity library
// Displays a series of banner images and content with animations
// Supports autoplay, pause/play on blur, and navigation buttons

// Reference : https://codepen.io/desandro/pen/RNQwaB

import React, { useRef, useEffect, useState } from "react";
import Flickity from "flickity";
import "../App.css";
import "flickity/css/flickity.css"; // Import Flickity CSS
import rectangle7 from "../images/rectangle-22.svg";
import clockSearch from "../images/clock-search.svg";
import socialMedia from "../images/social-media.svg";
import { useBlur } from "../context/blurContext";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
import { useNavigate } from "react-router-dom";

const FlickityCarousel = () => {
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const { isBlur } = useBlur();
  const carouselRef = useRef(null);
  let flickityInstance = null;
  const nav = useNavigate();

  // Data for carousel banners
  const banners = [
    {
      content: (
        <div className="f55">
          <div>
            <b>Great salon</b> <span className="f30">services</span>
          </div>
          <div className="f30">that won't</div>
          <div>
            <b>empty your pockets</b>
          </div>
        </div>
      ),
      image: rectangle7,
      color: "#FF6548",
    },
    // {
    //     content: <div className='f55'>
    //         <div>
    //             We build <b>Groomer</b> <span className='f30'>for</span>
    //         </div>
    //         <div><b>Adepts</b> & <b>Ernsts</b>, <span className='f30'>not for</span></div>
    //         <div>
    //             <span className='f30'>lazy people</span>
    //         </div>
    //     </div>,
    //     image: Brain,
    //     color: '#FF6548'
    // },
    {
      content: (
        <div className="f55">
          <div>
            <b>Time</b> <span className="f30">is journey</span>
          </div>
          <div className="f30">Let's not</div>
          <div>
            <b>waste either!</b>
          </div>
        </div>
      ),
      image: clockSearch,
      color: "#B4A9F7",
    },
    {
      content: (
        <div className="f55">
          <div>The future of</div>
          <div className="f30">hair is</div>
          <div>
            <b>DIGITAL!</b>
          </div>
        </div>
      ),
      image: socialMedia,
      color: "#DF7AF2",
    },
  ];

  // Initialize Flickity carousel on component mount
  useEffect(() => {
    flickityInstance = new Flickity(carouselRef.current, {
      autoPlay: true,
    });

    // Handle change event to update the current service index
    const handleChange = (index) => {
      setCurrentServiceIndex(index);
      // setCurrentService(services[index]);
    };

    flickityInstance.on("change", handleChange);

    // Handle click event to start autoplay
    const handleClick = () => {
      flickityInstance.playPlayer();
    };

    document.addEventListener("click", handleClick);

    // Cleanup: destroy Flickity instance and remove event listeners
    return () => {
      flickityInstance.off("change", handleChange);
      flickityInstance.destroy();
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Pause or play carousel autoplay based on blur context
  useEffect(() => {
    flickityInstance = new Flickity(carouselRef.current);
    if (isBlur) {
      flickityInstance.pausePlayer();
    } else {
      flickityInstance.playPlayer();
    }
    return () => {
      flickityInstance.destroy();
    };
  }, [isBlur]);

  // Handle previous slide button click
  const handlePrev = () => {
    flickityInstance = new Flickity(carouselRef.current);
    flickityInstance.pausePlayer(); // Pause the carousel
    flickityInstance.previous(); // Move to the previous slide
    setTimeout(() => {
      flickityInstance.playPlayer(); // Resume the carousel after 3 seconds
    }, 3000);
    return () => {
      flickityInstance.destroy();
    };
  };

  // Handle next slide button click
  const handleNext = () => {
    flickityInstance = new Flickity(carouselRef.current);
    flickityInstance.pausePlayer(); // Pause the carousel
    flickityInstance.next(); // Move to the next slide
    setTimeout(() => {
      flickityInstance.playPlayer(); // Resume the carousel after 3 seconds
    }, 3000);
    return () => {
      flickityInstance.destroy();
    };
  };

  return (
    <div className="desktopView">
      <div ref={carouselRef} className="carousel">
        {banners.map((banner, index) => (
          <div
            className="carousel-cell"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={index}
          >
            <div
              class="banner"
              style={{ background: banner.color, width: "90vw" }}
              onClick={() => nav("/salons")}
            >
              <img src={banner.image} style={{ height: "100%" }} />
              <div className="content-banner">{banner.content}</div>
              <div>
                <button className="book-now">Book Now</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom navigatiopn buttons */}
      {banners.length > 1 && (
        <div className="carousalButton">
          {currentServiceIndex !== 0 && (
            <div className="carousel-control-prev" onClick={handlePrev}>
              <span
                style={{
                  background: "#FFF",
                  borderRadius: "50%",
                  padding: "8px",
                }}
              >
                <WestIcon style={{ color: "#000" }} />
              </span>
            </div>
          )}
          {currentServiceIndex !== banners.length - 1 && (
            <div className="carousel-control-next" onClick={handleNext}>
              <span
                style={{
                  background: "#FFF",
                  borderRadius: "50%",
                  padding: "8px",
                }}
              >
                <EastIcon style={{ color: "#000" }} />
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlickityCarousel;
