import { useEffect, useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Slider, Typography } from "@material-ui/core";
import moment from "moment-timezone";
import { LocalDiningOutlined } from "@material-ui/icons";

import { clockFeatures } from "./features.js";

const useStyles = makeStyles((theme) => ({
    difficultySliderRoot: {
        // backgroundColor: "red",
        height: "100%",
    },
    difficultySlider: {
        "& .MuiSlider-markLabel": {
            opacity: "0%",
        }
    },
    difficultySliderActive: {
        "& .MuiSlider-markLabel": {
            opacity: "100%",
            backgroundColor: "#fafafaaa",
            // backgroundColor: "red",
        }
    }
}));

function DifficultySlider({ difficultyCallback }) {
    const classes = useStyles();

    const subticksPerFeature = 10;
    const allTicks = (clockFeatures.length - 1) * subticksPerFeature;
    const [difficulty, setDifficulty] = useState(allTicks);

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

    const marks = clockFeatures.map((feature, idx) => ({
        value: (clockFeatures.length - 1 - idx) * subticksPerFeature,
        // label: feature.id + " " + feature.displayName + visibilityForFeature[feature.id],
        label: feature.displayName,
    }));

    return <div className={classes.difficultySliderRoot}>
        <Typography id="slider-difficulty" gutterBottom>
            難易度
            </Typography>
        <Slider
            className={sliderEditing ? classes.difficultySliderActive : classes.difficultySlider}
            orientation="vertical"
            value={difficulty * allTicks}
            // valueLabelDisplay="auto"
            // valueLabelFormat={currentFeature.displayName}
            min={0}
            max={allTicks}
            marks={marks}
            onChange={(e, newValue) => {
                setDifficulty(newValue / allTicks);
                setSliderEditing(true);
            }}
            onChangeCommitted={() => {
                setSliderEditing(false);
            }}
            aria-labelledby="slider-difficulty"
        />
    </div>;
}
export default DifficultySlider;
