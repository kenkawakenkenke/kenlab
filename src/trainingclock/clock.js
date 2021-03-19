import { useEffect, useRef } from "react";
import { makeStyles } from '@material-ui/core/styles';
import moment from "moment-timezone";

import { Color } from "../common/colorutil.js";
import * as MathUtil from "../common/mathutil.js";
import * as DrawUtil from "../common/drawutil.js";
import i18n from 'i18next';

const useStyles = makeStyles((theme) => ({
    canvas: {
        maxWidth: "100%",
        maxHeight: "100%",
    },
}));

function hourSuffix(hours) {
    if (i18n.language === "ja") {
        return "じ";
    }
    return "h";
}
function minuteSuffix(minutes) {
    if (i18n.language === "ja") {
        if (minutes === 0) {
            return "ふん";
        }
        switch (minutes % 10) {
            case 0:
            case 1:
            case 3:
            case 6:
            case 8:
                return "ぷん";
        }
        return "ふん";
    }
    return "m";
}

function doDraw(ctx, featureVisibility, animationRef, tOverride) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const now = tOverride || moment();

    console.log(i18n.language);
    // 1~12
    const hours = (now.get("hours") % 12 === 0 ? 0 : now.get("hours") % 12);
    // 0~59
    const minutes = now.get("minutes");
    // 0~59
    const seconds = now.get("seconds");

    const minutesAngle = minutes / 60 + seconds / 60 / 60;
    const hoursAngle = hours / 12 + minutes / 60 / 12 + seconds / 60 / 60 / 12;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    const baseDullColor = new Color(10, 10, 10);
    const baseHourColor = new Color(255, 0, 0);
    const baseMinuteColor = new Color(0, 0, 255);
    const baseSecondColor = new Color(0, 0, 0);
    const baseTickColor = new Color(0, 0, 0);

    const secondColor = baseSecondColor;
    const hourColor =
        Color.average(baseHourColor, baseDullColor, 1 - featureVisibility.colors);
    const minuteColor =
        Color.average(baseMinuteColor, baseDullColor, 1 - featureVisibility.colors);

    const normalHourFont = new DrawUtil.Font(80, "Arial");
    const largeHourFont = new DrawUtil.Font(100, "Arial");
    const normalMinuteFont = new DrawUtil.Font(30, "Arial");
    const largeMinuteFont = new DrawUtil.Font(80, "Arial");

    const hourSuffixFont = new DrawUtil.Font(80, "Arial");
    const minuteSuffixFont = new DrawUtil.Font(60, "Arial");

    // Text
    let clockBottom = canvasHeight;
    if (featureVisibility.showText > 0) {
        const font = largeHourFont;
        const text = new DrawUtil.StyledText()
            .add(`${hours}${hourSuffix(hours)}`, hourColor, font.get(), featureVisibility.showText)
            .add(`${minutes}${minuteSuffix(minutes)}`, minuteColor, font.get(), featureVisibility.showText)
            ;
        const { height } = text.computeMetrics(ctx);
        text.drawCenteredAt(ctx, { x: canvasWidth / 2, y: canvasHeight - height / 2 - 10 });
        clockBottom = canvasHeight - height * featureVisibility.showText;
    }

    const middle = { x: canvasWidth / 2, y: clockBottom / 2 };
    const clockRadius = Math.min(middle.x, middle.y) * 0.9;

    const furtherTickRadius = clockRadius * 0.9;
    const nearerTickRadiusLong = furtherTickRadius * 0.85;
    const nearerTickRadiusShort = furtherTickRadius * 0.9;

    const hourHandRadius = nearerTickRadiusLong * 0.5;
    const minuteHandRadius = furtherTickRadius * 0.90;
    const secondHandRadius = furtherTickRadius;

    const hourTextRadius = nearerTickRadiusLong * 0.9;
    const minuteTextRadius = furtherTickRadius * 1.05;

    DrawUtil.drawCircle(ctx, middle, clockRadius, "#fafafa");

    // Hour numbers
    for (let h = 1; h <= 12; h++) {
        if ((h % 12) === hours) {
            continue;
        }
        const text = new DrawUtil.StyledText();
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
        const pointOnRadius = DrawUtil.positionForRatio(hourTextRadius, middle, h / 12);
        text.drawCenteredAt(ctx, pointOnRadius);
    }
    // Current hour
    if (featureVisibility.showHours > 0) {
        const font = normalHourFont.setSize(
            MathUtil.map(featureVisibility.highlightCurrentTimeNumber,
                1, 0,
                largeHourFont.size, normalHourFont.size));

        const color = hourColor.setAlpha(255 * featureVisibility.showHours);
        const text = new DrawUtil.StyledText()
            .add(hours, color, font.get(), 1)
            .add(hourSuffix(hours), color, hourSuffixFont.get(), featureVisibility.timeOnHand);
        const radius = text.radius(ctx);

        const pointOnNeedle = DrawUtil.positionForRatio(hourHandRadius + radius, middle, hoursAngle);
        const pointOnRadius = DrawUtil.positionForRatio(hourTextRadius, middle, hours / 12);
        const point = DrawUtil.avgPosition(pointOnNeedle, pointOnRadius, 1 - featureVisibility.numberOnHand);
        text.drawCenteredAt(ctx, point);
    }

    // Minute numbers
    for (let m = 0; m < 60; m++) {
        if (m === minutes && featureVisibility.highlightCurrentTimeNumber > 0) {
            continue;
        }
        const text = new DrawUtil.StyledText();
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
        const pointOnRadius = DrawUtil.positionForRatio(minuteTextRadius, middle, m / 60);
        text.drawCenteredAt(ctx, pointOnRadius);
    }
    // Minute number on hand
    if (featureVisibility.highlightCurrentTimeNumber > 0) {
        const font = normalMinuteFont.setSize(
            MathUtil.map(featureVisibility.highlightCurrentTimeNumber,
                1, 0,
                largeMinuteFont.size, normalMinuteFont.size));
        const text = new DrawUtil.StyledText()
            .add(minutes, minuteColor, font.get(), 1)
            .add(minuteSuffix(minutes), minuteColor, minuteSuffixFont.get(), featureVisibility.timeOnHand);
        const radius = text.radius(ctx);

        const pointOnNeedle = DrawUtil.positionForRatio(minuteHandRadius + radius, middle, minutesAngle);
        const pointOnRadius = DrawUtil.positionForRatio(minuteTextRadius, middle, minutes / 60);
        const point = DrawUtil.avgPosition(pointOnNeedle, pointOnRadius, 1 - featureVisibility.numberOnHand);

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
        DrawUtil.drawLine(ctx,
            DrawUtil.positionForRatio(nearerRadius, middle, m / 60),
            DrawUtil.positionForRatio(furtherTickRadius, middle, m / 60),
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
        DrawUtil.arcBetweenRatios(ctx, nearerTickRadiusLong, middle,
            preciseHourAngle, nextHourAngle);

        const preciseMinuteAngle = minutes / 60;
        const nextMinuteAngle = (minutes + 0.95) / 60;

        ctx.strokeStyle = minuteColor.setAlpha(255 * 0.5 * featureVisibility.showRange).toStringRGBA("#");
        ctx.lineWidth = 8;
        DrawUtil.arcBetweenRatios(ctx, furtherTickRadius, middle,
            preciseMinuteAngle, nextMinuteAngle);
    }

    // Hands
    // Second hand
    DrawUtil.drawLine(ctx, middle, DrawUtil.positionForRatio(secondHandRadius, middle, seconds / 60), 2,
        "#" + secondColor.setAlpha(255 * (1 - featureVisibility.hideSecondsHand)).toStringRGBA());
    // Minute hand
    DrawUtil.drawLine(ctx, middle, DrawUtil.positionForRatio(minuteHandRadius, middle, minutesAngle), 5,
        "#" + minuteColor.toStringRGBA());
    // Hour hand
    DrawUtil.drawLine(ctx, middle, DrawUtil.positionForRatio(hourHandRadius, middle, hoursAngle), 8,
        "#" + hourColor.toStringRGBA());

    animationRef.current = setTimeout(() =>
        doDraw(ctx, featureVisibility, animationRef, tOverride && tOverride.add("seconds", 25)), 100);
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
        const ctx = canvasRef.current.getContext("2d");
        doDraw(ctx, featureVisibility, animationRef);
        // doDraw(ctx, featureVisibility, animationRef, moment());
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
