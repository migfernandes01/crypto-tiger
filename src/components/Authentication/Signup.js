import { Box, Button, TextField } from "@material-ui/core";       //MUI components
import { useState } from "react";                                 //React state
import { CryptoState } from "../../CryptoContext";                //Context api
import { createUserWithEmailAndPassword } from "firebase/auth";   //Firebase signup
import { auth } from "../../firebase";                            //firebase auth

const Signup = ({ handleClose }) => {
  //email state
  const [email, setEmail] = useState("");
  //password state
  const [password, setPassword] = useState("");
  //confirmPassword state
  const [confirmPassword, setConfirmPassword] = useState("");

  //extract setAlert from context api
  const { setAlert } = CryptoState();

  //function to handle sumbittion
  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        open: true,
        message: "Passwords do not match. Please try again",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setAlert({
        open: true,
        message: `Sign Up successful. Welcome ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error) {
      let errorMessage = 'Error with the sign up process. Please try again';
      if(error.message === 'Firebase: Error (auth/invalid-email).'){
        errorMessage = 'Invalid e-mail. Please try again';
      }else if(error.message === 'Firebase: Error (auth/internal-error).'){
        errorMessage = 'Please verify all the fields';
      }else if(error.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).'){
        errorMessage = 'Password needs to be at least 6 characters long';
      }else if(error.message === 'Firebase: Error (auth/missing-email).'){
        errorMessage = 'Please insert an e-mail';
      }else if(error.message === 'Firebase: Error (auth/email-already-in-use).'){
        errorMessage = 'E-mail already in use. Please try again';
      }
      setAlert({
        open: true,
        message: errorMessage,
        type: "error",
      });
      return;
    }
  };

  return (
    <Box
      p={3}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Enter Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        style={{ backgroundColor: "#4E87F7", color:'white' }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
