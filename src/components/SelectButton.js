import { makeStyles } from "@material-ui/core";               //MUI styles

const SelectButton = ({ children, selected, onClick }) => {
  //make styles and store them into use styles
  const useStyles = makeStyles({
    selectbutton: {
      border: "1px solid #4E87F7",
      borderRadius: 5,
      padding: 10,
      fontFamily: "Montserrat",
      cursor: "pointer",
      backgroundColor: selected ? "#4E87F7" : "",
      color: selected ? "white" : "",
      fontWeight: selected ? 700 : 500,
      "&:hover": {
        backgroundColor: "#4E87F7",
        color: "black",
      },
      width: "23%",
      textAlign: "center",
    },
  });

  //use styles and store them into classes object
  const classes = useStyles();

  return (
    <span onClick={onClick} className={classes.selectbutton}>
      {children}
    </span>
  );
};

export default SelectButton;
