import axios from "axios";                        //Axios
import { useEffect, useState } from "react";      //React
import { HistoricalChart } from "../config/api";  //API endpoint
import { Line } from "react-chartjs-2";           //ReachChartjs2
import {
  CircularProgress,
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core";                       //MUI components
import SelectButton from "./SelectButton";        //Button
import { chartDays } from "../config/data";       //chartdays data
import { CryptoState } from "../CryptoContext";   //Context API

const CoinInfo = ({ coin }) => {
  //historicData state
  const [historicData, setHistoricData] = useState();
  //days state
  const [days, setDays] = useState(1);
  
  //extract currency from context api
  const { currency } = CryptoState();

  //make styles and store them into useStyles
  const useStyles = makeStyles((theme) => ({
    container: {
      width: "75%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 25,
      padding: 40,
      [theme.breakpoints.down("md")]: {
        width: "100%",
        marginTop: 0,
        padding: 20,
        paddingTop: 0,
      },
    },
  }));

  //use styles and store them into classes object
  const classes = useStyles();

  //function to fetch data from API
  const fetchHistoricData = async () => {
    //fetch data using axios
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    //set historic data to data
    setHistoricData(data.prices);
  };

  //fetch data from api when days or currency change
  useEffect(() => {
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, currency]);

  //create dark theme
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicData ? (
          <CircularProgress
            style={{ color: "#4E87F7" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "#4E87F7",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => setDays(day.value)}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
