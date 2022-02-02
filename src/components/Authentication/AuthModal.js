import { makeStyles } from "@material-ui/core/styles";                //MUI styles
import Modal from "@material-ui/core/Modal";                          //MUI modal
import Backdrop from "@material-ui/core/Backdrop";                    //MUI backdrop
import Fade from "@material-ui/core/Fade";                            //MUI fade
import { Button, Tab, Tabs, AppBar, Box } from "@material-ui/core";   //MUI components
import Signup from "./Signup";                                        //Signup component
import Login from "./Login";                                          //Login component
import { useState } from "react";                                     //React state
import { CryptoState } from "../../CryptoContext";                    //Context API
import { auth } from "../../firebase";                                //Firebase auth
import GoogleButton from "react-google-button";                       //Google button component
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";  //Firebase auth

//make styles and store them into useStyles
const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    color: "white",
    borderRadius: 10,
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    gap: 20,
    fontSize: 20,
  },
}));

export default function AuthModal() {
  //use styles and store them into classes object
  const classes = useStyles();
  //open state
  const [open, setOpen] = useState(false);

  //extract setAlert from context api
  const { setAlert } = CryptoState();

  //function to handle modal opening
  const handleOpen = () => {
    setOpen(true);
  };

  //function to handle modal closing
  const handleClose = () => {
    setOpen(false);
  };

  //value state
  const [value, setValue] = useState(0);

  //function to handle change of tabs
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //google authentication provider
  const googleProvider = new GoogleAuthProvider();

  //function to handle signing up with google
  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((res) => {
        setAlert({
          open: true,
          message: `Sign up successful. Welcome ${res.user.email}`,
          type: "success",
        });

        handleClose();
      })
      .catch((error) => {
        setAlert({
          open: true,
          message: 'Error authenticating your google account',
          type: "error",
        });
        return;
      });
  };

  return (
    <div>
      <Button
        variant="contained"
        style={{
          width: 85,
          height: 40,
          marginLeft: 15,
          backgroundColor: "#4E87F7",
          color: 'white'
        }}
        onClick={handleOpen}
      >
        Login
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <AppBar
              position="static"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant="fullWidth"
                style={{ borderRadius: 10 }}
              >
                <Tab label="Login" />
                <Tab label="Sign Up" />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            <Box className={classes.google}>
              <span>OR</span>
              <GoogleButton
                style={{ width: "100%", outline: "none" }}
                onClick={signInWithGoogle}
              />
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
