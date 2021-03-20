import { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import ToggleButton from '@material-ui/lab/ToggleButton';
import { useTranslation } from 'react-i18next';
import UpdateIcon from '@material-ui/icons/Update';
import { useEffect } from "react";
import { Slider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "auto",

        // As flex parent
        display: "flex",
        flexFlow: "column",
    },
    rootMinimized: {
        // backgroundColor: "red",
        // maxHeight: "80%",
        flexGrow: "0",
        flexShrink: "1",
        flexBasis: "auto",

        // As flex parent
        display: "flex",
        flexFlow: "column",
    },
    enablementToggle: {
        margin: "4px",

        flexGrow: "0",
        flexShrink: "1",
        flexBasis: "auto",
    },
    slider: {
        marginTop: "10px",
        marginBottom: "10px",

        flexGrow: "1",
        flexShrink: "1",
        flexBasis: "auto",
    }
}));

function TimeSelector({ className,
    forcedTime,
    setForcedTimeCallback }) {
    const classes = useStyles();
    const { t } = useTranslation();

    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
        if (!enabled) {
            // Special value to denote realtime control.
            setForcedTimeCallback(-1);
        } else {
            setForcedTimeCallback(10);
        }
    }, [enabled]);

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
            <UpdateIcon />
        </ToggleButton>

        {enabled &&
            < Slider
                className={classes.slider}
                orientation="vertical"
                value={forcedTime}
                min={0}
                max={720}
                onChange={(e, newValue) => {
                    console.log(newValue);
                    setForcedTimeCallback(newValue);
                }}
            />
        }

    </div>;
}
export default TimeSelector;
