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


    function gradientColor(value) {
        value = Math.min(Math.max(value, 0), 5);

        const startColor = { r: 0x11, g: 0x91, b: 0x0F };
        const middleColor = { r: 0xF6, g: 0xFA, b: 0x02 };
        const endColor = { r: 0x91, g: 0x17, b: 0x0F };

        let r, g, b;

        if (value <= 2.5) {
            const ratio = value / 2.5;
            r = Math.round(startColor.r + (middleColor.r - startColor.r) * ratio);
            g = Math.round(startColor.g + (middleColor.g - startColor.g) * ratio);
            b = Math.round(startColor.b + (middleColor.b - startColor.b) * ratio);
        } else {
            const ratio = (value - 2.5) / 2.5;
            r = Math.round(middleColor.r + (endColor.r - middleColor.r) * ratio);
            g = Math.round(middleColor.g + (endColor.g - middleColor.g) * ratio);
            b = Math.round(middleColor.b + (endColor.b - middleColor.b) * ratio);
        }
        
        const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        return hex;
    }

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
                    <p style={{ margin: 0, fontSize: "20px", color: isScreenGuessed ? gradientColor(mistakeCount) : "white" }}>Mistakes: {mistakeCount}</p>
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