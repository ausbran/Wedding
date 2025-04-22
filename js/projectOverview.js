import { navHeight } from './globals.js';

export function initProjectOverview() {
    const projects = document.querySelectorAll(".project");

    function updateObserver() {
        const observerOptions = {
            root: null,
            rootMargin: `-${navHeight}px 0px -${navHeight}px 0px`,
            threshold: buildThresholdList()
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);
        projects.forEach((project) => observer.observe(project));
    }

    function buildThresholdList() {
        let thresholds = [];
        let numSteps = 100; // number of animation steps
        for (let i = 1.0; i <= numSteps; i++) {
            thresholds.push(i / numSteps);
        }
        thresholds.push(0);
        return thresholds;
    }

    function handleIntersect(entries) {
        entries.forEach((entry) => {
            const overlay = entry.target.querySelector('.overlay');
            const text = entry.target.querySelector('.text');

            if (overlay) {
                const opacity = 0.8 - (entry.intersectionRatio * 1);
                overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
            }

            text.style.opacity = `${entry.intersectionRatio}`;
        });
    }

    updateObserver();
    window.addEventListener('resize', updateObserver);
}