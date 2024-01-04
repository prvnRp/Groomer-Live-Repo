import React from "react";
import "./Loader.css";
import { Skeleton } from "@mui/material";

const Loader = (props) => {
  const x = Object.values(props);
  let css = x.toString();

  return (
    <div className={`loader-center ${css}`}>
      <div className="custom-loader"></div>
      {/* <div class="dots" data-title="dot-pulse"></div> */}
    </div>
  );
};

export const ButtonLoader = () => {
  return <div class="button-loader"></div>;
};

export const DotLoader = () => {
  return <div class="dots"></div>;
};

export const CardsLoader = () => {
  let color = "#f8f9fa73";
  return (
    <div className="square-cards-container">
      <div className="cards-wrapper">
        {[1, 2, 3, 4].map((item) => (
          <div className="loader_squareCard" key={item}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Skeleton
                variant="rounded"
                width={215}
                height={125}
                style={{
                  backgroundColor: color,
                  borderRadius: "30px",
                }}
                animation="wave"
              />
            </div>
            <Skeleton
              width={210}
              height={15}
              style={{ backgroundColor: color }}
              animation="wave"
            />
            <Skeleton
              width={150}
              height={15}
              style={{ backgroundColor: color }}
              animation="wave"
            />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Skeleton
                width={50}
                height={15}
                style={{ backgroundColor: color }}
                animation="wave"
              />
              <Skeleton
                width={150}
                height={15}
                style={{ backgroundColor: color }}
                animation="wave"
              />
            </div>

            <Skeleton
              width={150}
              height={15}
              style={{ backgroundColor: color }}
              animation="wave"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Loader;
