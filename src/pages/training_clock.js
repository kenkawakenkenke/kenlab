import { useEffect, useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Slider, Typography } from "@material-ui/core";
import moment from "moment-timezone";
import { LocalDiningOutlined } from "@material-ui/icons";

import DifficultySlider from "../trainingclock/difficulty_slider.js";
import Clock from "../trainingclock/clock.js";
import { clockFeatures } from "../trainingclock/features.js";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        // marginTop: "18px",
        display: "flex",
        // maxHeight: "100%",
    },
    canvasParent: {
        maxWidth: "100%",
        maxHeight: "100%",
        // width: "480px",
        // height: "480px",
        // backgroundColor: "red",
    },
    controlContainer: {
        // backgroundColor: "red",
        // width: "80%",
        // height: "100%",
        width: "100px",
        height: "80%",
        padding: "14px",
        // paddingLeft: "30px",
        // paddingRight: "30px",
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
