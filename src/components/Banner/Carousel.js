import { makeStyles } from "@material-ui/core";     //MUI styles
import axios from "axios";                          //Axios
import { useEffect, useState } from "react";        //React
import AliceCarousel from "react-alice-carousel";   //Carousel
import { Link } from "react-router-dom";            //React router DOM
import { TrendingCoins } from "../../config/api";   //API endpoint
import { CryptoState } from "../../CryptoContext";  //Context API
import { numberWithCommas } from "../CoinsTable";   //Function to format price number

const Carousel = () => {
  //trending state
  const [trending, setTrending] = useState([]);

  //extract currency and symbol from context API
  const { currency, symbol } = CryptoState();

  //function to fetch data from API
  const fetchTrendingCoins = async () => {
    //fetch data using axios
    const { data } = await axios.get(TrendingCoins(currency));
    //set trending to data fetched
    setTrending(data);
  };

  //fetch new data when currecy changes
  useEffect(() => {
    fetchTrendingCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  //make styles and store them into useStyles
  const useStyles = makeStyles((theme) => ({
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
    },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
    },
  }));

  //use styles and sotre them into classes object
  const classes = useStyles();

  //map through trending array
  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgb(14, 203, 129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default Carousel;
