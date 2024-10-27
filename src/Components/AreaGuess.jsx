import React from "react";
import { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import MapsJSON from '../mapsStructure.json';
import { ScreenRoll } from "../ScreenRoll";
import { Paper, Stack } from "@mui/material";
import { Button } from "@mui/material";


const roll = ScreenRoll();
const mapIndex = roll.mapIndex;
const initialAreas = MapsJSON.Maps[mapIndex].Areas.map(area => area.AreaName);

const AreaGuess = ({ decreaseZoom, isMapGuessed, setIsAreaGuessed }) => {
    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [guessedAreas, setGuessedAreas] = useState([]);
    const [areaNames, setAreaNames] = useState(initialAreas);
    const [isGuessed, setIsGuessed] = useState(false);
    const [disableButton, setDisableButton] = useState(true);

    useEffect(() => {
        if(value == null){
            setDisableButton(true);
        }else{
            setDisableButton(false);
        }
    }, [value,inputValue])
    

    const lock = () => {
        if (!isMapGuessed) {
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

    function guess() {
        if (value == roll.areaName) {
            setGuessedAreas(oldAreas => [...oldAreas, {
                name: value,
                isCorrect: true
            }]);

            setDisableButton(true);
            setIsGuessed(true);
            setIsAreaGuessed(true);
        } else {
            setAreaNames(areaNames.filter(area => area != value));
            setGuessedAreas(oldAreas => [...oldAreas, {
                name: value,
                isCorrect: false
            }]);
            setValue(null);
            decreaseZoom();
        }
    }

    return (
        <Paper sx={{
            padding: 2,
            textAlign: "center",
            position: "relative",
            ...lock()
        }}
            variant="outlined" >
            <Autocomplete

                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                options={areaNames}
                disabled={isGuessed}
                renderInput={(params) => <TextField {...params}
                    label="Area"
                    size="small"
                    sx={{
                        "& .MuiInputBase-root": {
                            fontFamily: "JKFontBold",
                        },
                        "& .MuiInputLabel-root": {
                            fontFamily: "JKFontBold",
                        },
                    }}
                    variant="outlined" />}
            />
            <Button onClick={guess} disabled={disableButton} variant="contained" size="small" sx={{ marginTop: 0.5, fontFamily: "JKFontMini", fontSize: "20px", padding: "0" }} fullWidth>Guess</Button>

            <Stack spacing={0.5} sx={{ marginTop: 1 }} alignItems="center" >
                {guessedAreas.map(area => {
                    return (
                        <Paper sx={{
                            width: "100%",
                            textAlign: "center",
                            padding: 0.5,
                            backgroundColor: area.isCorrect ? "#85e376" : '#e37d76',
                            color: area.isCorrect ? "#11910f" : "#91170f"
                        }}
                            key={area.name}>
                            {area.name}</Paper>
                    )
                })}
            </Stack>
        </Paper >
    )
}

export default AreaGuess;