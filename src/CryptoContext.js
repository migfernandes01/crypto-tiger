import { createContext, useContext, useEffect, useState } from "react";   //React
import { onAuthStateChanged } from "firebase/auth";                       //Firebase auth
import { auth, db } from "./firebase";                                    //Firebase DB
import axios from "axios";                                                //Axios
import { CoinList } from "./config/api";                                  //API endpoint
import { onSnapshot, doc } from "firebase/firestore";                     //Firebase storage

//create context
const Crypto = createContext();

const CryptoContext = ({ children }) => {
  //currency state
  const [currency, setCurrency] = useState("USD");
  //symbol state
  const [symbol, setSymbol] = useState("$");
  //alert state
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  //user state
  const [user, setUser] = useState(null);
  //coins state
  const [coins, setCoins] = useState([]);
  //loading state
  const [loading, setLoading] = useState(false);
  //watchlist state
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          //console.log(coin.data().coins);
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUser(user);
      else setUser(null);
    });
  }, []);

  //function to fetch data from API
  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));

    setCoins(data);
    setLoading(false);
  };

  //when currency changes set ymbol and fetch new data
  useEffect(() => {
    if (currency === "EUR") setSymbol("€");
    else if (currency === "USD") setSymbol("$");

    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        alert,
        setAlert,
        user,
        coins,
        loading,
        watchlist,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

//export context api
export const CryptoState = () => {
  return useContext(Crypto);
};
