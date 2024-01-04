import "../App.css";
import Header from "./Header";
import React, { useState, useRef, useEffect, useContext } from "react";
import rectangle1 from "../images/rectangle-5.svg";
import rectangle2 from "../images/rectangle-6.svg";
import rectangle3 from "../images/rectangle-7.svg";
import rectangle6 from "../images/rectangle-21.svg";
import youtube from "../images/youtube.png";
import rectangle8 from "../images/rectangle-37.svg";
import imageee1 from "../images/Salons/image1.jpg";
import vector from "../images/vector-1.svg";
import home from "../images/home.svg";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Footer from "./Footer";
import FlickityCarousel from "./FlickityCarousel";
import FlickityFull from "./FlickityFull";
import { useBlur } from "../context/blurContext";
import EastIcon from "@mui/icons-material/East";
import { Link, useNavigate } from "react-router-dom";
import MetaData from "../context/MetaData";
import { useStepperContext } from "@mui/material";
import { getRecommandedSalon } from "../Apis/Salons_service";
import { addWishlistApi } from "../Apis/Wishlist_service";
import { Store2 } from "../App";

// Description content
const Description = (
  <div>
    {/* Groomer is a human centric beauty company. <br /><br /> */}
    <b>Origin : </b>
    We are in search of how we can reinvent human beauty to bring out his or her
    unique style. So we met, hair defines human beauty just as leaves define the
    beauty of a tree. The result we get is that human beauty lies in the hair.
    That's why we started working on the hair.. After our in-depth research, we
    concluded that people spend most of their time in salons to redesign their
    style. <br />
    <br />
    <b>Problem: </b>
    We face our challenges, Of course. The biggest one being that 70% of people
    still book their hair and Beauty offline. Like Phoning the salon or walking
    straight in. That means, not only do we need a great product and the right
    kind of marketing. We need to actually change the mindset of the majority.{" "}
    <br />
    <br />
    <b>Vision : </b>
    So, we have taken it as a mission to solve the problems of the salon market
    in India. And we recognize this as the first phase of our business. We spend
    our days working toward our mission to transform the unorganized hair and
    beauty community (Whole Indian salon market) into a completely digitized
    one. We young people aspire to change the salon industry from 0 to 1 and
    began the journey Of Groomer to make the world a better place to Live. We
    began to believe deeply that the future of hair is digital and we took this
    as our vision
  </div>
);

