import React, { useState, useEffect } from "react";

const LocationComponent = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  console.log("new location", location.latitude, location.longitude);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            switch (error.code) {
              case error.PERMISSION_DENIED:
                setError("User denied the request for Geolocation.");
                break;
              case error.POSITION_UNAVAILABLE:
                setError("Location information is unavailable.");
                break;
              case error.TIMEOUT:
                setError("The request to get user location timed out.");
                break;
              case error.UNKNOWN_ERROR:
                setError("An unknown error occurred.");
                break;
              default:
                setError("An error occurred.");
            }
          }
        );
      } else {
        setError("Geolocation is not supported.");
      }
    };

    getLocation();
  }, []);

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      )}
    </div>
  );
};

export default LocationComponent;
