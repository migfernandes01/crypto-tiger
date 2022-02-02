import { Box, Button, TextField } from "@material-ui/core";     //MUI components
import { useState } from "react";                               //React state
import { CryptoState } from "../../CryptoContext";              //Context api
import { auth } from "../../firebase";                          //Firebase auth
import { signInWithEmailAndPassword } from "firebase/auth";     //Firebase signing in

const Login = ({ handleClose }) => {
  //email state
  const [email, setEmail] = useState("");
  //password state
  const [password, setPassword] = useState("");

  //extract setAlert from Context api
  const { setAlert } = CryptoState();

  //function to handle sumbittion
  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        open: true,
        message: "Please fill all the fields",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setAlert({
        open: true,
        message: `Login successful. Welcome back ${result.user.email}`,
        type: "success",
      });

      handleClose();
    } catch (error) {
        let errorMessage = 'Error with the login process. Please try again'; 
        if(error.message === 'Firebase: Error (auth/invalid-email).'){
          errorMessage = 'Invalid e-mail. Please try again';
        }else if(error.message === 'Firebase: Error (auth/user-not-found).'){
          errorMessage = 'Wrong e-mail or password. Please try again';
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
      <Button
        variant="contained"
        size="large"
        onClick={handleSubmit}
        style={{ backgroundColor: "#4E87F7", color:'white' }}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
