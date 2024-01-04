import React, { useState, useEffect, useRef } from "react";
import Rating from "@mui/material/Rating";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import placeMarker from "../images/place-marker.svg";
import { useNavigate } from "react-router-dom";
// import FlickitySalons from './FlickitySalons';
import Flickity from "flickity";
import "../App.css";
import "flickity/css/flickity.css"; // Import Flickity CSS
// import rectangle7 from '../images/rectangle-22.svg'
// import clockSearch from '../images/clock-search.svg'
// import socialMedia from '../images/social-media.svg'
import { useBlur } from "../context/blurContext";

function SquareCard({
  id,
  content,
  imageSrc,
  distance,
  ratings,
  NoR,
  services,
  salonData,
}) {
  const navigate = useNavigate();

  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [currentService, setCurrentService] = useState(
    services[currentServiceIndex]
  );

  // const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  // const [nextServiceIndex, setNextServiceIndex] = useState(1);

  // useEffect(() => {
  //     const interval = setInterval(() => {
  //         setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
  //         setNextServiceIndex((prevIndex) => (prevIndex + 2) % services.length);
  //     }, 3000);

  //     return () => clearInterval(interval);
  // }, [services.length]);

  // const goToPrevService = () => {
  //     setCurrentServiceIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
  //     setNextServiceIndex((prevIndex) => (prevIndex) % services.length);
  // };

  // const goToNextService = () => {
  //     setCurrentServiceIndex((prevIndex) => (prevIndex + 1) % services.length);
  //     setNextServiceIndex((prevIndex) => (prevIndex + 2) % services.length);
  // };
  const { isBlur } = useBlur();
  const carouselRef = useRef(null);
  let flickityInstance = null;
  useEffect(() => {
    // window.location.reload(false);
    flickityInstance = new Flickity(carouselRef.current, {
      autoPlay: true,
    });

    const handleChange = (index) => {
      setCurrentServiceIndex(index);
      setCurrentService(services[index]);
    };

    flickityInstance.on("change", handleChange);

    const handleClick = () => {
      flickityInstance.playPlayer();
    };

    document.addEventListener("click", handleClick);

    return () => {
      flickityInstance.off("change", handleChange);
      flickityInstance.destroy();
      document.removeEventListener("click", handleClick);
    };
  }, []);

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

  // const currentService = services[currentServiceIndex];
  return (
    <div
      className="square-card"
      style={{ position: "relative", cursor: "pointer" }}
    >
      {/* <FlickitySalons /> */}
      <div ref={carouselRef} className="carousel customCarousel">
        {/* <div className="carousel-cell"></div> */}
        {/* <div className="carousel-cell"></div> */}
        {/* <div className="carousel-cell"></div> */}
        {services.map((service, index) => (
          // <div class={index === 0 ? "carousel-item active" : "carousel-item"} data-bs-interval="3000">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => {
              navigate(`/salon/${id}`);
            }}
          >
            <div className="image-container">
              {imageSrc[index] && (
                <img
                  src={imageSrc[index]}
                  alt="Card Image"
                  className="card-image"
                  // className="cardImage"
                  // width="100%"
                />
              )}
            </div>
          </div>
          // </div>
        ))}
      </div>
      {/* <div id={id} class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    {services.map((service, index) => (
                        <div class={index === 0 ? "carousel-item active" : "carousel-item"} data-bs-interval="3000">
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} onClick={() => { navigate(`/salon/${id}`); }} >
                                <div className="image-container">
                                    {imageSrc[index] && <img src={imageSrc[index]} alt="Card Image" className="card-image" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div> */}
      <div
        className="card-details"
        style={{ height: "42%" }}
        onClick={() => {
          navigate(`/salon/${id}`);
        }}
      >
        <div style={{ width: "100%", overflow: "hidden" }}>
          <p
            style={{
              fontSize: "20px",
              fontWeight: "400",
              whiteSpace: "nowrap",
            }}
          >
            {content}
          </p>
        </div>
        {distance ? (
          <span style={{ fontSize: "15px", position: "relative", top: "-4px" }}>
            <img
              style={{
                transform: "scale(0.7)",
                position: "absolute",
                left: "-9px",
              }}
              src={placeMarker}
            />
            <span style={{ position: "relative", left: "20px" }}>
              {distance} KM
            </span>
            &nbsp;
            <span
              style={{ fontSize: "12px", position: "relative", left: "23px" }}
            >
              from you
            </span>
          </span>
        ) : (
          <span></span>
        )}
        <span
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "8px",
          }}
        >
          {/* {currentService.DiscountedPrice && ( */}
          <div>
            <span style={{ fontSize: "20px", fontWeight: "700" }}>
              ₹{currentService.DiscountedPrice}&nbsp;
            </span>
            <s style={{ fontSize: "15px" }}>₹{currentService.OriginalPrice}</s>
            &nbsp;
            <span style={{ fontSize: "7px" }}>
              {(
                ((currentService.OriginalPrice -
                  currentService.DiscountedPrice) /
                  currentService.OriginalPrice) *
                100
              ).toFixed(0)}
              % off
            </span>
          </div>
          {/* )} */}
          <span style={{ fontSize: "15px" }}>
            <b>{ratings}</b>
            <span style={{ position: "relative", top: "2.5px", margin: "2px" }}>
              <Rating
                style={{ fontSize: "15px" }}
                size="small"
                value={ratings}
                precision={0.25}
                readOnly
                sx={{ "& .MuiRating-iconFilled": { color: "#fff" } }}
                emptyIcon={
                  <StarBorderIcon
                    style={{ color: "white", fontSize: "15px" }}
                  />
                }
              />
            </span>
            <sub style={{ fontSize: "10px" }}>({NoR})</sub>
          </span>
        </span>
        <span style={{ fontSize: "12px" }}>{currentService.ServiceName}</span>
      </div>
      {/* {services.length > 1 &&
                <div className='carousalButton'>
                    <div class="carousel-control-prev" type="button" data-bs-target={"#" + id}
                        data-bs-slide="prev">
                        <span className='arrow left'></span>
                    </div>
                    <div class="carousel-control-next" type="button" data-bs-target={"#" + id}
                        data-bs-slide="next">
                        <span className='arrow right'></span>
                    </div>
                </div>
            } */}
      {services.length > 1 && (
        <div className="carousalButton">
          {currentServiceIndex !== 0 && (
            <div
              style={{ paddingRight: "14px" }}
              className="carousel-control-prev"
              onClick={handlePrev}
            >
              <span className="arrow left"></span>
            </div>
          )}
          {currentServiceIndex !== services.length - 1 && (
            <div
              style={{ paddingLeft: "14px" }}
              className="carousel-control-next"
              onClick={handleNext}
            >
              <span className="arrow right"></span>
            </div>
          )}
        </div>
      )}

      {/* <i className='arrow left' style={{ position: "absolute", top: "50%", left: "3px", padding: "3px" }} onClick={goToPrevService}></i> */}
      {/* <i className='arrow right' style={{ position: "absolute", top: "50%", right: "3px", padding: "3px" }} onClick={goToNextService}></i> */}
    </div>
  );
}

export default SquareCard;
