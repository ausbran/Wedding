import { nav } from './globals.js';

export function logoColor() {
    const svgElement = nav.querySelector('svg.nav-svg');
    const backgroundElement = document.querySelector('.background .active img, .carousel .carousel-item.active img, .carousel .carousel-item.active video');
    if (!svgElement || !backgroundElement) return;

    const logoPosition = svgElement.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = backgroundElement.videoWidth || backgroundElement.naturalWidth || backgroundElement.clientWidth;
    canvas.height = backgroundElement.videoHeight || backgroundElement.naturalHeight || backgroundElement.clientHeight;

    if (backgroundElement.tagName.toLowerCase() === 'img' && !backgroundElement.complete) {
        backgroundElement.addEventListener('load', logoColor);
        return;
    }
    if (backgroundElement.tagName.toLowerCase() === 'video' && backgroundElement.readyState < 3) {
        backgroundElement.addEventListener('loadeddata', () => setTimeout(logoColor, 100));
        return;
    }

    context.drawImage(backgroundElement, 0, 0, canvas.width, canvas.height);

    const xStart = Math.floor(logoPosition.left);
    const yStart = Math.floor(logoPosition.top);
    const width = Math.floor(logoPosition.width);
    const height = Math.floor(logoPosition.height);

    const imageData = context.getImageData(xStart, yStart, width, height);
    const data = imageData.data;
    let totalLuminance = 0;
    const pixelCount = width * height;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        totalLuminance += luminance;
    }

    const averageLuminance = totalLuminance / pixelCount;
    const color = averageLuminance < 140 ? '#ffffff' : '#555555';
    svgElement.querySelector('#builders').style.fill = color;
}

export function initLogo() {
    logoColor();
    window.addEventListener('resize', logoColor);
}