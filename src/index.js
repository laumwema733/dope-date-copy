import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

// function Test() {
//   const [movieRatings, setMovieRating] = useState(0);
//   return (
//     <div>
//       <StarRating color="green" maxRating={10} onSetRating={setMovieRating} />
//       <p>This movie was rated {movieRatings} stars</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={10} />
    <StarRating
      message={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
      size={32}
      color="red"
    />
    <StarRating
      maxRating={10}
      size={24}
      color="blue"
      className="test"
      defaultRating={3}
    />
    <Test /> */}
  </React.StrictMode>,
);
