import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import DifficultySlider from "../trainingclock/difficulty_slider.js";
import Clock from "../trainingclock/clock.js";
import { Helmet } from "react-helmet";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import i18n from "../framework/i18n_setup.js";

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
    languageSelectorRoot: {
        marginBottom: "8px",
    }
}));

function LanguageSelector() {
    const classes = useStyles();
    const [language, setLanguage] = useState(i18n.language);
    return <div className={classes.languageSelectorRoot}>
        <Select
            value={language}
            onChange={(e) => {
                setLanguage(e.target.value);
                i18n.changeLanguage(e.target.value);
            }}        >
            <MenuItem value={"ja"}>日本語</MenuItem>
            <MenuItem value={"en"}>English</MenuItem>
        </Select>
    </div>
}

function TrainingClock() {
    const classes = useStyles();
    const [featureVisibility, setFeatureVisibility] = useState({});
    return <div className={classes.root}>
        <Helmet>
            <title>れんしゅうどけい</title>
        </Helmet>
        <div className={classes.controlContainer}>
            <LanguageSelector />
            <DifficultySlider difficultyCallback={setFeatureVisibility} />
        </div>
        <Clock className={classes.canvasParent} featureVisibility={featureVisibility} />
    </div>
};
TrainingClock.path = "trainingclock";
TrainingClock.title = "れんしゅうどけい";
export default TrainingClock;
