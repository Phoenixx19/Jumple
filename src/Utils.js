export function gradientColor(value) {
    value = Math.min(Math.max(value, 0), 5);

    const startColor = { r: 0x11, g: 0x91, b: 0x0F };
    const middleColor = { r: 0xF6, g: 0xFA, b: 0x02 };
    const endColor = { r: 0x91, g: 0x17, b: 0x0F };

    let r, g, b;

    if (value <= 2.5) {
        const ratio = value / 2.5;
        r = Math.round(startColor.r + (middleColor.r - startColor.r) * ratio);
        g = Math.round(startColor.g + (middleColor.g - startColor.g) * ratio);
        b = Math.round(startColor.b + (middleColor.b - startColor.b) * ratio);
    } else {
        const ratio = (value - 2.5) / 2.5;
        r = Math.round(middleColor.r + (endColor.r - middleColor.r) * ratio);
        g = Math.round(middleColor.g + (endColor.g - middleColor.g) * ratio);
        b = Math.round(middleColor.b + (endColor.b - middleColor.b) * ratio);
    }
    
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    return hex;
}

export const calculateDimensions = (zoom) => {
    const size = zoom * (4 / 3) * 100;
    const minxvalue = zoom / ((8 * zoom) - 6) * 100;
    const maxxvalue = 100 - minxvalue;
    return { size, minxvalue, maxxvalue };
};

export function zoomScalar(max, zoom) {
    const normalizedZoom = (zoom - 1) / (max - 1);
    const falloffFactor = Math.pow(normalizedZoom, 2);
    return 1 + falloffFactor * (max - 1);
};
