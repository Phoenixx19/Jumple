import { React, useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import { ScreenRoll } from "../ScreenRoll";
import { useState } from "react";
import { Random } from "random";
import { getSeed } from "../getSeed.js";
import * as Utils from '../Utils.js';

const img = ScreenRoll().screenPath;
const seed = await getSeed();

const useOnUpdate = (callback, deps) => {
    const isMountingRef = useRef(false);

    useEffect(() => {
        isMountingRef.current = true;
    }, []);

    useEffect(() => {
        if (!isMountingRef.current) {
            return callback();
        } else {
            isMountingRef.current = false;
        }
    }, deps);
};


const ScreenImage = ({ mistakeCount, guessStatus }) => {
    const initialZoom = 10;
    const { size: initialSize, minxvalue, maxxvalue } = Utils.calculateDimensions(initialZoom);

    const rng = new Random(seed);
    const randomXPosition = rng.float(minxvalue, maxxvalue);
    const randomYPosition = rng.float(0, 100);

    const [xPositionState, setxPositionState] = useState(randomXPosition);
    const [yPositionState] = useState(randomYPosition);
    const [zoomState, setZoomState] = useState(initialZoom);
    const [sizeState, setSizeState] = useState(initialSize);


    useOnUpdate(() => {
        decreaseZoom();
    }, [mistakeCount])

    useOnUpdate(() => {
        if (guessStatus.isScreenGuessed) {
            unzoom();
        }
    }, [guessStatus])


    function decreaseZoom() {
        const newZoom = zoomState - 1;
        const scaledZoom = Utils.zoomScalar(initialZoom, newZoom);
        const { size: newSize, minxvalue: newMinxValue, maxxvalue: newMaxxValue } = Utils.calculateDimensions(scaledZoom);

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

    return (

            <div style={{
                aspectRatio: 4 / 3,
                width:"100%",
                maxWidth:"28rem",
                background: `url('${img}')`,
                backgroundRepeat: "no-repeat",
                backgroundPositionX: `${xPositionState}%`,
                backgroundPositionY: `${yPositionState}%`,
                backgroundSize: `${sizeState}%`,
                borderRadius: 0.000001, //xd
                margin: "0.5rem",
                outline: "8px solid #121212"
            }}></div>

    )
}

export default ScreenImage;