// React component for a carousel using the Flickity library
// Displays a series of banner images and content with animations

import React, { useRef, useEffect } from "react";
import Flickity from "flickity";
import "../App.css";
import "flickity/css/flickity.css"; // Import Flickity CSS
import rectangle7 from "../images/rectangle-22.svg";
import clockSearch from "../images/clock-search.svg";
import socialMedia from "../images/social-media.svg";
import { useBlur } from "../context/blurContext";
import { Link, useNavigate } from "react-router-dom";

const FlickityCarousel = () => {
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

    // Handle click event to start autoplay
    const handleClick = () => {
      flickityInstance.playPlayer();
    };

    document.addEventListener("click", handleClick);

    // Cleanup: destroy Flickity instance and remove event listener
    return () => {
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

  return (
    <div className="mobileView11">
      <div ref={carouselRef} className="carousel">
        {/* <div className="carousel-cell"></div> */}
        {/* <div className="carousel-cell"></div> */}
        {/* <div className="carousel-cell"></div> */}
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
              className="banner"
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
    </div>
  );
};

export default FlickityCarousel;
