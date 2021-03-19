
function toHex(num, length) {
    return num.toString(16).toUpperCase().padStart(length, "0");
}
export class Color {
    constructor(r, g, b, a = 255) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    get rgba() {
        return ((this.rgb << 8) | this.a) >>> 0;
    }
    get rgb() {
        return ((this.r << 16)
            | (this.g << 8)
            | (this.b << 0)) >>> 0;
    }
    toStringRGBA(prefix = "") {
        return prefix + toHex(this.rgba, 8);
    }
    toStringRGB(prefix = "") {
        return prefix + toHex(this.rgb, 8);
    }
    setAlpha(alpha) {
        return new Color(this.r, this.g, this.b, alpha);
    }

    static average(color1, color2, mix2) {
        return new Color(
            (color1.r * (1 - mix2) + color2.r * (mix2)),
            (color1.g * (1 - mix2) + color2.g * (mix2)),
            (color1.b * (1 - mix2) + color2.b * (mix2)),
            (color1.a * (1 - mix2) + color2.a * (mix2))
        );
    }

    static fromHSV(h, s, v) {
        var r, g, b, i, f, p, q, t;
        if (arguments.length === 1) {
            s = h.s;
            v = h.v;
            h = h.h;
        }
        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0: r = v;
                g = t;
                b = p; break;
            case 1: r = q;
                g = v;
                b = p; break;
            case 2: r = p;
                g = v;
                b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
            default: break;
        }
        return new Color(
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255));
    }
    static gradBR(v) {
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        // v:0 -> h:2/3
        // v:1 -> h:0
        const h = (1 - v) * 2 / 3;
        return Color.fromHSV(h, 1, 1);
    }
    static gradBW(v) {
        if (v < 0) v = 0;
        if (v > 1) v = 1;
        return Color.fromHSV(0, 0, v);
    }
}
