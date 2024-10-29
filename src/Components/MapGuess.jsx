import React from "react";
import { useState } from "react";
import MapsJSON from '../mapsStructure.json';
import { ScreenRoll } from "../ScreenRoll";
import { Button } from "@mui/material";
import { Stack } from "@mui/material";
import { Paper } from "@mui/material";

const mapNames = MapsJSON.Maps.map(map => map.MapName);
const roll = ScreenRoll();

const MapGuess = ({ incrementMistake, setGuessStatus }) => {
    const [buttonStates, setButtonStates] = useState({});

    const handleClick = (map) => {
        if (map == roll.mapName) {
            const newButtonStates = {};
            mapNames.forEach(name => {
                newButtonStates[name] = {
                    color: name === roll.mapName ? "success" : "error",
                    customDisable: "true",
                    variant: name === roll.mapName ? "contained" : "outlined"
                };
            });
            setButtonStates(newButtonStates);

            setGuessStatus(prevState => ({
                ...prevState,
                "isMapGuessed": true
            }));

        } else {
            setButtonStates(prevStates => ({
                ...prevStates,
                [map]: {
                    color: "error",
                    variant: "outlined",
                    customDisable: "true"
                }
            }));

            incrementMistake('map');
        }
    };

    return (
        <Paper sx={{ padding: 2, textAlign: "center" }} variant="outlined">
            <Stack spacing={1} direction="row" justifyContent="space-evenly">
                {mapNames.map(map => {
                    return (
                        <div key={map} className="guessMapButton" data-custom-disable={buttonStates[map]?.customDisable || "false"}>
                            <Button
                                variant={buttonStates[map]?.variant || "outlined"}
                                color={buttonStates[map]?.color || "primary"}
                                onClick={() => handleClick(map)}
                                sx={{
                                    fontFamily: 'JKFontBold',
                                    fontSize: '120%'
                                }}
                            >
                                {map}
                            </Button>
                        </div>
                    )
                })}
            </Stack>
        </Paper>
    )
}

export default MapGuess;