import React from "react";                              //React
import { makeStyles } from "@material-ui/core/styles";  //MUI styles
import Drawer from "@material-ui/core/Drawer";          //MUI drawer
import { Avatar, Button } from "@material-ui/core";     //MUI Avatar and Button
import { CryptoState } from "../../CryptoContext";      //Context API
import { signOut } from "firebase/auth";                //Firebase signout
import { auth, db } from "../../firebase";              //Firebase authentication
import { numberWithCommas } from "../CoinsTable";       //Function to format price number
import { AiFillDelete } from "react-icons/ai";          //React icon
import { doc, setDoc } from "firebase/firestore";       //Firebase DB
import { useHistory } from "react-router-dom";          //React router DOM

//make styles and store them into useStyles
const useStyles = makeStyles({
  container: {
    width: 350,
    padding: 25,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: "monospace",
  },
  profile: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
    height: "92%",
  },
  logout: {
    height: "6%",
    width: "100%",
    backgroundColor: "#4E87F7",
    marginTop: 20,
  },
  picture: {
    width: 200,
    height: 200,
    cursor: "pointer",
    backgroundColor: "#4E87F7",
    objectFit: "contain",
  },
  watchlist: {
    flex: 1,
    width: "100%",
    backgroundColor: "grey",
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    overflowY: "scroll",
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: "black",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4E87F7",
    boxShadow: "0 0 3px black",
  },
});

export default function UserSidebar() {
  //use styles and store them into classes object
  const classes = useStyles();

  //react router history
  const history = useHistory();

  //state state
  const [state, setState] = React.useState({
    right: false,
  });

  //extract user, setAlert, watchlist, coins and symbol from context api
  const { user, setAlert, watchlist, coins, symbol } = CryptoState();

  //function to handle drawer toggling
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  //function to handle a logout
  const logOut = () => {
    //sign user out
    signOut(auth);

    //set alert
    setAlert({
      open: true,
      type: "success",
      message: "Logout successfull",
    });
    //toggle drawer
    toggleDrawer();
  };

  //function to handle removal from watchlist
  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, "watchlist", user.uid);
    try {
      await setDoc(
        coinRef,
        { coins: watchlist.filter((watch) => watch !== coin?.id) },
        { merge: true }
      );

      setAlert({
        open: true,
        message: `${coin.name} removed from the watchlist`,
        type: "success",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: "Error removing coin from watchlist",
        type: "error",
      });
    }
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: "pointer",
              backgroundColor: "#4E87F7",
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: "100%",
                    fontSize: 25,
                    textAlign: "center",
                    fontWeight: "bolder",
                    wordWrap: "break-word",
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  <span style={{ fontSize: 15, textShadow: "0 0 5px black" }}>
                    Watchlist
                  </span>
                  {coins.map((coin) => {
                    if (watchlist.includes(coin.id))
                      return (
                        <div className={classes.coin}>
                          <span style={{ cursor: 'pointer' }} onClick={() => history.push(`/coins/${coin.id}`)}>
                            {coin.name}
                          </span>
                          <span style={{ display: "flex", gap: 8 }}>
                            {symbol}{numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFromWatchlist(coin)}
                            />
                          </span>
                        </div>
                      );
                    else return <></>;
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={classes.logout}
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
