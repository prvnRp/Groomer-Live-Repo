import React, { useState, useEffect } from "react";
import "../App.css";
import Logo from "./Logo";
import TopNav from "./TopNav";
import Footer from "./Footer";
import image from "../images/rectangle-1.svg";
import Image from "../images/rectangle-2.svg";
import "../Styles/Login.css";
import "../Styles/Footer.css";
// import Envolope from '../images/envelope-with-checkmark-icon.svg'
import mobileImage from "../images/rectangle-45.svg";
import { useBlur } from "../context/blurContext";
import MetaData from "../context/MetaData";

function AboutUs() {
  const [isMobileView, setIsMobileView] = useState(false);
  const { isBlur } = useBlur();
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768);
    };

    // Initial check and event listener setup
    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <MetaData title="About Us" />

      <section style={{ background: "#000" }} className="container-about">
        <div className="top-image-container">
          <img
            style={{ filter: isBlur ? "blur(10px)" : "none" }}
            src={isMobileView ? mobileImage : image}
            alt="Top"
          />
          <div
            style={{ filter: isBlur ? "blur(10px)" : "none" }}
            className="centered-text"
          >
            About&nbsp;Us
          </div>
          <div className="top-logo">
            <Logo />
          </div>
          <div className="top-nav">
            <TopNav />
          </div>
        </div>
        <div
          style={{ filter: isBlur ? "blur(10px)" : "none" }}
          className="content-about"
        >
          <div className="info-about">
            <div style={{ fontSize: "30px" }}>
              <b>Where it all began</b>
            </div>
            <div style={{ fontSize: "20px" }} className="para">
              Praveen and Sumath are the co-founders of the Salon Startup.
              Praveen is a veteran hairdresser with over 20 years of experience
              in the beauty industry. He has a passion for entrepreneurship and
              loves working with clients to create the perfect look. Sumath is
              an experienced businesswoman who has a knack for marketing and
              connecting with potential customers
            </div>
            <img src={Image} alt="about" className="about" />
            {/* <div style={{ textAlign: "center", backgroundColor: "#1E1E1E", borderRadius: "100px" }}>
                        <div className='contact-form' style={{ textAlign: "left", padding: formSubmitted ? "5vw 12vw" : "" }}>
                            {!formSubmitted && <div>
                                <div className='login'><b>Contact us</b></div>
                            </div>}
                            {!formSubmitted && <form className='contact-form1'>
                                <div>
                                    <input style={{ width: "100%", backgroundColor: "#1E1E1E" }} type="text" placeholder="Name" className='Mobile Number' id="mobileNumber" />
                                </div>
                                <div>
                                    <input style={{ width: "100%", backgroundColor: "#1E1E1E" }} type="email" placeholder="Email" className='Mobile Number' id="mobileNumber" />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <textarea
                                        style={{
                                            width: "100%",
                                            resize: "none", // Prevent manual resizing by the user
                                            minHeight: "20px", // Set a minimum height to prevent it from collapsing completely
                                            overflow: "hidden", // Hide the scrollbar
                                            boxSizing: "border-box", // Include padding and border in height calculation
                                            backgroundColor: "#1E1E1E",
                                        }}
                                        rows="1"
                                        id="messageTextarea"
                                        placeholder="Message"
                                        value={message}
                                        onChange={handleMessageChange}
                                        className='Mobile Number'
                                    />
                                    <div style={{ position: 'absolute', right: 10, bottom: 10, color: message.length > maxCharacterCount ? 'red' : 'rgba(255, 255, 255, 0.45)' }}>
                                        {message.length}/{maxCharacterCount}
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" />
                                        <span className="checkbox-custom"></span>
                                        I have read and agree to the Privacy policy
                                    </label>
                                </div>
                            </form>}
                            {formSubmitted &&
                                <>
                                    <div style={{ textAlign: "center" }}><img style={{ width: "40vw" }} src={Envolope} alt="envolope" /></div>
                                    <div style={{ textAlign: "center", fontSize: "40px" }}>We received your details and we'll contact you soon..... </div>
                                    <div style={{ fontSize: "15px", textAlign: "center" }}>Thank you for interest.</div>
                                </>
                            }
                            {!formSubmitted && <div style={{ textAlign: "center" }}>
                                <button onClick={() => { setFormSubmitted(true) }} style={{ padding: "10px 10vw" }} className='LoginButton'>Sent</button>
                            </div>}
                        </div> 

                </div> */}
          </div>
          <Footer />
        </div>
      </section>
    </>
  );
}

export default AboutUs;
