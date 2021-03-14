import { useState } from "react";
import {
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
    dice: {
        display: "flex",
    },
    diceCard: {
        border: "solid 2px lightgray",
        borderRadius: "8px",
        margin: "8px",
        width: "200px",
        height: "200px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
    },
    diceNumber: {
        fontSize: "8em",
        width: "100%",
    },
    rollButton: {
        margin: "8px",
        width: "424px",
        height: "200px",
    }
}));

function TwoDice() {
    const classes = useStyles();
    const [dice, setDice] = useState([1, 1]);
    const [rollEta, setRollEta] = useState(0);

    useEffect(() => {
        if (rollEta === 0) {
            return;
        }
        setTimeout(() => {
            setRollEta(rollEta - 1);
            const diceCounts = [];
            for (let i = 0; i < 2; i++) {
                diceCounts.push(1 + Math.floor(Math.random() * 6));
            }
            setDice(diceCounts);
        }, 30);
    }, [rollEta]);

    function roll() {
        setRollEta(20);
    }

    return <div>
        サイコロころころ
        <div className={classes.dice}>
            {dice.map((die, index) => <div key={`dice_${index}`} className={classes.diceCard}>
                <div className={classes.diceNumber} >
                    {die}
                </div>
            </div>)}
        </div>
        <Button variant="contained" color="primary" onClick={roll}
            className={classes.rollButton}
        >サイコロをころがす</Button>
    </div >;
}
export default TwoDice;
