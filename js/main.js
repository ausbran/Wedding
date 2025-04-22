import { initNavigation } from "./navigation.js";
import { logoColor } from "./logo.js";
import { initProjectOverview } from "./projectOverview.js";
import { initPress } from "./press.js";
import { initSlider } from "./slider.js";
import { initLandingFeatured } from "./landingFeatured.js";
import { initProject } from "./project.js";
import { initLoad } from "./load.js";
import { initScroll } from "./scroll.js";
import { initContact } from "./contact.js";
import { initAnchor } from "./anchor.js";
import { initRSVP } from "./rsvp.js";
import { body, nav, navHeight } from "./globals.js";

document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  const namespace = document.querySelector("main").dataset.barbaNamespace;
  initializeComponents(document, namespace);
});

function initializeComponents(container, namespace) {
  initScroll();

  switch (namespace) {
    case "rsvp":
      initRSVP();
      break;
    case "home":
      // Handle Lottie animation if it's present (Twig controls rendering)
      const lottiePlayer = container.querySelector("dotlottie-player");
      const wrapper = container.querySelector(".lottie");

      if (lottiePlayer && wrapper) {
        lottiePlayer.addEventListener("complete", () => {
          wrapper.classList.add("move-up");
          wrapper.addEventListener("transitionend", () => wrapper.remove(), {
            once: true,
          });
        });
      }
      break;
  }
}

barba.init({
  transitions: [
    {
      name: "opacity-transition",
      leave(data) {
        return gsap.to(data.current.container, { opacity: 0 });
      },
      enter(data) {
        return gsap.from(data.next.container, { opacity: 0 });
      },
      afterEnter(data) {
        const container = data.next.container;
        const newBodyClass = container.dataset.bodyClass;

        if (newBodyClass) {
          document.body.className = newBodyClass;
        } else {
          document.body.className = ""; // fallback
        }

        // Your usual component init
        const namespace = container.dataset.barbaNamespace;
        initializeComponents(container, namespace);
      },
    },
  ],
});
