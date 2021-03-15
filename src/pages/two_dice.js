import { useState } from "react";
import {
    Button
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { useEffect } from "react";
import { ToggleButton } from "@material-ui/lab";
import CheckIcon from '@material-ui/icons/Check';
import {
    BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

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
    const [showHistogram, setShowHistogram] = useState(false);
    const [histogram, setHistogram] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const addToHistogram = (...nums) => {
        const newHistogram = [...histogram];
        nums.forEach(num => newHistogram[num]++);
        setHistogram(newHistogram);
    }

    function roll() {
        const nums = [];
        for (let j = 0; j < 1; j++) {
            const diceCounts = [];
            for (let i = 0; i < 2; i++) {
                diceCounts.push(1 + Math.floor(Math.random() * 6));
            }
            const numAdd = diceCounts[0] + diceCounts[1];
            const numSubtract = Math.max(diceCounts[0], diceCounts[1]) - Math.min(diceCounts[0], diceCounts[1]);
            nums.push(numAdd);
            nums.push(numSubtract);
            setDice(diceCounts);
        }
        if (showHistogram) {
            addToHistogram(...nums);
        }
    }

    const data = histogram.map((num, index) => ({
        "number": index,
        "count": num,
    }));

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
        <div>
            <ToggleButton value="check"
                selected={showHistogram}
                onChange={() => { setShowHistogram(!showHistogram) }}>
                <CheckIcon />かぞえる
            </ToggleButton>
        </div>
        {showHistogram &&
            <div>
                <ResponsiveContainer width='100%' aspect={4.0 / 1.5}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="number" />
                        <YAxis />
                        <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        }
    </div >;
}
export default TwoDice;
