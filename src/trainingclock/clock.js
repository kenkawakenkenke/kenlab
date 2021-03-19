import { useEffect, useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button, Slider, Typography } from "@material-ui/core";
import moment from "moment-timezone";
import { LocalDiningOutlined } from "@material-ui/icons";

import DifficultySlider from "../trainingclock/difficulty_slider.js";
import { clockFeatures } from "../trainingclock/features.js";
import { Color } from "../common/colorutil.js";
import * as MathUtil from "../common/mathutil.js";

const useStyles = makeStyles((theme) => ({
    // root: {
    //     width: "80%",
    //     height: "50%",
    //     // backgroundColor: "red",
    // },
    canvas: {
        maxWidth: "100%",
        maxHeight: "100%",
    },
    gifContainer: {
        display: "flex",
        flexFlow: "row wrap",
    },
    gif: {
        maxWidth: "120px",
        maxHeight: "120px",
    },
    controlContainer: {
        // backgroundColor: "red",
        // width: "80%",
        // height: "100%",
        padding: "14px",
        // paddingLeft: "30px",
        // paddingRight: "30px",
    },
    difficultySliderRoot: {
        // backgroundColor: "red",
        height: "100%",
    },
    difficultySlider: {
        "& .MuiSlider-markLabel": {
            opacity: "0%",
            // backgroundColor: "red",
        }
    },
    difficultySliderActive: {
        "& .MuiSlider-markLabel": {
            opacity: "1000%",
            // backgroundColor: "red",
        }
    }
}));

function avgPosition(position1, position2, mix2 = 0.5) {
    return {
        x: (position1.x * (1 - mix2) + position2.x * mix2),
        y: (position1.y * (1 - mix2) + position2.y * mix2),
    };
}
function distBetween(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
}
function extendPosition(penultimate, last, extension) {
    return {
        x: penultimate.x + (last.x - penultimate.x) * (1 + extension),
        y: penultimate.y + (last.y - penultimate.y) * (1 + extension),
    };
}

function drawCircle(ctx, point, radius, fillColor = "black") {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    // ctx.strokeText(text, wrist.position.x, wrist.position.y);
    ctx.fillStyle = fillColor;
    ctx.fill();
}
function drawLines(ctx, points, width, style = "black") {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.stroke();
}
function drawLine(ctx, fromPoint, toPoint, width, style = "black") {
    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.stroke();
}
function drawText(ctx, point, text, fillColor = "black") {
    ctx.fillStyle = fillColor;
    ctx.fillText(text, point.x, point.y);
}

function computeTextRadius(ctx, text) {
    const metrics = ctx.measureText(text);
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;

    const left = metrics.actualBoundingBoxLeft;
    const right = metrics.actualBoundingBoxRight;

    const physicalWidth = (right + left);
    const physicalHeight = (ascent + descent);
    // console.log("==", text, physicalWidth, physicalHeight);
    // return Math.max(physicalWidth / 2, physicalHeight / 2);
    return Math.sqrt(Math.pow(physicalWidth / 2, 2) + Math.pow(physicalHeight / 2, 2));
}

