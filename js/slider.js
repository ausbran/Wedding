import { navHeight } from "./globals.js";

export function initSlider() {
  const sliders = document.querySelectorAll(".slider");
  const accordions = document.querySelectorAll(".slider.accordion");

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll(".slide");
    const arrowPrev = slider
      .closest(".slider-container")
      .querySelector(".arrow-prev");
    const arrowNext = slider
      .closest(".slider-container")
      .querySelector(".arrow-next");

    function scrollSlider(offset) {
      const currentScrollLeft = slider.scrollLeft + offset;
      slider.scrollTo({
        left: currentScrollLeft,
        behavior: "smooth",
      });
      toggleArrows();
    }

    function toggleArrows() {
      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
      const nearStart = slider.scrollLeft <= 1;
      const nearEnd = slider.scrollLeft >= maxScrollLeft - 1;

      if (arrowPrev && arrowNext) {
        arrowPrev.classList.toggle("disabled", nearStart);
        arrowNext.classList.toggle("disabled", nearEnd);
      }
    }

    if (arrowPrev && arrowNext) {
      arrowPrev.addEventListener("click", () => {
        if (!arrowPrev.classList.contains("disabled")) {
          scrollSlider(-1 * slider.clientWidth);
        }
      });

      arrowNext.addEventListener("click", () => {
        if (!arrowNext.classList.contains("disabled")) {
          scrollSlider(1 * slider.clientWidth);
        }
      });

      toggleArrows();
    }

    slider.addEventListener("scroll", toggleArrows);
    window.addEventListener("resize", toggleArrows);
  });

  accordions.forEach((accordion) => {
    const accordionSlides = accordion.querySelectorAll(".accordion-slide");
    const closeButtons = accordion.querySelectorAll(".slide-out .close");

    accordionSlides.forEach((slide) => {
      slide.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Accordion slide clicked:", slide);
        slide.classList.toggle("active");

        const trigger = slide.querySelector(".accordion-trigger .label");
        if (trigger) {
          trigger.textContent = slide.classList.contains("active")
            ? "Read Less"
            : "Read More";
        }

        const slideTop = slide.getBoundingClientRect().top + window.scrollY;
        const scrollToPosition =
          slideTop -
          (window.innerHeight - slide.offsetHeight) / 2 -
          navHeight / 1.9;

        window.scrollTo({
          top: scrollToPosition,
          behavior: "smooth",
        });
      });
    });

    closeButtons.forEach((close) => {
      close.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation(); // Prevents the event from bubbling up

        const slide = close.closest(".accordion-slide");
        if (slide) {
          slide.classList.remove("active");
          const trigger = slide.querySelector(".accordion-trigger .label");
          if (trigger) {
            trigger.textContent = "Read More";
          }
        }
      });
    });
  });
}
