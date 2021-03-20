import { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Slider, Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';

import { clockFeatures } from "./features.js";
import ToggleButton from '@material-ui/lab/ToggleButton';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';

const useStyles = makeStyles((theme) => ({
    root: {
        // backgroundColor: "red",
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "auto",

        // As flex parent
        display: "flex",
        flexFlow: "column",
    },
    rootMinimized: {
        // backgroundColor: "red",
        flexGrow: "0",
        flexShrink: "1",
        flexBasis: "auto",

        // As flex parent
        display: "flex",
        flexFlow: "column",
    },
    enablementToggle: {
        margin: "4px",
    },
    difficultySlider: {
        marginTop: "10px",
        marginBottom: "10px",
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "auto",
        "& .MuiSlider-markLabel": {
            opacity: "0%",
        }
    },
    difficultySliderActive: {
        marginTop: "10px",
        marginBottom: "10px",
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "auto",
        "& .MuiSlider-markLabel": {
            opacity: "100%",
            backgroundColor: "#fafafaaa",
            // backgroundColor: "red",
        }
    }
}));

function DifficultySlider({ difficultyCallback }) {
    const classes = useStyles();

    const [enabled, setEnabled] = useState(true);

    const subticksPerFeature = 10;
    const allTicks = (clockFeatures.length - 1) * subticksPerFeature;
    const [difficulty, setDifficulty] = useState(allTicks);
    useEffect(() => {
        const storedDifficulty = localStorage.getItem("difficulty");
        if (storedDifficulty) {
            setDifficulty(storedDifficulty);
        }
        console.log("Load from local storage", storedDifficulty);
    }, []);

    const [sliderEditing, setSliderEditing] = useState(false);
    const currentFeatureIndex = clockFeatures.length - 1 - Math.ceil(difficulty * (clockFeatures.length - 1));
    const visibilityForFeature =
        clockFeatures.map((feature, index) => {
            let visibility;
            if (index === currentFeatureIndex) {
                // console.log(difficulty, difficulty * (clockFeatures.length - 1));
                visibility = (difficulty * (clockFeatures.length - 1) % 1);
                if (visibility === 0) {
                    visibility = 1;
                }
            } else if (index < currentFeatureIndex) {
                visibility = 0;
            } else {
                visibility = 1;
            }
            return {
                id: feature.id,
                visibility,
            }
        })
            .reduce((accum, c) => {
                accum[c.id] = c.visibility;
                return accum
            }, {});
    useEffect(() => {
        difficultyCallback(visibilityForFeature);
    }, [JSON.stringify(visibilityForFeature), difficultyCallback]);

    const { t } = useTranslation();
    const marks = clockFeatures.map((feature, idx) => ({
        value: (clockFeatures.length - 1 - idx) * subticksPerFeature,
        // label: feature.id + " " + feature.displayName + visibilityForFeature[feature.id],
        label: t(feature.displayName),
    }));

    return <div className={enabled ? classes.root : classes.rootMinimized}>
        <ToggleButton
            className={classes.enablementToggle}
            value="check"
            selected={enabled}
            onChange={() => {
                setEnabled(!enabled);
            }}
            size="small"
        >
            <FitnessCenterIcon />
        </ToggleButton>
        {enabled &&
            <Slider
                className={sliderEditing ? classes.difficultySliderActive : classes.difficultySlider}
                orientation="vertical"
                value={difficulty * allTicks}
                min={0}
                max={allTicks}
                marks={marks}
                onChange={(e, newValue) => {
                    const difficulty = newValue / allTicks;
                    setDifficulty(difficulty);
                    localStorage.setItem("difficulty", difficulty);
                    setSliderEditing(true);
                }}
                onChangeCommitted={() => {
                    setSliderEditing(false);
                }}
                aria-labelledby="slider-difficulty"
            />
        }
    </div>;
}
export default DifficultySlider;