function computeTextMetrics(ctx, text, font) {
    ctx.font = font;
    const metrics = ctx.measureText(text);

    const boundTop = metrics.actualBoundingBoxAscent;
    const boundBottom = metrics.actualBoundingBoxDescent;
    // const boundTop = metrics.fontBoundingBoxAscent;
    // const boundBottom = metrics.fontBoundingBoxDescent;

    const boundLeft = metrics.actualBoundingBoxLeft;
    const boundRight = metrics.actualBoundingBoxRight;

    const width = (boundRight + boundLeft);
    const height = (boundTop + boundBottom);

    // const physicalLeft = point.x - boundLeft;
    // const physicalRight = point.x + boundRight;
    // const physicalTop = point.y - boundTop;
    // const physicalBottom = point.y + boundBottom;
    // const physicalCenterX = (boundLeft + boundRight) / 2;
    // const physicalCenterY = (boundTop + boundBottom) / 2;

    return {
        width,
        height,
        boundTop,
        boundBottom,
        boundLeft,
        boundRight,
    };
}
function drawTextCenteredAt(ctx, point, text, fillColor = "black") {
    ctx.fillStyle = fillColor;
    const metrics = ctx.measureText(text);

    // const ascent = metrics.actualBoundingBoxAscent;
    // const descent = metrics.actualBoundingBoxDescent;
    const ascent = metrics.fontBoundingBoxAscent;
    const descent = metrics.fontBoundingBoxDescent;

    const left = metrics.actualBoundingBoxLeft;
    const right = metrics.actualBoundingBoxRight;

    const physicalWidth = (right + left);
    const physicalHeight = (ascent + descent);

    const physicalLeft = point.x - left;
    const physicalRight = point.x + right;
    const physicalTop = point.y - ascent;
    const physicalBottom = point.y + descent;
    const physicalCenterX = (physicalLeft + physicalRight) / 2;
    const physicalCenterY = (physicalTop + physicalBottom) / 2;

    const x = point.x - (physicalCenterX - point.x);
    const y = point.y - (physicalCenterY - point.y);

    // ctx.fillText(text, point.x, point.y);
    // ctx.strokeRect(
    //     point.x - left,
    //     point.y - ascent,
    //     left + right,
    //     descent + ascent
    // );

    ctx.fillText(text, x, y);
    // ctx.strokeRect(
    //     point.x - physicalWidth / 2,
    //     point.y - physicalHeight / 2,
    //     // x, y,
    //     physicalWidth,
    //     physicalHeight
    // );
    return { x, y };
}

function positionForRatio(radius, middle, ratio) {
    return {
        x: middle.x + radius * Math.sin(ratio * 2 * Math.PI),
        y: middle.y - radius * Math.cos(ratio * 2 * Math.PI),
    };
}

function arcBetweenRatios(ctx, radius, middle, fromRatio, toRatio) {
    const beginPoint = positionForRatio(radius, middle, fromRatio);
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.arc(middle.x, middle.y, radius,
        (fromRatio - 0.25) * 2 * Math.PI,
        (toRatio - 0.25) * 2 * Math.PI
    );
    ctx.stroke();
}

