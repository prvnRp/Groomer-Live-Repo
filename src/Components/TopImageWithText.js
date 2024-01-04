// TopImageWithText.js
import React, { useState, useEffect } from 'react';
import '../App.css';
import image from '../images/rectangle-3.svg'
import Header from './Header';
import TopNav from './TopNav';
import Logo from './Logo';
import mobileImage from '../images/rectangle-46.svg'
import { useBlur } from '../context/blurContext';

function TopImageWithText() {
    const { isBlur } = useBlur(); // Access the blur context to determine if blur effect should be applied

    const [isMobileView, setIsMobileView] = useState(false); // State variable to track if the view is in mobile mode

    useEffect(() => {
        // Function to handle window resize events
        const handleResize = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        // Initial check and event listener setup
        handleResize();
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className="top-image-container">
            {/* Conditional rendering of the background image based on mobile view */}
            <img style={{ filter: isBlur ? 'blur(10px)' : 'none' }} src={isMobileView ? mobileImage : image} alt="Top Image" />
            <div style={{ filter: isBlur ? 'blur(10px)' : 'none' }} className="centered-text">Salons</div>
            <div className='top-logo'>
                <Logo />
            </div>
            <div className='top-nav'> {/* Displaying the top navigation */}
                <TopNav />
            </div>
        </div>
    );
}

export default TopImageWithText;
