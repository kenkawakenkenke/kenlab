
export function avgPosition(position1, position2, mix2 = 0.5) {
    return {
        x: (position1.x * (1 - mix2) + position2.x * mix2),
        y: (position1.y * (1 - mix2) + position2.y * mix2),
    };
}
export function distBetween(position1, position2) {
    return Math.sqrt(Math.pow(position1.x - position2.x, 2) + Math.pow(position1.y - position2.y, 2));
}
export function extendPosition(penultimate, last, extension) {
    return {
        x: penultimate.x + (last.x - penultimate.x) * (1 + extension),
        y: penultimate.y + (last.y - penultimate.y) * (1 + extension),
    };
}

export function drawCircle(ctx, point, radius, fillColor = "black") {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
    // ctx.strokeText(text, wrist.position.x, wrist.position.y);
    ctx.fillStyle = fillColor;
    ctx.fill();
}
export function drawLines(ctx, points, width, style = "black") {
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
export function drawLine(ctx, fromPoint, toPoint, width, style = "black") {
    ctx.beginPath();
    ctx.moveTo(fromPoint.x, fromPoint.y);
    ctx.lineTo(toPoint.x, toPoint.y);
    ctx.strokeStyle = style;
    ctx.lineWidth = width;
    ctx.stroke();
}

export function computeTextMetrics(ctx, text, font) {
    ctx.font = font;
    const metrics = ctx.measureText(text);

    const boundTop = metrics.actualBoundingBoxAscent;
    const boundBottom = metrics.actualBoundingBoxDescent;

    const boundLeft = metrics.actualBoundingBoxLeft;
    const boundRight = metrics.actualBoundingBoxRight;

    const width = (boundRight + boundLeft);
    const height = (boundTop + boundBottom);

    return {
        width,
        height,
        boundTop,
        boundBottom,
        boundLeft,
        boundRight,
    };
}

export function positionForRatio(radius, middle, ratio) {
    return {
        x: middle.x + radius * Math.sin(ratio * 2 * Math.PI),
        y: middle.y - radius * Math.cos(ratio * 2 * Math.PI),
    };
}

export function arcBetweenRatios(ctx, radius, middle, fromRatio, toRatio) {
    const beginPoint = positionForRatio(radius, middle, fromRatio);
    ctx.beginPath();
    ctx.moveTo(beginPoint.x, beginPoint.y);
    ctx.arc(middle.x, middle.y, radius,
        (fromRatio - 0.25) * 2 * Math.PI,
        (toRatio - 0.25) * 2 * Math.PI
    );
    ctx.stroke();
}

export class Font {
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

export class StyledText {
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
