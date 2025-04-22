import { body, nav } from './globals.js';
import { logoColor } from './logo.js';

export function initProject(container) {
    let magnify = container.querySelector('.magnify'),
        backgroundElement = container.querySelector('.background.gradient'),
        sliderContainer = container.querySelector('.slider-container'),
        firstSlide = container.querySelector('.first-slide'),
        buttons = container.querySelector('.project-buttons'),
        close = buttons.querySelector('.close'),
        slides = sliderContainer.querySelectorAll('.project-slide'),
        projectImages = backgroundElement.querySelectorAll('picture'),
        inner = container.querySelector('.inner'),
        timeout = 300,
        back = container.querySelector('.back'),
        text = back.querySelectorAll('*');

    let currentImageIndex = 0;
    let isThumbnailSliderOpen = false; // Track whether the thumbnail slider is open

    // Scroll event to toggle text color
    window.addEventListener('scroll', function () {
        if (isThumbnailSliderOpen || window.scrollY > 10) {
            text.forEach(textElement => textElement.classList.add('black'));
        } else {
            text.forEach(textElement => textElement.classList.remove('black'));
        }
    });

    function showImage(index) {
        projectImages.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active');
                img.classList.remove('previous');
            } else {
                img.classList.remove('active');
                img.classList.add('previous');
            }
        });
    }

    function closeSlider() {
        sliderContainer.style.opacity = 0;
        buttons.classList.remove('menu-opened');

        setTimeout(() => {
            sliderContainer.style.display = 'none';
            backgroundElement.style.opacity = 1;
            inner.classList.remove('active');
            body.classList.remove('no-scroll');
            nav.classList.remove('scrolled-without-border');
            if (back) {
                text.forEach(texts => {
                    texts.classList.remove('black');
                });
            }
        }, timeout);
        isThumbnailSliderOpen = false; // Set to false when the slider is closed
    }

    function handleArrowClick(direction) {
        if (isThumbnailSliderOpen) {
            // Handle arrow click for thumbnail slider
            const offset = direction === 'next' ? 1 : -1;
            scrollThumbnailSlider(offset);
        } else {
            // Handle arrow click for main background images
            if (direction === 'next') {
                currentImageIndex = (currentImageIndex + 1) % projectImages.length;
            } else if (direction === 'prev') {
                currentImageIndex = (currentImageIndex - 1 + projectImages.length) % projectImages.length;
            }
            showImage(currentImageIndex);
            logoColor(); //recolor the logo whenever image is changed
        }
    }

    function scrollThumbnailSlider(offset) {
        const slider = sliderContainer.querySelector('.slider');
        const slideWidth = slider.clientWidth / slides.length;

        slider.scrollBy({
            left: offset * slideWidth,
            behavior: 'smooth'
        });

        toggleArrows();
    }

    function toggleArrows() {
        const arrowPrev = buttons.querySelector('.arrow-prev');
        const arrowNext = buttons.querySelector('.arrow-next');
        const slider = sliderContainer.querySelector('.slider');

        const isAtStart = slider.scrollLeft <= 0;
        const isAtEnd = slider.scrollLeft >= slider.scrollWidth - slider.clientWidth;

        if (arrowPrev) arrowPrev.classList.toggle('disabled', isAtStart);
        if (arrowNext) arrowNext.classList.toggle('disabled', isAtEnd);
    }

    // Detect if the browser is Firefox
    function isFirefox() {
        return typeof InstallTrigger !== 'undefined';
    }

    // Smooth scroll function compatible with Firefox
    function scrollToTop() {
        const duration = 280; // Total duration in milliseconds
        const startPosition = window.scrollY;
        let startTime = null;

        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1); // Ease-in-out effect

            window.scrollTo(0, startPosition * (1 - progress));

            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    if (magnify && backgroundElement && sliderContainer) {
        magnify.addEventListener('click', function () {
            if (isFirefox()) {
                scrollToTop();  // Use custom smooth scroll for Firefox
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });  // Default smooth scroll for other browsers
            }
            body.classList.add('no-scroll');
            buttons.classList.add('menu-opened');
            nav.classList.add('scrolled-without-border');
    
            if (back) {
                text.forEach(textElement => {
                    if (!textElement.classList.contains('active')) {
                        textElement.classList.add('black');
                    }
                });
            }
    
            backgroundElement.style.transition = 'opacity 0.5s';
            backgroundElement.style.opacity = 0;
    
            sliderContainer.style.display = 'block';
            sliderContainer.style.opacity = 0;
            sliderContainer.style.transition = 'opacity 0.5s';
    
            setTimeout(() => {
                inner.classList.add('active');
                sliderContainer.style.opacity = 1;
                isThumbnailSliderOpen = true; // Set to true when the slider is opened
                toggleArrows(); // Initialize arrow state when the slider is opened
            }, timeout);
        });
    }

    close.addEventListener('click', closeSlider);

    const projectArrows = buttons.querySelectorAll('.project-buttons .arrow');

    projectArrows.forEach(arrow => {
        arrow.addEventListener('click', function () {
            if (arrow.classList.contains('arrow-next')) {
                handleArrowClick('next');
            } else {
                handleArrowClick('prev');
            }
        });
    });

    slides.forEach((slide, index) => {
        slide.addEventListener('click', function () {
            currentImageIndex = index;
            showImage(currentImageIndex); // Update background image
            if (isThumbnailSliderOpen) {
                closeSlider(); // Close the slider after updating the background image
                logoColor(); //recolor the logo whenever an image is selected from slider
            }
        });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight') {
            handleArrowClick('next');
        } else if (event.key === 'ArrowLeft') {
            handleArrowClick('prev');
        }
    });

    // Initial display setup
    showImage(currentImageIndex);

    // Intersection Observer to hide text when slider comes into view
    if (firstSlide) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    text.forEach(textElement => {
                        textElement.classList.add('hidden');
                    });
                } else {
                    text.forEach(textElement => {
                        textElement.classList.remove('hidden');
                    });
                }
            });
        }, { threshold: 0.8 });

        observer.observe(firstSlide);
    }
}