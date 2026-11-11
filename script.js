// Keep editable model details together here.
const MODEL = {
  name: "Abdul Wadud Nai",
  country: "Ghana",
  city: "City to be added",
  type: "Editorial / fashion",
  bio: "Abdul Wadud Nai is a fashion and editorial model based in Ghana. For bookings, portfolio collaborations, and availability, contact him directly.",
  measurements: { Height: "6 ft 3 in", Chest: "43 in", Waist: "35 in", "Shoe size": "43 EU", Hair: "Black", Eyes: "Black" },
  phone: "+233503917926",
  email: "wadudnayi@gmail.com",
  instagram: "https://instagram.com/bold_nai",
  tiktok: "https://tiktok.com/@boldnayi",
  whatsappMessage: "Hello Abdul, I found your portfolio and would like to book you.",
  experience: []
};

const PHOTOS = [
  { file: "abdul-wadud-nai-01.jpg", title: "Portrait", category: "editorial", ratio: "4 / 5" },
  { file: "abdul-wadud-nai-02.jpg", title: "Editorial study", category: "editorial", ratio: "3 / 4" },
  { file: "abdul-wadud-nai-03.jpg", title: "Street portrait", category: "street", ratio: "4 / 5" },
  { file: "abdul-wadud-nai-04.jpg", title: "Form and light", category: "editorial", ratio: "4 / 5" },
  { file: "abdul-wadud-nai-05.jpg", title: "Street style", category: "street", ratio: "3 / 4" },
  { file: "abdul-wadud-nai-06.jpg", title: "Editorial", category: "editorial", ratio: "4 / 5" },
  { file: "abdul-wadud-nai-07.jpg", title: "On location", category: "street", ratio: "3 / 4" },
  { file: "abdul-wadud-nai-08.jpg", title: "Portrait study", category: "editorial", ratio: "4 / 5" }
];

const WHATSAPP_URL = `https://wa.me/${MODEL.phone.replace(/\D/g, "")}?text=${encodeURIComponent(MODEL.whatsappMessage)}`;

function renderModelDetails() {
  const [firstName, ...restOfName] = MODEL.name.trim().split(/\s+/);
  document.querySelector("[data-first-name]").textContent = firstName;
  document.querySelector("[data-rest-name]").textContent = restOfName.join(" ");
  document.querySelectorAll("[data-name]").forEach((element) => { element.textContent = MODEL.name; });
  document.querySelectorAll("[data-country]").forEach((element) => { element.textContent = MODEL.country; });
  document.querySelector("[data-model-type]").textContent = MODEL.type;
  document.querySelector("[data-location-label]").textContent = `— ${[MODEL.city, MODEL.country].filter(Boolean).join(", ")}`;
  document.title = `${MODEL.name} | Model, ${MODEL.country}`;
  document.querySelector('meta[property="og:title"]').content = document.title;
  document.querySelector(".hero-photo img").alt = `${MODEL.name}, fashion model`;
  document.querySelector(".about-photo img").alt = `Portrait of ${MODEL.name}`;
  document.querySelector("[data-bio]").textContent = MODEL.bio;
  document.querySelector("[data-location]").textContent = [MODEL.city, MODEL.country].filter(Boolean).join(" / ");
  document.querySelector("[data-measurements]").innerHTML = Object.entries(MODEL.measurements).map(([label, value]) => `
    <div class="measure-item"><span>${label}</span><strong>${value}</strong></div>`).join("");
  document.querySelectorAll("[data-call]").forEach((link) => { link.href = `tel:${MODEL.phone}`; });
  document.querySelectorAll("[data-whatsapp]").forEach((link) => { link.href = WHATSAPP_URL; });
  document.querySelector("[data-email-link]").href = `mailto:${MODEL.email}`;
  document.querySelector("[data-email-link]").textContent = MODEL.email;
  document.querySelector("[data-instagram]").href = MODEL.instagram;
  document.querySelector("[data-tiktok]").href = MODEL.tiktok;
}

function markMissingPhoto(image) {
  image.closest("[data-photo-frame]")?.classList.add("photo-missing");
  image.hidden = true;
}

function renderGallery() {
  const gallery = document.querySelector("[data-gallery]");
  const galleryNote = document.querySelector(".gallery-note");
  let settledPhotos = 0;
  let availablePhotos = 0;
  gallery.innerHTML = PHOTOS.map((photo, index) => `
    <button class="gallery-item" type="button" data-photo-index="${index}" data-category="${photo.category}" aria-label="Open ${photo.title}, ${photo.category}">
      <span class="gallery-image photo-frame" data-photo-frame style="--photo-ratio:${photo.ratio}">
        <img src="images/${photo.file}" alt="${MODEL.name}, ${photo.title.toLowerCase()}" loading="lazy" decoding="async">
        <span class="photo-placeholder" aria-hidden="true">ADD PHOTO ${String(index + 1).padStart(2, "0")}</span>
      </span><span class="gallery-caption"><span>${photo.title}</span><span>${photo.category}</span></span>
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

function renderExperience() {
  if (!MODEL.experience.length) return;
  document.querySelector("#experience").hidden = false;
  document.querySelector("[data-experience-link]").hidden = false;
  document.querySelector("[data-timeline]").innerHTML = MODEL.experience.map((item) => `
    <li><time>${item.year}</time><div><strong>${item.title}</strong><span>${item.description}</span></div></li>`).join("");
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
  function showPhoto(index) {
    currentIndex = (index + PHOTOS.length) % PHOTOS.length;
    const photo = PHOTOS[currentIndex];
    figure.innerHTML = `<img src="images/${photo.file}" alt="${MODEL.name}, ${photo.title.toLowerCase()}"><span class="photo-placeholder" aria-hidden="true">ADD PHOTO ${String(currentIndex + 1).padStart(2, "0")}</span><figcaption>${photo.title} <span>· ${photo.category}</span></figcaption>`;
    figure.querySelector("img").addEventListener("error", (event) => { event.currentTarget.hidden = true; }, { once: true });
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
}

function setupBookingForm() {
  const form = document.querySelector("[data-booking-form]");
  const status = document.querySelector("[data-form-status]");
  const success = document.querySelector("[data-form-success]");
  function showSuccess() {
    form.hidden = true;
    success.hidden = false;
    history.replaceState(null, "", `${location.pathname}${location.hash}`);
  }
  if (new URLSearchParams(location.search).has("success")) showSuccess();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    status.textContent = "Sending your enquiry…";
    const body = new URLSearchParams(new FormData(form));
    try {
      const response = await fetch(form.action, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
      if (!response.ok) throw new Error("Booking form submission failed");
      status.textContent = "";
      showSuccess();
    } catch {
      status.textContent = "Your enquiry could not be sent. Please try again or contact Abdul directly.";
    }
  });
  document.querySelector("[data-new-enquiry]").addEventListener("click", () => {
    form.reset();
    form.hidden = false;
    success.hidden = true;
  });
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  });
  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
}

function setupReveal() {
  const targets = document.querySelectorAll(".section-kicker, .about-photo, .about-copy, .gallery-item, .contact-intro, .booking-panel");
  targets.forEach((target) => target.setAttribute("data-reveal", ""));
  if (!("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      currentObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  targets.forEach((target) => observer.observe(target));
}

document.querySelectorAll(".photo-frame img").forEach((image) => image.addEventListener("error", () => markMissingPhoto(image), { once: true }));
renderModelDetails();
renderGallery();
renderExperience();
setupFilters();
setupLightbox();
setupBookingForm();
setupNavigation();
setupReveal();
document.querySelector("[data-year]").textContent = new Date().getFullYear();