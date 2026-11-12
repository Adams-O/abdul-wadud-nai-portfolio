const MODEL = {
  name: "Abdul Wadud Nai",
  country: "Ghana",
  city: "[CITY]",
  type: "Editorial / Fashion",
  bio: "Abdul Wadud Nai is a Ghana-based fashion and editorial model with a strong, refined presence and a polished visual point of view. His clean silhouette and expressive styling make him a natural fit for fashion editorials, campaigns, and contemporary portrait work.",
  measurements: { Height: "6 ft 3 in", Chest: "43", Waist: "35", Shoe: "43 (EU)", Hair: "Black", Eyes: "Black" },
  phone: "+233503917926",
  email: "wadudnayi@gmail.com",
  instagram: "https://instagram.com/bold_nai",
  tiktok: "https://tiktok.com/@boldnayi",
  whatsappMessage: "Hello Abdul, I found your portfolio and would like to book you."
};

const PHOTOS = [
  { file: "abdul-wadud-nai-01.jpg", title: "Portrait", category: "editorial", width: 962, height: 1280 },
  { file: "abdul-wadud-nai-02.jpg", title: "Editorial study", category: "editorial", width: 954, height: 1280 },
  { file: "abdul-wadud-nai-03.jpg", title: "Street portrait", category: "street", width: 868, height: 1280 },
  { file: "abdul-wadud-nai-04.jpg", title: "Form and light", category: "editorial", width: 868, height: 1280 },
  { file: "abdul-wadud-nai-05.jpg", title: "Street style", category: "street", width: 900, height: 1280 },
  { file: "abdul-wadud-nai-06.jpg", title: "Editorial", category: "editorial", width: 950, height: 1280 },
  { file: "abdul-wadud-nai-07.jpg", title: "On location", category: "street", width: 930, height: 1280 },
  { file: "abdul-wadud-nai-08.jpg", title: "Portrait study", category: "editorial", width: 930, height: 1280 }
];

const WHATSAPP_URL = `https://wa.me/${MODEL.phone.replace(/\D/g, "")}?text=${encodeURIComponent(MODEL.whatsappMessage)}`;

function renderModelDetails() {
  document.querySelectorAll("[data-name]").forEach((element) => { element.textContent = MODEL.name; });
  document.querySelectorAll("[data-country]").forEach((element) => { element.textContent = MODEL.country; });
  document.title = `${MODEL.name} | Model, ${MODEL.country}`;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector("[data-bio]").textContent = MODEL.bio;
  document.querySelector("[data-location]").textContent = [MODEL.city, MODEL.country].filter(Boolean).join(" / ");
  document.querySelector("[data-measurements]").innerHTML = Object.entries(MODEL.measurements).map(([label, value]) => `
    <div class="measure-item"><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  document.querySelectorAll("[data-call]").forEach((link) => { link.href = `tel:${MODEL.phone}`; });
  document.querySelectorAll("[data-whatsapp]").forEach((link) => { link.href = WHATSAPP_URL; });
  const emailLink = document.querySelector("[data-email-link]");
  emailLink.href = `mailto:${MODEL.email}`;
  emailLink.textContent = MODEL.email;
  document.querySelector("[data-instagram]").href = MODEL.instagram;
  document.querySelector("[data-tiktok]").href = MODEL.tiktok;
}

function markMissingPhoto(image) {
  const frame = image.closest("[data-photo-frame], .about-image, .hero");
  frame?.classList.add("photo-missing");
  if (frame && !frame.querySelector(".photo-placeholder")) {
    frame.insertAdjacentHTML("beforeend", '<span class="photo-placeholder" aria-hidden="true">Image unavailable</span>');
  }
  image.hidden = true;
}

function renderGallery() {
  const gallery = document.querySelector("[data-gallery]");
  const galleryNote = document.querySelector(".gallery-note");
  let settledPhotos = 0;
  let availablePhotos = 0;

  gallery.innerHTML = PHOTOS.map((photo, index) => `
    <button class="gallery-item reveal" type="button" data-photo-index="${index}" data-category="${photo.category}" aria-label="Open ${photo.title}, ${photo.category}">
      <span class="gallery-image" data-photo-frame style="--photo-ratio:${photo.width} / ${photo.height}">
        <img src="images/${photo.file}" alt="${MODEL.name}, ${photo.title.toLowerCase()}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async">
      </span>
      <span class="gallery-caption"><span>${photo.title}</span><span>${photo.category}</span></span>
    </button>`).join("");

  gallery.querySelectorAll("img").forEach((image) => {
    image.addEventListener("load", () => {
      settledPhotos++;
      availablePhotos++;
      galleryNote.hidden = true;
    }, { once: true });
    image.addEventListener("error", () => {
      markMissingPhoto(image);
      settledPhotos++;
      if (settledPhotos === PHOTOS.length && !availablePhotos) galleryNote.hidden = false;
    }, { once: true });
  });
}

function setupFilters() {
  const tabs = [...document.querySelectorAll(".gallery-tab")];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.hidden = tab.dataset.filter !== "all" && item.dataset.category !== tab.dataset.filter;
    });
  }));
}

function setupLightbox() {
  const dialog = document.querySelector("[data-lightbox]");
  const figure = document.querySelector("[data-lightbox-figure]");
  const count = document.querySelector("[data-lightbox-count]");
  let currentIndex = 0;
  let touchStartX = 0;

  function showPhoto(index) {
    currentIndex = (index + PHOTOS.length) % PHOTOS.length;
    const photo = PHOTOS[currentIndex];
    figure.innerHTML = `<img src="images/${photo.file}" alt="${MODEL.name}, ${photo.title.toLowerCase()}" width="${photo.width}" height="${photo.height}"><figcaption>${photo.title} <span>· ${photo.category}</span></figcaption>`;
    figure.querySelector("img").addEventListener("error", (event) => {
      event.currentTarget.hidden = true;
      figure.insertAdjacentHTML("afterbegin", '<p class="lightbox-missing">Photo unavailable</p>');
    }, { once: true });
    count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(PHOTOS.length).padStart(2, "0")}`;
  }

  document.querySelector("[data-gallery]").addEventListener("click", (event) => {
    const item = event.target.closest("[data-photo-index]");
    if (!item) return;
    showPhoto(Number(item.dataset.photoIndex));
    dialog.showModal();
  });
  document.querySelector("[data-lightbox-close]").addEventListener("click", () => dialog.close());
  document.querySelector("[data-lightbox-prev]").addEventListener("click", () => showPhoto(currentIndex - 1));
  document.querySelector("[data-lightbox-next]").addEventListener("click", () => showPhoto(currentIndex + 1));
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showPhoto(currentIndex - 1);
    if (event.key === "ArrowRight") showPhoto(currentIndex + 1);
  });
  dialog.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  dialog.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 45) return;
    showPhoto(currentIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
}

