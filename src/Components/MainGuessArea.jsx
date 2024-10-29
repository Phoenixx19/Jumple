import { React, useState } from 'react'
import MapGuess from "./MapGuess.jsx";
import AreaGuess from "./AreaGuess.jsx";
import ScreenNumberGuess from "./ScreenNumberGuess.jsx";
import { Paper, Grid2 } from "@mui/material";
import ShareButton from './ShareButton.jsx';
import ScreenImage from './ScreenImage.jsx';
import * as Utils from '../Utils.js';

const MainGuessArea = () => {
    const [mistakeCount, setMistakeCount] = useState(0);

    const [guessStatus, setGuessStatus] = useState({
        isMapGuessed: false,
        isAreaGuessed: false,
        isScreenGuessed: false
    })

    const [wrongGuesses, setWrongGuesses] = useState({
        map: 0,
        area: 0,
        screen: 0
    })

    function incrementMistake(property) {
        setWrongGuesses(prevState => ({
            ...prevState,
            [property]: prevState[property] + 1
        }));

        setMistakeCount(mistakeCount + 1);
    }

    return (
        <>
            <ScreenImage mistakeCount={mistakeCount} guessStatus={guessStatus} />

            <div style={{ display: "flex" }}>
                <Paper variant="outline" sx={{ padding: "0.7rem", borderTopLeftRadius: 0, borderTopRightRadius: 0, marginBottom: "0.5rem" }}>
                    <p style={{ margin: 0, fontSize: "20px", color: guessStatus.isScreenGuessed ? Utils.gradientColor(mistakeCount) : "white" }}>Mistakes: {mistakeCount}</p>
                </Paper>

                <ShareButton wrongGuesses={wrongGuesses} mistakeCount={mistakeCount} guessStatus={guessStatus} />
            </div>

            <Grid2 container spacing={2} sx={{ maxWidth: "35rem" }}>
                <Grid2 size={12}>
                    <MapGuess incrementMistake={incrementMistake} setGuessStatus={setGuessStatus} />
                </Grid2>
                <Grid2 size={6}>
                    <AreaGuess incrementMistake={incrementMistake} guessStatus={guessStatus} setGuessStatus={setGuessStatus} />
                </Grid2>
                <Grid2 size={6}>
                    <ScreenNumberGuess incrementMistake={incrementMistake} guessStatus={guessStatus} setGuessStatus={setGuessStatus} />
                </Grid2>
            </Grid2>
        </>
    );
}

export default MainGuessArea;