// This component manages the display of square cards representing salons on the "Salons" page.

import React, { useContext, useEffect, useState } from "react";
import SquareCard from "./SquareCard";
import FilterSortPopup from "./FilterSortPopup";
import LocationDropdown from "./LocationDropdown";
// import { cardData } from "./Data";
// import { useSwipeable } from 'react-swipeable';
import { useBlur } from "../context/blurContext";
import { getAllSalons, filterData } from "../Apis/Salons_service";
import { CardsLoader } from "../Components2/Loader";
import { useNavigate } from "react-router-dom";
import { Store } from "../App";
import { removeToken } from "../context/StorageToken";

// TODO : if there is a empty salons
function EmptySalons() {
  return (
    <div>
      <h1 style={{ textAlign: "center", padding: "20px 0px" }}>No Salons</h1>
    </div>
  );
}

function SquareCardsContainer() {
  // ? ------------------------------------------------------------
  //  ?  ----------- React Router Dom---------------------
  // ? -----------------------------------------------------------
  const navigate = useNavigate();

  // ? ------------------------------------------------------------
  //  ?  ----------- UseContext ---------------------
  // ? -----------------------------------------------------------
  const [, setisAuth] = useContext(Store);

  // ? ------------------------------------------------------------
  //  ?  ----------- All useStates---------------------
  // ? -----------------------------------------------------------
  const { isBlur } = useBlur();
  const [issmallscreen, setIsSmallScreen] = useState(false);
  const [cardData, setcardData] = useState([]);
  const [allCards, setallCards] = useState([]);
  const [loading, setloading] = useState(true);
  const [totalPages, settotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCardsLocation, setFilteredCardsLocation] = useState(null);

  // ? ------------------------------------------------------------
  //  ?  ----------- Functions ---------------------
  // ? -----------------------------------------------------------

  const calculateAverageRating = (reviewData) => {
    if (!reviewData || reviewData.length === 0) {
      return 0; // If there are no reviews or reviewData is undefined, return 0
    }
    const totalRatings = reviewData.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating = totalRatings / reviewData.length;
    return Number(averageRating.toFixed(1)); // Round to 1 decimal place
  };

  // Map and update salon data with average ratings
  const CardData = cardData.map((card) => ({
    ...card,
    ratings: calculateAverageRating(card.reviewData),
  }));

  // Generate unique location options for filtering
  const locations = ["All", ...new Set(CardData.map((card) => card.Location))];

  // State to manage filter options
  const [filterOptions, setFilterOptions] = useState({
    distance: "",
    priceFrom: "",
    priceTo: 1000,
    ratings: "",
    services: "",
    sort: "",
    sortOrder: "",
    combos: "",
    manhood: "",
  });

  const [selectedLocation, setSelectedLocation] = useState("All"); // State to manage the selected location filter
  const [showFilters, setShowFilters] = useState(false); // State to control filter popup visibility
  // console.log(selectedLocation, "selected location");
  // console.log(filterOptions, "seethis");

  const fetchSalons = async () => {
    let response;
    // console.log(filterOptions, "check");

    if (filterOptions && showFilters) {
      setloading(true);
      response = await filterData(filterOptions);
    } else {
      response = await getAllSalons();
    }

    //  Success
    if (response.code === 200) {
      let update = response.data.salons.map((item, index) => ({
        id: item.salon_uuid,
        content: item.salon_name,
        imageSrc: item.salon_photos,
        Location: item.salon_area,
        address: item.salon_address,
        distance: item.distance?.toFixed(2) || null,
        ratings: item.rating,
        NoR: item.totalFeedback,
        services: item.salon_services.map((item) => ({
          ServiceName: item.service_name,
          DiscountedPrice: item.service_discount,
          OriginalPrice: item.service_original_price,
        })),
        Combos: item.salon_combo_services.map((item) => ({
          ComboName: item.combo_name,
          ComboPrice: item.combo_price,
          ComboServices: item.combo_services_name,
        })),
      }));

      // Apply sorting based on filterOptions
      if (filterOptions.sort === "distance") {
        update.sort(
          (a, b) =>
            (parseFloat(a.distance) || 0) - (parseFloat(b.distance) || 0)
        );
      } else if (filterOptions.sort === "ratings") {
        update.sort((a, b) => {
          const ratingA = parseFloat(a.ratings) || 0;
          const ratingB = parseFloat(b.ratings) || 0;
          return ratingB - ratingA;
        });
      }

      setcardData([...update]);

      let x = Math.ceil(update.length / cardsPerPage);
      settotalPages(x);
      setallCards([...update]);

      setloading(false);
    }
    // ! if there is an error code
    if (response.code === 500) {
      removeToken();
      setisAuth(null);
      navigate("/");
      return;
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  // Function to toggle the filter popup
  const toggleFilterPopup = () => {
    setShowFilters(true);
  };

  // Function to apply filter changes
  const handleFilterApply = () => {
    setShowFilters(true);
    handleApplyFilters();
    setShowFilters(false);
  };

  // Function to apply filters and update displayed cards
  // const handleApplyFilters = () => {
  //   // Filter logic based on filterOptions and selectedLocation
  //   const filteredCards = cardData.filter((card) => {
  //     let showCard = true;

  //     // Filter based on distance
  //     if (filterOptions.distance !== "All") {
  //       const [minDistance, maxDistance] = filterOptions.distance.split("-");
  //       showCard =
  //         showCard &&
  //         parseFloat(card.distance) >= parseFloat(minDistance) &&
  //         parseFloat(card.distance) < parseFloat(maxDistance);
  //     }

  //     // Filter based on price range
  //     if (filterOptions.priceFrom !== "" && filterOptions.priceTo !== "") {
  //       showCard =
  //         showCard &&
  //         card.services.some((service) => {
  //           return (
  //             service.DiscountedPrice >= parseInt(filterOptions.priceFrom) &&
  //             service.DiscountedPrice <= parseInt(filterOptions.priceTo)
  //           );
  //         });
  //     }

  //     // Filter based on ratings
  //     if (filterOptions.ratings !== "All") {
  //       showCard =
  //         showCard && card.ratings >= parseFloat(filterOptions.ratings);
  //     }

  //     // Filter based on services
  //     if (filterOptions.services !== "All") {
  //       if (filterOptions.combos) {
  //         showCard =
  //           showCard &&
  //           card.Combos &&
  //           card.Combos.some((combo) =>
  //             combo.ComboServices.includes(filterOptions.services)
  //           );
  //         showCard =
  //           showCard ||
  //           (card.services &&
  //             card.services.some((service) => {
  //               return service.ServiceName === filterOptions.services;
  //             }));
  //       } else {
  //         showCard =
  //           showCard &&
  //           card.services.some((service) => {
  //             return service.ServiceName === filterOptions.services;
  //           });
  //       }
  //     }

  //     if (selectedLocation !== "All") {
  //       showCard = showCard && card.Location === selectedLocation;
  //     }

  //     return showCard;
  //   });

  //   if (filterOptions.sort === "distance") {
  //     filteredCards.sort((a, b) => {
  //       const distA = parseFloat(a.distance);
  //       const distB = parseFloat(b.distance);
  //       return filterOptions.sortOrder === "asc"
  //         ? distA - distB
  //         : distB - distA;
  //     });
  //   } else if (filterOptions.sort === "ratings") {
  //     filteredCards.sort((a, b) => {
  //       const ratingsA = parseFloat(a.ratings);
  //       const ratingsB = parseFloat(b.ratings);
  //       return filterOptions.sortOrder === "asc"
  //         ? ratingsA - ratingsB
  //         : ratingsB - ratingsA;
  //     });
  //   } else if (filterOptions.sort === "price") {
  //     filteredCards.sort((a, b) => {
  //       const priceA = Math.min(
  //         ...a.services.map((service) => service.DiscountedPrice)
  //       );
  //       const priceB = Math.min(
  //         ...b.services.map((service) => service.DiscountedPrice)
  //       );
  //       return filterOptions.sortOrder === "asc"
  //         ? priceA - priceB
  //         : priceB - priceA;
  //     });
  //   }
  //   setallCards(filteredCards);
  // };

  const handleApplyFilters = () => {
    fetchSalons();
  };

  const handleLocationChange = (location) => {
    // console.log(location);
    if (location === "All") {
      setFilteredCardsLocation(null);
    } else {
      let update = allCards.filter((item) => item.Location === location);
      setFilteredCardsLocation(update);
    }
    // setSelectedLocation(location);
  };
  // console.log(filteredCardsLocation);

  useEffect(() => {
    handleApplyFilters();
  }, [selectedLocation]);

  const [cardsPerPage, setCardsPerPage] = useState(getCardsPerPage());

  function getCardsPerPage() {
    // if (window.innerWidth < 980) {
    //   return allCards.length; // Display all cards in one page
    // } else
    if (window.innerWidth >= 980 && window.innerWidth < 1024) {
      return 9; // Display 9 cards per page
    } else {
      return 12; // Display 12 cards per page
    }
  }

  useEffect(() => {
    function handleResize() {
      setCardsPerPage(getCardsPerPage());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const resetFiltersFunc = () => {
    setallCards(cardData);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = allCards.slice(indexOfFirstCard, indexOfLastCard);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 700);
  }, [window.innerWidth]);

  return (
    <>
      {!loading ? (
        currentCards.length !== 0 ? (
          <>
            <div
              className="upnav"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                filter: isBlur ? "blur(10px)" : "none",
              }}
            >
              <div className="filter-sort">
                {showFilters ? (
                  <button className="buttonapply" onClick={handleFilterApply}>
                    Apply
                  </button>
                ) : (
                  <button
                    className="buttonapply"
                    onClick={() => setShowFilters(true)}
                  >
                    {issmallscreen ? "Filter" : "Filter & sort"}
                  </button>
                )}
                {showFilters && (
                  <FilterSortPopup
                    close={() => {
                      setShowFilters(false);
                    }}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    resetFiltersFunc={resetFiltersFunc}
                  />
                )}
              </div>
              <div>
                <LocationDropdown
                  label="Location"
                  value={selectedLocation}
                  options={locations}
                  onChange={(value) => handleLocationChange(value)}
                  searchFilter={true}
                  setFilteredCardsLocation={setFilteredCardsLocation}
                />
              </div>
            </div>

            {/* Display the cards */}
            <div
              style={{ filter: isBlur ? "blur(10px)" : "none" }}
              className="square-cards-container"
            >
              {filteredCardsLocation ? (
                <div className="cards-wrapper">
                  {filteredCardsLocation.map((card, index) => (
                    <div key={index}>
                      <SquareCard key={card.id} {...card} salonData={card} />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="cards-wrapper">
                    {currentCards.map((card, index) => (
                      <div key={index}>
                        <SquareCard key={card.id} {...card} salonData={card} />
                      </div>
                    ))}
                    {Array.from({ length: cardsPerPage - cardData.length }).map(
                      (_, index) => (
                        <div key={`empty_${index}`} className="empty-space" />
                      )
                    )}
                  </div>

                  {/* Pagination */}
                  <div className="pagination">
                    <button
                      className="navbutton"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      style={{ cursor: currentPage === 1 && "no-drop" }}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={
                          currentPage === index + 1
                            ? "pagebutton active"
                            : "pagebutton"
                        }
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      className="navbutton"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      style={{
                        cursor: currentPage === totalPages && "no-drop",
                      }}
                    >
                      &gt;
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <EmptySalons />
        )
      ) : (
        <CardsLoader />
      )}
    </>
  );
}

export default SquareCardsContainer;
