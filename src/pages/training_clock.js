import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import DifficultySlider from "../trainingclock/difficulty_slider.js";
import Clock from "../trainingclock/clock.js";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        display: "flex",
    },
    canvasParent: {
        maxWidth: "100%",
        maxHeight: "100%",
    },
    controlContainer: {
        width: "100px",
        height: "80%",
        padding: "14px",
    },
}));

function TrainingClock() {
    const classes = useStyles();
    const [featureVisibility, setFeatureVisibility] = useState({});
    return <div className={classes.root}>
        <div className={classes.controlContainer}>
            <DifficultySlider difficultyCallback={setFeatureVisibility} />
        </div>
        <Clock className={classes.canvasParent} featureVisibility={featureVisibility} />
    </div>
};
TrainingClock.path = "trainingclock";
TrainingClock.title = "れんしゅうどけい";
export default TrainingClock;