class Font {
    constructor(size = 12, name = "Arial") {
        this.size = size;
        this.name = name;
    }
    setSize(size) {
        return new Font(size, this.name);
    }
    setName(name) {
        return new Font(this.size, name);
    }
    get() {
        return `${this.size}px ${this.name}`;
    }
}
class StyledText {
    constructor() {
        this.elements = [];
        this.spacing = 20;
    }
    add(text, color, font, weight) {
        if (weight === 0) {
            return this;
        }
        this.elements.push({
            text, color, font,
            weight
        });
        return this;
    }
    computeMetrics(ctx) {
        const metrics =
            this.elements.map(element => computeTextMetrics(ctx, element.text, element.font));
        const width = metrics.reduce((accum, c) => accum + c.width, 0) + this.spacing * (this.elements.length - 1);
        const maxBottom = metrics.map(c => c.boundBottom).reduce((accum, c) => Math.max(accum, c), metrics[0].boundBottom);
        const maxTop = metrics.map(c => c.boundTop).reduce((accum, c) => Math.max(accum, c), metrics[0].boundTop);
        const boundHeight = maxBottom + maxTop;

        // Relative to [0,0].
        const xs = [];
        {
            let x = - width / 2;
            for (let i = 0; i < this.elements.length; i++) {
                const metric = metrics[i];
                const centerX = x + metric.width / 2;
                xs.push(centerX);

                x += metrics[i].width + this.spacing;
            }
        }

        const sumWeight = this.elements.reduce((accum, c) => accum + c.weight, 0);
        if (sumWeight === 0) {
            // Nothing to draw!
            return;
        }
        const weightedCenter =
            xs.map((centerX, i) => centerX * this.elements[i].weight)
                .reduce((accum, c) => accum + c, 0)
            / sumWeight;

        return {
            width: width,
            height: boundHeight,
            top: maxTop,
            bottom: maxBottom,
            metrics,
            xs,
            sumWeight,
            weightedCenter,
        }
    }
    radius(ctx) {
        const { width, height, weightedCenter } = this.computeMetrics(ctx);
        // console.log(weightedCenter, width / 2, Math.min(weightedCenter - (-width / 2), width / 2 - weightedCenter),
        //     Math.sqrt(Math.pow(width / 2, 2), Math.pow(height / 2, 2))
        // );
        // return Math.sqrt(Math.pow(width / 2, 2), Math.pow(height / 2, 2));
        return Math.min(weightedCenter - (-width / 2), width / 2 - weightedCenter);
    }
    drawCenteredAt(ctx, position) {
        const {
            metrics,
            width,
            height,
            top,
            bottom,
            xs,
            sumWeight,
            weightedCenter,
        } = this.computeMetrics(ctx);

        if (sumWeight === 0) {
            // Nothing to draw!
            return;
        }

        let yBaseline = position.y + (top - bottom) / 2;
        // let yBaseline = position.y;
        for (let i = 0; i < this.elements.length; i++) {
            const metric = metrics[i];
            const element = this.elements[i];
            const centerX = -weightedCenter + position.x + xs[i];

            ctx.font = element.font;
            ctx.fillStyle = "#" + element.color.setAlpha(element.weight * element.color.a).toStringRGBA();

            ctx.fillText(element.text, centerX - metric.width / 2 + metric.boundLeft, yBaseline);
            // drawCircle(ctx, { x: centerX, y: position.y }, 15, "blue");

            // ctx.lineWidth = 1;
            // ctx.strokeStyle = "#" + element.color.setAlpha(element.weight * 255).toStringRGBA();
            // ctx.strokeRect(
            //     centerX - metric.width / 2,
            //     yBaseline - metric.boundTop,
            //     metric.width,
            //     metric.height
            // );
        }
        // drawCircle(ctx, position, 2, "red");
        // ctx.strokeStyle = "green";
        // ctx.strokeRect(
        //     // position.x - metrics[0].boundLeft,
        //     position.x - width / 2,
        //     position.y - height / 2,
        //     width,
        //     height
        // );
    }
}

