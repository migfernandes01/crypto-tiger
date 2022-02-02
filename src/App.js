import React, { Suspense, lazy } from "react";              //React
import { makeStyles } from "@material-ui/core";             //MUI styles
import "./App.css";                                         //Css
import { BrowserRouter, Route } from "react-router-dom";    //React DOM
import Header from "./components/Header";                   //Header component
import Alert from "./components/Alert";                     //Alert component

const Homepage = lazy(() => import("./Pages/HomePage"));    //Lazy load Homepage
const CoinPage = lazy(() => import("./Pages/CoinPage"));    //Lazu load CoinPage

//make styles and store it in useStyles
const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  //use styles and store it into classes object
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Suspense fallback={<div></div>}>
          <Route path="/" component={Homepage} exact />
          <Route path="/coins/:id" component={CoinPage} exact />
        </Suspense>
      </div>
      <Alert />
    </BrowserRouter>
  );
}

export default App;
