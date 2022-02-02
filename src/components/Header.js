import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";                                  //MUI components
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";                          //MUI styles
import { useHistory } from "react-router-dom";              //React DOM  
import { CryptoState } from "../CryptoContext";             //Context API
import AuthModal from "./Authentication/AuthModal";         //Modal Component
import UserSidebar from "./Authentication/UserSidebar";     //Sidebar component

//make styles and store it in useStyles
const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    color: "#4E87F7",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

//create darkTheme
const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

function Header() {
  //use styles and store it into classes object
  const classes = useStyles();
  //extract currency, setCurrency, user from context api
  const { currency, setCurrency, user } = CryptoState();
  //use history
  const history = useHistory();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => history.push(`/`)}
              variant="h6"
              className={classes.title}
            >
              Crypto Tiger
            </Typography>
            <Select
              variant="outlined"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={currency}
              style={{ width: 85, height: 40 }}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"EUR"}>EUR</MenuItem>
            </Select>

            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
