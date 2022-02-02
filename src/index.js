import React from "react";                              //React
import ReactDOM from "react-dom";                       //React DOM
import "./index.css";                                   //Css
import App from "./App";                                //App component
import "react-alice-carousel/lib/alice-carousel.css";   //Carousel
import CryptoContext from "./CryptoContext";            //Context API

ReactDOM.render(
  <React.StrictMode>
    <CryptoContext>
      <App />
    </CryptoContext>
  </React.StrictMode>,
  document.getElementById("root")
);
