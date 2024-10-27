import React from "react";
import "./styles.css";
import ScreenPicture from './Components/ScreenPicture';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Timer from "./Components/Timer";
import { Grid2 } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function App() {
    return (
        <>
            <div className="topBar">

                <Grid2 container alignItems="center">
                    <Grid2 size={4}>
                        <div className="timerDiv"><p className="nextScreenText">Next screen: </p><Timer /></div>
                    </Grid2>
                    <Grid2 size={4}>
                        <p className="logo">JUMPLE</p>
                    </Grid2>
                    <Grid2 size={4}>
                        <p className="signature">by Mental Masochist</p>
                    </Grid2>
                </Grid2>
            </div>




            <ThemeProvider theme={darkTheme}>
                <ScreenPicture />
            </ThemeProvider>

        </>
    )
}
export default App
