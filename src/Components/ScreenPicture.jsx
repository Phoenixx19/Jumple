import React from "react";
import { useState } from 'react'
import { Random } from 'random';
import { ScreenRoll } from "../ScreenRoll";
import MapGuess from "./MapGuess";
import AreaGuess from "./AreaGuess";
import ScreenNumberGuess from "./ScreenNumberGuess";
import { Button, Paper } from "@mui/material";
import { Grid2 } from "@mui/material";

const roll = ScreenRoll();
const img = roll.screenPath;

const calculateDimensions = (zoom) => {
    const size = zoom * (4 / 3) * 100;
    const minxvalue = zoom / ((8 * zoom) - 6) * 100;
    const maxxvalue = 100 - minxvalue;
    return { size, minxvalue, maxxvalue };
};

function zoomScalar(max, zoom) {
    const normalizedZoom = (zoom - 1) / (max - 1);
    const falloffFactor = Math.pow(normalizedZoom, 2);
    return 1 + falloffFactor * (max - 1);
};


const ScreenPicture = () => {
    const initialZoom = 10;
    const { size: initialSize, minxvalue, maxxvalue } = calculateDimensions(initialZoom);

    const seed = new Date().toISOString().slice(0, 10);
    const rng = new Random(seed);
    const randomXPosition = rng.float(minxvalue, maxxvalue);
    const randomYPosition = rng.float(0, 100);

    const [xPositionState, setxPositionState] = useState(randomXPosition);
    const [yPositionState] = useState(randomYPosition);
    const [zoomState, setZoomState] = useState(initialZoom);
    const [sizeState, setSizeState] = useState(initialSize);

    const [mistakeCount, setMistakeCount] = useState(0);



    function decreaseZoom() {
        const newZoom = zoomState - 1;
        const scaledZoom = zoomScalar(initialZoom, newZoom);
        const { size: newSize, minxvalue: newMinxValue, maxxvalue: newMaxxValue } = calculateDimensions(scaledZoom);

        if (xPositionState < newMinxValue) {
            setxPositionState(newMinxValue);
        } else if (xPositionState > newMaxxValue) {
            setxPositionState(newMaxxValue);
        }

        setZoomState(Math.max(2, newZoom));
        setSizeState(newSize);
    }

    function unzoom() {
        setSizeState(400 / 3);
        setxPositionState(50);
    }

    const [isMapGuessed, setIsMapGuessed] = useState(false);
    const [isAreaGuessed, setIsAreaGuessed] = useState(false);
    const [isScreenGuessed, setIsScreenGuessed] = useState(false);

    const [wrongGuesses, setWrongGuesses] = useState({
        map: 0,
        area: 0,
        screen: 0
    })

    const [isCoppied, setIsCoppied] = useState(false);

    function incrementMistake(property) {
        setWrongGuesses(prevState => ({
            ...prevState,
            [property]: prevState[property] + 1
        }));

        setMistakeCount(mistakeCount + 1);
    }


    function clipboardShare() {
        const date = new Date().toISOString().slice(0, 10);

        const generateSquares = (count) => '🟥'.repeat(count) + '🟩';

        const mapSquares = generateSquares(wrongGuesses.map);
        const areaSquares = generateSquares(wrongGuesses.area);
        const screenSquares = generateSquares(wrongGuesses.screen);

        const copyText = `Jumple ${date} Mistakes: ${mistakeCount}\n\nMap guesses: ${mapSquares}\nArea guesses: ${areaSquares}\nScreen guesses: ${screenSquares}`;

        navigator.clipboard.writeText(copyText);
        setIsCoppied(true);
    }

    const shareButtonDisplay = isScreenGuessed ? "inline" : "none";

    return (
        <>
            <Paper variant="outline" >
                <div style={{
                    aspectRatio: 4 / 3,
                    width: "28rem",
                    background: `url('${img}')`,
                    backgroundRepeat: "no-repeat",
                    backgroundPositionX: `${xPositionState}%`,
                    backgroundPositionY: `${yPositionState}%`,
                    backgroundSize: `${sizeState}%`,
                    borderRadius: 4,
                    margin: "0.5rem"
                }}></div>
            </Paper>

            <div style={{ display: "flex" }}>
                <Paper variant="outline" sx={{ padding: "0.7rem", borderTopLeftRadius: 0, borderTopRightRadius: 0, marginBottom: "0.5rem" }}>
                    <p style={{ margin: 0, fontSize: "20px", color: isScreenGuessed ? "#11910f" : "white" }}>Mistakes: {mistakeCount}</p>
                </Paper>

                <Button onClick={clipboardShare} variant={isCoppied ? "contained" : "outlined"} sx={{ marginBottom: "0.5rem", fontFamily: "JKFontMini", fontSize: "20px", display: shareButtonDisplay }} disableElevation >copy score</Button>


            </div>



            <Grid2 container spacing={2} sx={{ width: "35rem" }}>
                <Grid2 size={12}>
                    <MapGuess decreaseZoom={decreaseZoom} setIsMapGuessed={setIsMapGuessed} incrementMistake={incrementMistake} />
                </Grid2>
                <Grid2 size={6}>
                    <AreaGuess decreaseZoom={decreaseZoom} isMapGuessed={isMapGuessed} setIsAreaGuessed={setIsAreaGuessed} incrementMistake={incrementMistake} />
                </Grid2>
                <Grid2 size={6}>
                    <ScreenNumberGuess decreaseZoom={decreaseZoom} isAreaGuessed={isAreaGuessed} unzoom={unzoom} incrementMistake={incrementMistake} setIsScreenGuessed={setIsScreenGuessed} />
                </Grid2>
            </Grid2>




        </>
    );
}

export default ScreenPicture;