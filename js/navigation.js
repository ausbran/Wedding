import { body, nav, links, navIcon } from "./globals.js";

export function initNavigation() {
  const audio = document.getElementById("background-audio");
  const triggerArea = document.querySelector(".home"); // Change this selector to your hover element
  let hasInteracted = false;

  const playAudio = () => {
    if (!hasInteracted) {
      audio
        .play()
        .then(() => {
          console.log("Audio playing on hover.");
          hasInteracted = true;
        })
        .catch(() => {
          console.log("Autoplay blocked. Waiting for interaction.");
        });
    }
  };

  // Try to play on hover
  // triggerArea.addEventListener("mouseenter", playAudio, { once: true });

  // Backup: Play on click if hover doesn't work
  document.body.addEventListener("click", playAudio, { once: true });
  // navIcon.addEventListener('click', function () {
  //     nav.classList.toggle('menu-opened');
  //     body.classList.toggle('no-scroll');
  //     if (document.querySelector('.back')) {
  //         document.querySelector('.back').classList.add('hidden');
  //     }
  // });
  // function closeMenu() {
  //     nav.classList.remove('menu-opened');
  //     body.classList.remove('no-scroll');
  // }
  // document.body.addEventListener('click', function(event) {
  //     if (event.target.closest('.close')) {
  //         closeMenu();
  //         if (document.querySelector('.back')) {
  //             document.querySelector('.back').classList.remove('hidden');
  //         }
  //     }
  // });
  // const navLinks = document.querySelectorAll('nav a');
  // navLinks.forEach(link => {
  //     link.addEventListener('click', function () {
  //         closeMenu();
  //     });
  // });
  // function throttle(func) {
  //     let inThrottle;
  //     return function () {
  //         const context = this;
  //         const args = arguments;
  //         if (!inThrottle) {
  //             func.apply(context, args);
  //             inThrottle = true;
  //             requestAnimationFrame(function () {
  //                 inThrottle = false;
  //             });
  //         }
  //     };
  // }
  // function handleScroll() {
  //     const scrolledClass = 'scrolled';
  //     if (window.scrollY > 10) {
  //         nav.classList.add(scrolledClass);
  //     } else {
  //         nav.classList.remove(scrolledClass);
  //     }
  // }
  // const throttledHandleScroll = throttle(handleScroll);
  // window.addEventListener('scroll', throttledHandleScroll);
}
