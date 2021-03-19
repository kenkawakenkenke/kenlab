
export function map(v, fromMin, fromMax, toMin = 0, toMax = 1, clamp = false) {
    if (fromMin > fromMax) {
        let t = fromMax;
        fromMax = fromMin;
        fromMin = t;

        t = toMax;
        toMax = toMin;
        toMin = t;
    }

    const p = (v - fromMin) / (fromMax - fromMin);
    let mapped = toMin + p * (toMax - toMin);
    if (clamp) {
        mapped = Math.max(mapped, Math.min(toMin, toMax));
        mapped = Math.min(mapped, Math.max(toMin, toMax));
    }
    return mapped;
}
