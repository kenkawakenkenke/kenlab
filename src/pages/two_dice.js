import { useState } from "react";
import {
    Button,
    FormControlLabel, Checkbox
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
    const [showHistogram, setShowHistogram] = useState(false);
    const [histogram, setHistogram] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const clearHistogram = () => { setHistogram([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) };
    const [countAddition, setCountAddition] = useState(true);
    const [countSubtraction, setCountSubtraction] = useState(true);
    const [countLotsPerClick, setCountLotsPerClick] = useState(false);
    const addToHistogram = (...nums) => {
        const newHistogram = [...histogram];
        nums.forEach(num => newHistogram[num]++);
        setHistogram(newHistogram);
    }

    function roll() {
        const nums = [];
        const numRoll = countLotsPerClick ? 10000 : 1;
        for (let j = 0; j < numRoll; j++) {
            const diceCounts = [];
            for (let i = 0; i < 2; i++) {
                diceCounts.push(1 + Math.floor(Math.random() * 6));
            }
            const numAdd = diceCounts[0] + diceCounts[1];
            const numSubtract = Math.max(diceCounts[0], diceCounts[1]) - Math.min(diceCounts[0], diceCounts[1]);
            if (countAddition) {
                nums.push(numAdd);
            }
            if (countSubtraction) {
                nums.push(numSubtract);
            }
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
            <FormControlLabel
                control={
                    <Checkbox
                        checked={showHistogram}
                        onChange={() => {
                            setShowHistogram(!showHistogram);
                            clearHistogram();
                        }}
                        name="checkedB"
                        color="primary"
                    />
                }
                label="数字が出た回数を数える"
            />
        </div>
        {showHistogram &&
            <div>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={countAddition}
                            onChange={() => {
                                clearHistogram();
                                setCountAddition(!countAddition);
                            }}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="たしざんをかぞえる"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={countSubtraction}
                            onChange={() => {
                                clearHistogram();
                                setCountSubtraction(!countSubtraction);
                            }}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="ひきざんをかぞえる"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={countLotsPerClick}
                            onChange={() => { setCountLotsPerClick(!countLotsPerClick) }}
                            name="checkedB"
                            color="primary"
                        />
                    }
                    label="毎回10000回サイコロをころがす"
                />
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
