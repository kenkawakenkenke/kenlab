import { Typography, Button, makeStyles, TextField } from "@material-ui/core";
import { useEffect, useRef, useState, PureComponent } from "react";
import {
    LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Scatter,
    ScatterChart,
    ComposedChart,
    Legend,
} from 'recharts';
import moment from "moment-timezone";

const useStyles = makeStyles({
    submitButton: {
        margin: "4px",
    },
    tableCell: {
        padding: "4px",
        // margin: "4px",
        borderRight: "solid 1px gray",
    },
    tableRow: {
        padding: "4px",
        margin: "4px",
        border: "solid 1px gray",
    }
});

function SubmitNumberForm({ title, label, callback }) {
    const classes = useStyles();
    const [value, setValue] = useState("");

    const inputRef = useRef();
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputRef.current]);
    function doSubmit() {
        const intValue = parseInt(value);
        if (!(intValue >= 0)) {
            return;
        }
        callback(intValue);
        setValue("");
    }
    return <div>
        <form onSubmit={e => {
            e.preventDefault();
            doSubmit();
        }}>
            <Typography variant="subtitle2">{title}</Typography>
            <TextField ref={inputRef}
                label={label}
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
            />
            <Button
                className={classes.submitButton}
                onClick={doSubmit}
                variant="outlined">OK</Button>
        </form>
    </div>;
}

function PlotGraph({ points, targetNumber, eta, linRegParams }) {
    const observedData =
        points.map(p => {
            return {
                t: p.t.getTime(),
                rawNumber: p.num,
            };
        });
    const estimatedData =
        eta ?
            points.map(p => ({
                t: linRegParams.estimate(p.num).getTime(),
                estimatedNumber: p.num,
            })) : [];
    const etaData =
        eta ? [{
            t: eta.getTime(),
            estimatedNumber: targetNumber,
        }] : [];
    const data = [].concat(observedData, estimatedData, etaData);

    const minT = data.length === 0 ? 0 : data[0].t;
    const maxT = eta ? eta.getTime() : (data.length === 0 ? new Date().getTime() : data[data.length - 1].t);

    const minV = data.length === 0 ? 0 : data[0].rawNumber;
    const maxV = targetNumber;

    return (
        <ComposedChart
            width={400}
            height={200}
            data={data}
            margin={{
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
            }}
        >
            <CartesianGrid stroke="#f5f5f5" />
            <Tooltip />

            <XAxis
                dataKey="t"
                type="number"
                domain={[minT, maxT]}
                tickFormatter={t => moment(t).format('HH:mm:ss')}
            />
            <YAxis
                type="number"
                label={{ value: "受付番号", angle: -90, position: "insideLeft" }}
                domain={[minV, maxV]}
            />
            <Scatter name="red" dataKey="rawNumber" fill="red" />
            <Line
                dataKey="estimatedNumber"
                stroke="red"
                dot={false}
                activeDot={false}
                legendType="none"
            />
        </ComposedChart>
    );
}

function linReg(points) {
    if (points.length < 2) {
        return undefined;
    }
    const firstT = points[0].t.getTime();

    const n = points.length;
    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumXY = 0;
    let sumYY = 0;
    points.forEach(p => {
        const x = p.num;
        const y = p.t.getTime() - firstT;

        sumX += x;
        sumY += y;
        sumXX += x * x;
        sumXY += x * y;
        sumYY += y * y;
    });
    const intercept = (sumY * sumXX - sumX * sumXY) / (n * sumXX - sumX * sumX) + firstT;
    const grad = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const params = { grad, intercept };
    params.estimate = v => new Date(grad * v + intercept);
    return params;
}

function PreviousPoints({ points, deleteCallback }) {
    const classes = useStyles();

    return <div>
        <Typography variant="subtitle1">いままで呼ばれた番号：</Typography>
        <table>
            <tr classname={classes.tableRow}>
                <th className={classes.tableCell}>受付番号</th>
                <th className={classes.tableCell}>受付時間</th>
                <th className={classes.tableCell}></th>
            </tr>
            {points.map((p, idx) => {
                return <tr classname={classes.tableRow}>
                    <td className={classes.tableCell}>{p.num}</td>
                    <td className={classes.tableCell}>{moment(p.t).format("HH:mm:ss")}</td>
                    <td className={classes.tableCell}>
                        <Button
                            onClick={() => deleteCallback(idx)}
                            variant="outlined"
                            color="secondary"
                        >
                            Delete
                        </Button>
                    </td>
                </tr>;
            })}
        </table>
    </div>;
}

function WhensMyTurn() {
    const classes = useStyles();

    const [myNumber, setMyNumber] = useState();
    const [points, setPoints] = useState([]);

    if (typeof myNumber === "undefined") {
        return <div>
            <Typography variant="h3">自分がいつ呼ばれるか予測するページ</Typography><SubmitNumberForm
                callback={setMyNumber}
                label="あなたの受付番号"
                title="あなたの受付番号を入力してください" />
        </div>;
    }

    function appendPoint(num) {
        setPoints(currentPoints => [
            ...currentPoints,
            {
                num,
                t: new Date(),
            }
        ]);
    }

    const linRegParams = linReg(points);
    const eta = linRegParams && linRegParams.estimate(myNumber);//new Date(linRegParams.grad * myNumber + linRegParams.intercept);

    return <div>
        <Typography variant="h3">自分がいつ呼ばれるか予測するページ</Typography>
        <Typography variant="subtitle1">あなたの受付番号：</Typography>
        <Typography variant="h4">{myNumber}</Typography>

        <SubmitNumberForm
            callback={appendPoint}
            label="呼ばれた受付番号"
            title="いま呼ばれた番号を入力してください：" />

        {eta && <>
            <Typography variant="subtitle1">予想呼び出し時刻：</Typography>
            <Typography variant="h4">
                {eta && moment(eta).format("HH:mm:ss")}
            </Typography>
        </>}

        <PlotGraph points={points}
            targetNumber={myNumber}
            linRegParams={linRegParams}
            eta={eta}
        />
        <PreviousPoints points={points}
            deleteCallback={idx => {
                const newPoints = [].concat(
                    points.slice(0, idx),
                    points.slice(idx + 1)
                );
                setPoints(newPoints);
            }}
        />
    </div>
}

WhensMyTurn.path = "whensmyturn";
WhensMyTurn.title = "自分の受付番号が呼ばれる時間を予測するページ";
export default WhensMyTurn;