function Clock({ className, featureVisibility }) {
    const classes = useStyles();
    const canvasRef = useRef();

    const animationRef = useRef();
    useEffect(() => {
        if (!canvasRef.current) {
            console.log("canvas is undefined");
            return;
        }
        const canvasWidth = canvasRef.current.width;
        const canvasHeight = canvasRef.current.height;
        const ctx = canvasRef.current.getContext("2d");

        let now = moment().tz("Asia/Tokyo");
        function doDraw() {
            // console.log("====");
            // Object.entries(featureVisibility).forEach(([id, v]) => console.log(id, v));
            const now = moment().tz("Asia/Tokyo");
            // now.add(-18, "minutes");
            // now.add(6, "seconds");
            // now.get()

            // 1~12
            const hours = (now.get("hours") % 12 === 0 ? 0 : now.get("hours") % 12);
            // 0~59
            const minutes = now.get("minutes");
            // 0~59
            const seconds = now.get("seconds");

            const minutesAngle = minutes / 60 + seconds / 60 / 60;
            const hoursAngle = hours / 12 + minutes / 60 / 12 + seconds / 60 / 60 / 12;

            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // ctx.fillStyle = "#ffdddd";
            // ctx.fillRect(0, 0, canvasWidth, canvasHeight);

            // drawCircle(ctx, middle, 100, "green");

            const baseDullColor = new Color(10, 10, 10);
            const baseHourColor = new Color(255, 0, 0);
            const baseMinuteColor = new Color(0, 0, 255);
            const baseSecondColor = new Color(0, 0, 0);
            const baseTickColor = new Color(0, 0, 0);

            const secondColor =
                baseSecondColor.setAlpha(255 * (1 - featureVisibility.hideSecondsHand));
            const hourColor =
                Color.average(baseHourColor, baseDullColor, 1 - featureVisibility.colors);
            const minuteColor =
                Color.average(baseMinuteColor, baseDullColor, 1 - featureVisibility.colors);

            const normalHourFont = new Font(80, "Arial");
            const largeHourFont = new Font(100, "Arial");
            const normalMinuteFont = new Font(30, "Arial");
            const largeMinuteFont = new Font(80, "Arial");

            const hourSuffixFont = new Font(80, "Arial");
            const minuteSuffixFont = new Font(60, "Arial");

            // Text
            let clockBottom = canvasHeight;
            if (featureVisibility.showText > 0) {
                const font = largeHourFont;
                const text = new StyledText()
                    .add(`${hours}じ`, hourColor, font.get(), featureVisibility.showText)
                    .add(`${minutes}ふん`, minuteColor, font.get(), featureVisibility.showText)
                    ;
                const { height } = text.computeMetrics(ctx);
                text.drawCenteredAt(ctx, { x: canvasWidth / 2, y: canvasHeight - height / 2 - 10 });
                clockBottom = canvasHeight - height * featureVisibility.showText;
            }

            const middle = { x: canvasWidth / 2, y: clockBottom / 2 };
            const clockRadius = Math.min(middle.x, middle.y) * 0.95;

            const furtherTickRadius = clockRadius * 0.9;
            const nearerTickRadiusLong = furtherTickRadius * 0.85;
            const nearerTickRadiusShort = furtherTickRadius * 0.9;

            const hourHandRadius = nearerTickRadiusLong * 0.5;
            const minuteHandRadius = furtherTickRadius * 0.90;
            const secondHandRadius = furtherTickRadius;

            const hourTextRadius = nearerTickRadiusLong * 0.9;
            const minuteTextRadius = furtherTickRadius * 1.05;

            drawCircle(ctx, middle, clockRadius, "#fafafa");

            // Hour numbers
            {
                for (let h = 1; h <= 12; h++) {
                    if ((h % 12) === hours) {
                        continue;
                    }
                    const text = new StyledText();
                    let color = hourColor;
                    if (featureVisibility.highlightCurrentTimeNumber > 0) {
                        color = hourColor.setAlpha(
                            MathUtil.map(featureVisibility.highlightCurrentTimeNumber,
                                1, 0,
                                160, 255)
                        );
                    } else {
                        color = hourColor.setAlpha(255 * featureVisibility.showHours);
                    }
                    text.add(h, color, normalHourFont.get(), 1);
                    const textRadius = text.radius(ctx);
                    const pointOnRadius = positionForRatio(hourTextRadius, middle, h / 12);
                    text.drawCenteredAt(ctx, pointOnRadius);
                }
            }
            // Current hour
            if (featureVisibility.showHours > 0) {
                const font = normalHourFont.setSize(
                    MathUtil.map(featureVisibility.highlightCurrentTimeNumber,
                        1, 0,
                        largeHourFont.size, normalHourFont.size));

                const color = hourColor.setAlpha(255 * featureVisibility.showHours);
                const text = new StyledText()
                    .add(hours, color, font.get(), 1)
                    .add("じ", color, hourSuffixFont.get(), featureVisibility.timeOnHand);
                const radius = text.radius(ctx);

                const pointOnNeedle = positionForRatio(hourHandRadius + radius, middle, hoursAngle);
                const pointOnRadius = positionForRatio(hourTextRadius, middle, hours / 12);
                const point = avgPosition(pointOnNeedle, pointOnRadius, 1 - featureVisibility.numberOnHand);
                text.drawCenteredAt(ctx, point);
            }

            // Minute numbers
            {
                for (let m = 0; m < 60; m++) {
                    if (m === minutes && featureVisibility.highlightCurrentTimeNumber > 0) {
                        continue;
                    }
                    const text = new StyledText();
                    let color = minuteColor;
                    if (featureVisibility.highlightCurrentTimeNumber > 0) {
                        color = minuteColor.setAlpha(
                            MathUtil.map(featureVisibility.highlightCurrentTimeNumber,
                                1, 0,
                                160, 255)
                        );
                    } else if (m % 5 !== 0) {
                        color = minuteColor.setAlpha(
                            MathUtil.map(featureVisibility.showAllNumbers,
                                1, 0,
                                255, 0
                            )
                        );
                    } else {
                        color = minuteColor.setAlpha(
                            MathUtil.map(featureVisibility.showNumbersEvery5Minutes,
                                1, 0,
                                255, 0
                            )
                        );
                    }
                    text.add(m, color, normalMinuteFont.get(), 1);
                    // const textRadius = text.radius(ctx);
                    const pointOnRadius = positionForRatio(minuteTextRadius, middle, m / 60);
                    text.drawCenteredAt(ctx, pointOnRadius);
                }
            }
            // Minute number on hand
            if (featureVisibility.highlightCurrentTimeNumber > 0) {
                const font = normalMinuteFont.setSize(
                    MathUtil.map(featureVisibility.highlightCurrentTimeNumber,
                        1, 0,
                        largeMinuteFont.size, normalMinuteFont.size));
                const text = new StyledText()
                    .add(minutes, minuteColor, font.get(), 1)// featureVisibility.showNumbersEvery5Minutes)
                    .add("ふん", minuteColor, minuteSuffixFont.get(), featureVisibility.timeOnHand);
                const radius = text.radius(ctx);

                const pointOnNeedle = positionForRatio(minuteHandRadius + radius, middle, minutesAngle);
                const pointOnRadius = positionForRatio(minuteTextRadius, middle, minutes / 60);
                const point = avgPosition(pointOnNeedle, pointOnRadius, 1 - featureVisibility.numberOnHand);

                text.drawCenteredAt(ctx, point);
            }

            // Ticks
            for (let m = 1; m <= 60; m++) {
                const hourTick = m % 5 === 0;
                const nearerRadius = hourTick ? nearerTickRadiusLong : nearerTickRadiusShort;
                let color;
                if (hourTick) {
                    color = baseTickColor.setAlpha(featureVisibility.showHourTicks * 255);
                } else {
                    color = baseTickColor.setAlpha(featureVisibility.showMinuteTicks * 255);
                }
                drawLine(ctx,
                    positionForRatio(nearerRadius, middle, m / 60),
                    positionForRatio(furtherTickRadius, middle, m / 60),
                    hourTick ? 3 : 1,
                    "#" + color.toStringRGBA()
                )
            }

            // Range display
            if (featureVisibility.showRange > 0) {
                const preciseHourAngle = hours / 12;
                const nextHourAngle = (hours + 0.95) / 12;

                ctx.strokeStyle = hourColor.setAlpha(255 * 0.5 * featureVisibility.showRange).toStringRGBA("#");
                ctx.lineWidth = 10;
                arcBetweenRatios(ctx, nearerTickRadiusLong, middle,
                    preciseHourAngle, nextHourAngle);

                const preciseMinuteAngle = minutes / 60;
                const nextMinuteAngle = (minutes + 0.95) / 60;

                ctx.strokeStyle = minuteColor.setAlpha(255 * 0.5 * featureVisibility.showRange).toStringRGBA("#");
                ctx.lineWidth = 8;
                arcBetweenRatios(ctx, furtherTickRadius, middle,
                    preciseMinuteAngle, nextMinuteAngle);
            }

            // Hands
            // Second hand
            drawLine(ctx, middle, positionForRatio(secondHandRadius, middle, seconds / 60), 2,
                "#" + secondColor.toStringRGBA());
            // Minute hand
            drawLine(ctx, middle, positionForRatio(minuteHandRadius, middle, minutesAngle), 5,
                "#" + minuteColor.toStringRGBA());
            // Hour hand
            drawLine(ctx, middle, positionForRatio(hourHandRadius, middle, hoursAngle), 8,
                "#" + hourColor.toStringRGBA());

            // animationRef.current = setTimeout(doDraw, 400);
            animationRef.current = setTimeout(doDraw, 100);
        }
        doDraw();
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
                animationRef.current = undefined;
            }
        }
    }, [canvasRef.current, featureVisibility]);

    return <div className={className}>
        <canvas
            className={classes.canvas}
            ref={canvasRef}
            width={1280}
            height={1280}>
        </canvas>
    </div>
};
export default Clock;
