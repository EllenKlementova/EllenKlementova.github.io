document.documentElement.classList.add("js");

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const lightbox = document.querySelector("#lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const lightboxCopy = lightbox.querySelector(".lightbox-copy");
  let previouslyFocused;

  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = button.dataset.alt || "Náhled projektu";
      const detail = document.getElementById(button.dataset.projectDetail || "");
      const hasDetail = Boolean(detail && lightboxCopy);
      lightbox.classList.toggle("lightbox-with-copy", hasDetail);
      if (lightboxCopy) {
        lightboxCopy.replaceChildren(...(hasDetail ? [detail.content.cloneNode(true)] : []));
        lightboxCopy.hidden = !hasDetail;
      }
      if (hasDetail) lightbox.setAttribute("aria-labelledby", "lightbox-title");
      else lightbox.removeAttribute("aria-labelledby");
      previouslyFocused = button;
      lightbox.showModal();
      lightbox.scrollTop = 0;
      document.body.classList.add("lightbox-open");
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());
  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    previouslyFocused?.focus({ preventScroll: true });
  });
  lightbox.addEventListener("click", (event) => {
    const bounds = lightbox.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (event.target === lightbox && outside) lightbox.close();
  });
}