const HomePage = () => {
  const contentRef = useRef(null); // Ref for content section
  const [showScroll, setShowScroll] = useState(true); // State for showing/hiding scroll symbol
  // const [isFavourite, setIsFavourite] = useState(false);
  const [favoriteStatus, setFavoriteStatus] = useState({}); // State for favorite/wishlist icon
  const prevScrollY = useRef(0); // Ref for previous scroll position
  const [wishlistMessage, setWishlistMessage] = useState(""); // State for wishlist message
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // State for expanding/collapsing description

  const { bookingDetails, singleSalon, setsingleSalon, user } =
    useContext(Store2);
  const scrollPositionRef = useRef(0); // Store scroll position
  const nav = useNavigate();

  const [salon, setSalon] = useState([]);
  const [bgColor, setbgColor] = useState("white");

  async function fetchSalon() {
    try {
      const response = await getRecommandedSalon();
      setSalon(response.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    fetchSalon();
  }, []);

  const addWishlistHandler = async (id) => {
    if (favoriteStatus[id]) {
      setWishlistMessage("Already in wishlist");
      return;
    }
    try {
      const response = await addWishlistApi(id);
      if (response.code === 201) {
        setFavoriteStatus((prevStatus) => ({
          ...prevStatus,
          [id]: true,
        }));
        setWishlistMessage("Added to wishlist");
      } else {
        console.error("Failed to add to wishlist:", response);
        setWishlistMessage("Salon already found in Wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setWishlistMessage("Salon already found in Wishlist");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setWishlistMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [wishlistMessage]);

  // Toggle description expansion
  const handleToggleDescription = () => {
    if (!isDescriptionExpanded) {
      scrollPositionRef.current = window.scrollY;
    }

    setIsDescriptionExpanded((prevState) => !prevState);

    if (isDescriptionExpanded) {
      window.scrollTo({ top: scrollPositionRef.current, behavior: "smooth" });
    }
  };
  // For Navigation

  // Length to truncate description
  const truncatedDescriptionLength = 5;

  // Full description with show/hide button
  const fullDescription = (
    <div>
      {Description.props.children}{" "}
      {/* Assuming your content is direct children of Description */}
      <span className="show-more" onClick={handleToggleDescription}>
        {isDescriptionExpanded ? " ...Less" : " ...More"}
      </span>
    </div>
  );

  // Truncated description with show/hide button
  const truncatedDescription = (
    <div>
      {Description.props.children.slice(0, truncatedDescriptionLength)}
      {isDescriptionExpanded ? (
        <span className="show-more" onClick={handleToggleDescription}>
          {" "}
          ...Less
        </span>
      ) : (
        <span className="show-more" onClick={handleToggleDescription}>
          {" "}
          ...More
        </span>
      )}
    </div>
  );

  // Handle scroll event to show/hide scroll symbol
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setShowScroll(currentScrollY > prevScrollY.current ? false : showScroll);
    if (currentScrollY === 0) {
      setShowScroll(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Toggle wishlist icon and display message
  // const handleToggleWishlist = () => {
  //   setIsFavourite(false);
  //   setIsFavourite((prevState) => !prevState);
  //   setWishlistMessage(
  //     isFavourite ? "Removed from wishlist" : "Added to wishlist"
  //   );
  //   setTimeout(() => {
  //     setWishlistMessage("");
  //   }, 5000);
  // };

  useEffect(() => {
    const timer = setTimeout(() => {
      setWishlistMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [wishlistMessage]);

  const isSmallScreen = window.innerWidth < 700;
  const { isBlur } = useBlur();

  return (
    <>
      <MetaData title="Groomer's Home" />
      <Header />
      <div style={{ filter: isBlur ? "blur(10px)" : "none" }}>
        {/* Render FlickityCarousel and FlickityFull components */}
        <FlickityCarousel /> {/* For mobile view */}
        <FlickityFull /> {/* For desktop view */}
        {showScroll && (
          <div className="scroll-symbol">
            <img src={vector} />
          </div>
        )}
        <div className="header-info">
          <div className="row-12">
            <div className="col-6">
              <p className="f35">This is</p>
              <h1 className="f70">Groomer</h1>
            </div>
            <div className="col-6">
              <p className="f35">
                Groomer is a human centric beauty company.
                <br />
              </p>
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="youtubeLink">
              <Link
                to="https://www.linkedin.com/in/shanupl/"
                style={{ color: "white" }}
              >
                {" "}
                <img src={youtube} width="50px" />
                <strong>What is Groomer ?</strong>
              </Link>
            </div>
            <div className="youtubeLink">
              <Link
                to="https://www.linkedin.com/in/shanupl/"
                style={{ color: "white" }}
              >
                {" "}
                <img src={youtube} width="50px" />
                <strong>Why do we build Groomer ?</strong>
              </Link>
            </div>
            <div className="youtubeLink">
              <Link
                to="https://www.linkedin.com/in/shanupl/"
                style={{ color: "white" }}
              >
                {" "}
                <img src={youtube} width="50px" />
                <strong>How does the Groomer work?</strong>
              </Link>
            </div>
            {/* <p className="f35">
              {isDescriptionExpanded ? fullDescription : truncatedDescription}
            </p> */}
          </div>
        </div>
        <div className="content12" ref={contentRef}>
          <div className="one-card">
            <img src={rectangle1} className="homeImages" />
            <div className="image-content" style={{ fontSize: "60px" }}>
              <div style={{ fontSize: "30px" }}></div>
              <div>
                <b>Book</b> salon
              </div>
              <div>online</div>
            </div>
            <div
              className="down-content"
              style={{ textDecoration: "none", color: "black" }}
            >
              <Link to="/salons" style={{ color: "#000" }}>
                Book salon online{" "}
                <span id="arrowww">
                  <EastIcon />
                </span>
              </Link>
            </div>
          </div>
          <div className="one-card">
            <div className="image-content" style={{ fontSize: "60px" }}>
              <div style={{ fontSize: "30px" }}></div>
              <div>
                <b>Best</b> salon
              </div>
              <div>near me</div>
            </div>
            <img src={rectangle2} className="homeImages" />
            <div
              className="down-content"
              style={{ textDecoration: "none", color: "black" }}
            >
              <Link to="/salons" style={{ color: "#000" }}>
                Best salon near me{" "}
                <span id="arrowww">
                  <EastIcon />
                </span>
              </Link>
            </div>
          </div>
          <div className="one-card">
            <img src={rectangle3} className="homeImages" />
            <div className="image-content" style={{ fontSize: "60px" }}>
              <div style={{ fontSize: "30px" }}></div>
              <div>
                <b>Book</b> salon
              </div>
              {/* <div>salon</div> */}
              <div>appointment</div>
            </div>
            <div
              className="down-content"
              style={{ textDecoration: "none", color: "black" }}
            >
              <Link to="/salons" style={{ color: "#000" }}>
                Book salon appointment{" "}
                <span id="arrowww">
                  <EastIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Best Salons */}
        <div className="best-salons">
          <div
            style={{ paddingBottom: "0px", fontSize: "20px" }}
            className="text-salon"
          >
            The
          </div>
          <div style={{ paddingTop: "0px" }} className="text-salon">
            Best groomer in <b>city</b>
          </div>
          <div className="best-salon">
            {salon.map((data, index) => {
              return (
                <div className="best-salon-card">
                  <div
                    style={{
                      flex: 1,
                      marginRight: "30px",
                      position: "relative",
                      height: "100%",
                    }}
                  >
                    <img
                      src={data.salon_photos[0]}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "35px",
                        cursor: "pointer",
                      }}
                      onClick={() => nav(`/salon/${data.salon_uuid}`)}
                      alt="Salon"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "0px",
                        right: "0px",
                        cursor: "pointer",
                        color: "#000",
                        background: "#FFF",
                        borderRadius: "50%",
                      }}
                    >
                      {favoriteStatus[data.salon_uuid] ? (
                        <FavoriteIcon
                          className="heart-wishlist"
                          style={{ color: "#FF0000" }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          onClick={() => addWishlistHandler(data.salon_uuid)}
                          className="heart-wishlist"
                          style={{
                            backgroundColor: bgColor,
                            borderRadius: "50px",
                          }}
                        />
                      )}
                      {/* {isFavourite ? (
                        <FavoriteIcon
                          // onClick={() => {
                          //   handleToggleWishlist();
                          // }}
                          className="heart-wishlist"
                          style={{ color: "#FF0000" }}
                        />
                      ) : (
                        <FavoriteBor
                          derIcon
                          // onClick={() => {
                          //   handleToggleWishlist();
                          // }}
                          onClick={() => addWishlistHandler(data.salon_uuid)}
                          className="heart-wishlist"
                          style={{ backgroundColor: { bgColor } }}
                        />
                      )} */}
                    </div>
                  </div>
                  <div className="best-salon-text" style={{ flex: 1 }}>
                    <div className="f40">{index + 1}</div>
                    <div
                      className="f40 salon-groomer"
                      style={{ marginBottom: "20px" }}
                    >
                      {data.salon_name}
                    </div>
                    <div className="f20">{data.salon_description}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="explore-button" style={{ textAlign: "center" }}>
            <Link to="/salons">
              <button>Explore more</button>
            </Link>
          </div>
        </div>
        {/* Home services */}
        <div className="home-services">
          <div className="home-service-img" style={{ flex: "1" }}>
            <img
              src={isSmallScreen ? rectangle8 : rectangle8}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div
            style={{
              flex: "1",
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >
            {!isSmallScreen && (
              <div
                className="homeee"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                {/* <img src={home} /> */}
                <div>
                  <div className="f40">Home salon services</div>
                  {/* <div className="f18" style={{ fontWeight: "700" }}>
                    Follow us on Instagram and Twitter to get notified.
                  </div> */}
                </div>
              </div>
            )}
            {isSmallScreen && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div>
                  <div style={{ fontSize: "25px", fontWeight: "bold" }}>
                    Salon at your home
                  </div>
                </div>
              </div>
            )}
            <div className="f30">
              {/* The salon with two best in class groomers in the same salon gives
              you the best style and look with master level talent at your
              house. Prices are identical to the salon. No worries about timing
              and traffic. We will take all your pressure to give you the best
              service at your doorstep. */}
              You don't need to worry if you can't get the salon in person, we
              will bring the salon to your home. Yes,we offer Home Salon
              services also.
              <br /> Fill out the form, sit back, and relax. Our team will
              contact you soon. We will send the best Groomer.😘😘 <br /> We
              look forward to meeting you at your home.  😀
            </div>
            <div
              className="button-salon-book"
              onClick={() => nav("/BookSalon")}
            >
              <button>Book now</button>
            </div>
          </div>
        </div>
        <div></div>
        <Footer />
        {wishlistMessage && (
          <div className="popup-wishlist">
            <div className="popup-content-wishlist">
              <span className="wishlistmessage">{wishlistMessage}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