function setupBookingForm() {
  const form = document.querySelector("[data-booking-form]");
  const status = document.querySelector("[data-form-status]");
  const success = document.querySelector("[data-form-success]");
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    history.replaceState(null, "", `${location.pathname}${location.hash}`);
  }

  if (new URLSearchParams(location.search).has("success")) showSuccess();

  if (isLocal) {
    status.textContent = "Bookings are sent from the live Netlify site. Deploy the project, then submit the form there to receive email notifications.";
    form.addEventListener("submit", (event) => {
      if (!form.reportValidity()) return;
      event.preventDefault();
      status.dataset.state = "";
      status.textContent = "This form works on the live Netlify URL. Submit it there to send your booking request.";
    });
  } else {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      status.dataset.state = "";
      status.textContent = "Sending your enquiry…";
      const body = new URLSearchParams(new FormData(form));
      try {
        const response = await fetch(form.action, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
        if (!response.ok) throw new Error("Booking form submission failed");
        status.textContent = "";
        showSuccess();
      } catch {
        status.dataset.state = "error";
        status.textContent = "Your enquiry could not be sent. Please try again or contact Abdul directly.";
      }
    });
  }

  document.querySelector("[data-new-enquiry]").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    success.hidden = true;
    status.dataset.state = "";
    status.textContent = isLocal ? "Bookings are sent from the live Netlify site. Deploy the project, then submit the form there to receive email notifications." : "";
  });
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const header = document.querySelector(".site-header");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function setupThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  const root = document.documentElement;
  const themeColor = document.querySelector("[data-theme-color]");

  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeColor.content = getComputedStyle(root).getPropertyValue("--bg").trim();
    toggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
  }

  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
  toggle.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.themePreference = "user";
    try {
      localStorage.setItem("abdul-theme", nextTheme);
    } catch {
      // Theme still changes for this page view when storage is unavailable.
    }
    applyTheme(nextTheme);
  });

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  systemTheme.addEventListener?.("change", (event) => {
    if (root.dataset.themePreference === "system") applyTheme(event.matches ? "dark" : "light");
  });
}

function setupRevealAndParallax() {
  const targets = document.querySelectorAll(".reveal");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    }
  }), { threshold: 0.1 });
  targets.forEach((target) => observer.observe(target));

  const galleryItems = [...document.querySelectorAll(".gallery-item")];
  let frameRequested = false;
  function updateParallax() {
    frameRequested = false;
    const viewportHeight = window.innerHeight;
    galleryItems.forEach((item) => {
      if (item.hidden) return;
      const bounds = item.getBoundingClientRect();
      const distance = (bounds.top + bounds.height / 2 - viewportHeight / 2) / viewportHeight;
      const offset = Math.max(-10, Math.min(10, -distance * 8));
      item.style.setProperty("--parallax-y", `${offset.toFixed(1)}px`);
    });
  }
  window.addEventListener("scroll", () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateParallax);
  }, { passive: true });
  updateParallax();
}

function setupBackToTop() {
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  });
}

document.querySelectorAll(".hero-photo, .about-image img").forEach((image) => {
  image.addEventListener("error", () => markMissingPhoto(image), { once: true });
});
renderModelDetails();
renderGallery();
setupFilters();
setupLightbox();
setupBookingForm();
setupNavigation();
setupThemeToggle();
setupBackToTop();
setupRevealAndParallax();
document.querySelector("[data-year]").textContent = new Date().getFullYear();
