const emptyColor = '#e8e8e8'
const undefinedColor = '#a0a4a8'
const minColor = { r: 255, g: 236, b: 25 }
const midColor = { r: 255, g: 152, b: 0 }
const maxColor = { r: 246, g: 65, b: 45 }

export default function getColorGradient(value, min, max, isInverted = false) {
    if (value < min || value > max) return undefinedColor;
    if (value == null || value == undefined) return undefinedColor;
    let color = { r: 0, g: 0, b: 0 };
    let colors = [
        minColor, //green
        midColor, //yellow
        maxColor //red
    ]
    let valueDiff = max - min;
    if (valueDiff == 0) return emptyColor;
    let normalizedValue = value - min;
    if (isInverted) normalizedValue = valueDiff - normalizedValue;
    let percentage = normalizedValue / valueDiff;
    if (percentage <= 0.5) {
        let p = percentage * 2;
        Object.keys(color).forEach(key => {
            color[key] = colors[0][key] + (colors[1][key] - colors[0][key]) * p;
        });
    }
    else {
        let p = (percentage - 0.5) * 2;
        Object.keys(color).forEach(key => {
            color[key] = colors[1][key] + (colors[2][key] - colors[1][key]) * p;
        });
    }
    var h = Math.round(color.r) * 0x10000 + Math.round(color.g) * 0x100 + Math.round(color.b) * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

export { minColor, midColor, maxColor };