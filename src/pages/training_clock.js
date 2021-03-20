import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import DifficultySlider from "../trainingclock/difficulty_slider.js";
import Clock from "../trainingclock/clock.js";
import AboutDialog from "../trainingclock/about.js";
import TimeSelector from "../trainingclock/timeselector.js";
import { Helmet } from "react-helmet";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import i18n from "../framework/i18n_setup.js";
import { useTranslation } from "react-i18next";

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
        // backgroundColor: "blue",
        maxWidth: "100%",
        maxHeight: "100%",
    },
    sliders: {
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "auto",

        display: "flex",
        flexFlow: "row",
    },
    controlContainer: {
        display: "flex",
        flexFlow: "column",
    },
    languageSelectorRoot: {
        marginBottom: "8px",
        flexGrow: "0",
        flexShrink: "1",
        flexBasis: "auto",
    },
    anotherDiv: {
        flexGrow: "0",
        flexShrink: "1",
        flexBasis: "20px",
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
    const { t } = useTranslation();
    const [featureVisibility, setFeatureVisibility] = useState({});
    const [forcedTime, setForcedTime] = useState(720);
    const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
    return <div className={classes.root}>
        <Helmet>
            <title>れんしゅうどけい</title>
        </Helmet>

        <div className={classes.controlContainer}>
            <LanguageSelector />
            <DifficultySlider difficultyCallback={setFeatureVisibility} />
            <TimeSelector className={classes.timeSelector}
                forcedTime={forcedTime}
                setForcedTimeCallback={setForcedTime}
            />
            <Button variant="outlined" color="primary" size="small" onClick={() => setAboutDialogOpen(true)}>
                {t("About")}
            </Button>
            <AboutDialog open={aboutDialogOpen} onClose={() => setAboutDialogOpen(false)} />
        </div>
        <Clock className={classes.canvasParent}
            featureVisibility={featureVisibility}
            forcedTime={forcedTime} />
    </div >
};
TrainingClock.path = "trainingclock";
TrainingClock.title = "れんしゅうどけい";
export default TrainingClock;
