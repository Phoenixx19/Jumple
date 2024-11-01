import React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { ScreenRoll } from "../ScreenRoll";
import { Paper } from "@mui/material";
import { Grid2 } from "@mui/material";
import { useEffect } from "react";
import { Stack } from "@mui/material";

const roll = ScreenRoll();


const ScreenNumberGuess = ({ incrementMistake, guessStatus, setGuessStatus }) => {
    const [number, setNumber] = useState(1);
    const [guessedNumbers, setGuessedNumbers] = useState([]);
    const [buttonDisableState, setButtonDisableState] = useState(false);

    const lock = () => {
        if (!guessStatus.isAreaGuessed) {
            return {
                filter: "blur(5px)",
                '&::after': {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "rgba(255, 255, 255, 0)",
                    zIndex: 1,
                }
            }
        }
    }

    useEffect(() => {
        const numberMap = guessedNumbers.map(number => number.number);

        if (numberMap.includes(number)) {
            setButtonDisableState(true);
        } else {
            setButtonDisableState(false);
        }
    }, [number, guessedNumbers])


    function increment() {
        if (number >= 10) return;
        setNumber(number + 1);
    }

    function decrement() {
        if (number <= 1) return;
        setNumber(number - 1);
    }

    function guess(guessedNumber) {
        if (guessedNumber == roll.screenNumber) {
            setGuessedNumbers(oldNumbers => [...oldNumbers, {
                number: number,
                isCorrect: true
            }]);

            setGuessStatus(prevState => ({
                ...prevState,
                "isScreenGuessed": true
            }));

        } else {
            setGuessedNumbers(oldNumbers => [...oldNumbers, {
                number: number,
                isCorrect: false
            }]);

            incrementMistake('screen');
        }
    }

    return (
        <Paper sx={{
            padding: 2,
            textAlign: "center",
            ...lock()
        }} variant="outlined">
            <p style={{ fontSize: 100, margin: 0, }}>{number}</p>

            <Grid2 container spacing={1}>
                <Grid2 size={6}>
                    <Button fullWidth disabled={guessStatus.isScreenGuessed} onClick={decrement} variant="outlined">{"<"}</Button>
                </Grid2>
                <Grid2 size={6}>
                    <Button fullWidth disabled={guessStatus.isScreenGuessed} onClick={increment} variant="outlined">{">"}</Button>
                </Grid2>
                <Grid2 size={12}>
                    <Button onClick={() => guess(number)} disabled={buttonDisableState} size="small" sx={{ fontFamily: "JKFontMini", fontSize: "20px", padding: "0" }} fullWidth variant="contained">Guess screen number</Button>
                </Grid2>

            </Grid2>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "center", flexWrap: "wrap", marginTop: 1 }}>
                {guessedNumbers.map(number => {
                    return (
                        <Paper sx={{
                            backgroundColor: number.isCorrect ? "#85e376" : '#e37d76',
                            color: number.isCorrect ? "#11910f" : "#91170f",
                            paddingX: 1.5,
                            paddingY: 1,
                            fontSize: "20px"
                        }} key={number.number}>{number.number}</Paper>
                    )
                })}
            </Stack>


        </Paper>
    )
}

export default ScreenNumberGuess;