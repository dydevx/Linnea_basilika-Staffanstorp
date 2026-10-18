/**
 * Linnea & Basilika Staffanstorp – Main Script
 */

// ============================================================
// NAV & SCROLL
// ============================================================

const nav = document.getElementById("main-nav");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay");

function initNavigationObservers() {
  if (!nav) return;
  const sentinel = document.createElement("span");
  sentinel.className = "nav-scroll-sentinel";
  sentinel.setAttribute("aria-hidden", "true");
  Object.assign(sentinel.style, { position: "absolute", top: "60px", width: "1px", height: "1px", pointerEvents: "none" });
  document.body.prepend(sentinel);
  new IntersectionObserver(([entry]) => nav.classList.toggle("scrolled", !entry.isIntersecting)).observe(sentinel);

  const navLinks = [...document.querySelectorAll(".nav-link")];
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
  }, { rootMargin: "-22% 0px -66% 0px", threshold: [0, .2, .6] });
  document.querySelectorAll("main > section[id]").forEach(section => sectionObserver.observe(section));
}

// Hamburger
if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open", isOpen);
    mobileOverlay.classList.toggle("active", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    hamburger.setAttribute("aria-expanded", isOpen);
  });
}

if (mobileOverlay) {
  mobileOverlay.addEventListener("click", closeMobileMenu);
}

document.querySelectorAll(".mobile-nav-link").forEach(link => {
  link.addEventListener("click", closeMobileMenu);
});

function closeMobileMenu() {
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
  mobileOverlay.classList.remove("active");
  document.body.style.overflow = "";
  hamburger.setAttribute("aria-expanded", "false");
}

// Smooth scroll for anchor links
document.addEventListener("click", e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  if (link.getAttribute("href") === "#") return;
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  e.preventDefault();
  const offset = 80;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});

// ============================================================
// SCROLL REVEAL
// ============================================================

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: "0px 0px -60px 0px" });

function initReveal() {
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

// ============================================================
// CART DRAWER
// ============================================================

const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
let cartReturnFocus = null;

function openCart() {
  cartReturnFocus = document.activeElement;
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
  renderCartDrawer();
  document.getElementById("close-cart")?.focus();
}

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
  cartReturnFocus?.focus({ preventScroll: true });
}

document.addEventListener("keydown", event => {
  if (!cartDrawer.classList.contains("open")) return;
  if (event.key === "Escape") { closeCartDrawer(); return; }
  if (event.key !== "Tab") return;
  const controls = [...cartDrawer.querySelectorAll('button, a[href], input, [tabindex="0"]')].filter(element => element.getClientRects().length && !element.disabled);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
});

document.querySelectorAll(".open-cart-btn").forEach(btn => {
  btn.addEventListener("click", openCart);
});

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCartDrawer);
}

const closeCartBtn = document.getElementById("close-cart");
if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCartDrawer);
}

// ============================================================
// MENU RENDERING
// ============================================================

const menuSections = [
  { key: "guestsFavorites", type: "mixed-plate" },
  { key: "starkBasilika", type: "list" },
  { key: "vitloksmarinerad", type: "list" },
  { key: "gronCurry", type: "list" },
  { key: "gulCurry", type: "list" },
  { key: "rodCurry", type: "list" },
  { key: "padThai", type: "list" },
  { key: "wokadeNudlar", type: "list" },
  { key: "huvudratter", type: "list" },
  { key: "extras", type: "extras" },
  { key: "drinkLB", type: "drinks" }
];

const sushiSections = [
  { key: "makiRolls", type: "list" },
  { key: "crunchyRolls", type: "list" },
  { key: "nigiriMix", type: "list" },
  { key: "nigiriSide", type: "list" },
  { key: "sushiMixMeny", type: "list" },
  { key: "sushiBowls", type: "list" },
  { key: "sides", type: "list" },
  { key: "upgrades", type: "extras" },
  { key: "drinkSushi", type: "drinks" }
];

const MENU_SECTION_IMAGES = {
  guestsFavorites: { src: "assets/images/ai/mixed-plate.png", alt: "AI-illustration av en mixed plate med kycklingspett, räkor och curry" },
  starkBasilika: { src: "assets/images/ai/thai-basil.png", alt: "AI-illustration av kyckling med thaibasilika och chili" },
  vitloksmarinerad: { src: "assets/images/ai/garlic-beef.png", alt: "AI-illustration av vitlöksmarinerat nötkött med svartpeppar" },
  huvudratter: { src: "assets/images/generated/crispy-salmon.png", alt: "AI-illustration av krispig lax med jasminris och grönsaker" },
  gronCurry: { src: "assets/images/ai/green-curry.png", alt: "AI-illustration av grön thaicurry med jasminris" },
  gulCurry: { src: "assets/images/ai/yellow-curry.png", alt: "AI-illustration av gul thaicurry med kyckling" },
  rodCurry: { src: "assets/images/ai/red-curry.png", alt: "AI-illustration av röd thaicurry med kyckling" },
  padThai: { src: "assets/images/ai/pad-thai.png", alt: "AI-illustration av Pad Thai med räkor och lime" },
  wokadeNudlar: { src: "assets/images/ai/wok-noodles.png", alt: "AI-illustration av wokade nudlar med räkor och grönsaker" },
  makiRolls: { src: "assets/images/ai/sushi.png", alt: "AI-illustration av makirullar och laxnigiri" },
  crunchyRolls: { src: "assets/images/ai/crunchy-maki.png", alt: "AI-illustration av krispiga makirullar" },
  nigiriMix: { src: "assets/images/generated/nigiri-assortment.png", alt: "AI-illustration av ett urval nigiri" },
  nigiriSide: { src: "assets/images/generated/nigiri-side-selection.jpg", alt: "AI-illustration av tre nigiri med lax, tonfisk och räka" },
  sushiMixMeny: { src: "assets/images/generated/sushi-mix-menu.jpg", alt: "AI-illustration av en blandad sushimeny med nigiri och maki" },
  sushiBowls: { src: "assets/images/ai/sushi-bowl.png", alt: "AI-illustration av en sushi bowl med grillad lax och avokado" },
  sides: { src: "assets/images/generated/asian-sides.png", alt: "AI-illustration av asiatiska smårätter och tillbehör" }
};

// Category filter tags
const ALL_FILTERS = [
  { id: "alla", label: "Alla" },
  { id: "favoriter", label: "Favoriter" },
  { id: "kyckling", label: "Kyckling" },
  { id: "notkoett", label: "Nötkött" },
  { id: "rakor", label: "Räkor" },
  { id: "vegetariskt", label: "Vegetariskt" },
  { id: "curry", label: "Curry" },
  { id: "nudlar", label: "Nudlar" },
  { id: "sushi", label: "Sushi" },
  { id: "bowls", label: "Bowls" },
  { id: "dryck", label: "Dryck" }
];

let activeFilter = "alla";
let searchQuery = "";
let activeCategory = "all";
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

function animateMenuResults() {
  if (motionPreference.matches) return;
  const panel = document.querySelector('[role="tabpanel"]:not([hidden])');
  panel?.getAnimations().forEach(animation => animation.cancel());
  panel?.animate([{ opacity: .5, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 260, easing: "cubic-bezier(.16,1,.3,1)" });
}

function syncMenuBrowser() {
  const isSushi = document.getElementById("sushi-tab").classList.contains("active");
  const sections = isSushi ? sushiSections : menuSections;
  const select = document.getElementById("menu-category");
  activeCategory = "all";
  select.innerHTML = '<option value="all">Alla kategorier</option>' + sections.map(({ key }) => {
    const section = MENU_DATA[key];
    return `<option value="${section.id}">${escapeHtml(section.categoryName)}</option>`;
  }).join("");
  document.getElementById("menu-collection-title").textContent = isSushi ? "Sushi & bowls" : "Thai & asiatiskt";
  document.getElementById("menu-collection-description").textContent = isSushi ? "Maki, nigiri och bowls. Utforska menyn och hitta din kombination." : "Från doftande curry till wok och Pad Thai. Hitta din favorit.";
  const photo = document.getElementById("menu-collection-image");
  photo.src = isSushi ? "assets/images/generated/sushi-collection-sashimi.jpg" : "assets/images/generated/thai-collection-tom-kha.jpg";
  photo.alt = isSushi ? "AI-illustration av sashimi med lax, tonfisk och hamachi" : "AI-illustration av en thailändsk middag med Tom Kha Gai";
  const panel = document.getElementById(isSushi ? "sushi-menu-container" : "thai-menu-container");
  const categories = new Set([...panel.querySelectorAll("[data-categories]")].flatMap(card => card.dataset.categories.split(" ")));
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.hidden = button.dataset.filter !== "alla" && !categories.has(button.dataset.filter);
  });
}

function spicyBadge(level) {
  if (!level || level === 0) return "";
  const label = level === 1 ? "Milt stark" : level === 2 ? "Stark" : "Mycket stark";
  return `<span class="spicy-badge">${label}</span>`;
}

function priceTag(item) {
  if (item.price === null || item.price === undefined) {
    return `<span class="price-unconfirmed" title="${item.priceNote || ""}">Fråga personalen</span>`;
  }
  return `<span class="price">${item.price} kr</span>`;
}

function canOrder(item) {
  return item.price !== null && item.price !== undefined;
}

function cartAction(item, label = "Lägg till") {
  const payloadItem = { ...item, image: item.image || (window.getDishImage ? window.getDishImage(item) : "") };
  const payload = encodeURIComponent(JSON.stringify(payloadItem));
  return `<button class="add-btn catalog-add-btn" type="button" aria-label="Lägg till ${escapeHtml(item.name)}" data-cart-item="${payload}">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    <span>${label}</span>
  </button>`;
}

function renderMenuCard(item, sectionName) {
  const orderable = canOrder(item);
  const dishImg = window.getDishImage ? window.getDishImage(item) : "assets/images/ai/mixed-plate.png";
  const name = item.fullName || item.name;
  return `
    <article class="menu-card catalog-menu-card catalog-menu-card-text" tabindex="0" role="button" data-menu-id="${escapeHtml(item.id)}" data-categories="${(item.category || []).join(" ")}" data-name="${escapeHtml((name || "").toLowerCase())}" data-code="${escapeHtml(String(item.code || ""))}">
      <div class="catalog-dish-body">
        <div class="catalog-card-meta">
          ${item.code ? `<span class="catalog-dish-badge">Nr ${escapeHtml(String(item.code))}</span>` : ""}
          ${item.spicyLevel ? `<span class="catalog-spicy-indicator" title="${item.spicyLevel === 1 ? 'Milt stark' : item.spicyLevel === 2 ? 'Stark' : 'Mycket stark'}">${'🌶️'.repeat(item.spicyLevel)}</span>` : ""}
        </div>
        <div class="catalog-dish-info">
          <h3 class="menu-card-name">${escapeHtml(name)}</h3>
          ${item.description ? `<p class="menu-card-desc">${escapeHtml(item.description)}</p>` : ""}
        </div>
        <div class="catalog-dish-bottom">
          <div class="catalog-dish-price-wrap">${priceTag(item)}</div>
          ${orderable
            ? cartAction({ id: item.id, code: item.code || null, name, price: item.price, image: dishImg })
            : `<span class="price-unavailable">Kontakta restaurangen</span>`
          }
        </div>
      </div>
    </article>
  `;
}

function renderMixedPlateCard(item) {
  const name = `Meny ${item.code} – Mixed Plate`;
  const dishImg = window.getDishImage ? window.getDishImage(item) : "assets/images/ai/mixed-plate.png";
  return `
    <article class="menu-card catalog-menu-card catalog-menu-card-text mixed-plate-card" tabindex="0" role="button" data-menu-id="${escapeHtml(item.id)}" data-categories="${[...(item.category || []), "favoriter"].join(" ")}" data-name="${escapeHtml(name.toLowerCase())}" data-code="${escapeHtml(String(item.code || ""))}">
      <div class="catalog-dish-body">
        <div class="catalog-card-meta">
          <span class="catalog-dish-badge">Meny ${escapeHtml(String(item.code))}</span>
          <span class="catalog-featured-badge">Gästernas favorit</span>
        </div>
        <div class="catalog-dish-info">
          <h3 class="menu-card-name">Meny ${escapeHtml(String(item.code))}</h3>
          <ul class="mixed-plate-dishes">
            ${(item.dishes || []).map(dish => `<li><i class="fa-solid fa-check" aria-hidden="true"></i> <span>${escapeHtml(dish)}</span></li>`).join("")}
          </ul>
          ${spicyBadge(item.spicyLevel)}
        </div>
        <div class="catalog-dish-bottom">
          <div class="catalog-dish-price-wrap"><span class="price">${item.price} kr</span></div>
          ${cartAction({ id: item.id, code: `Meny ${item.code}`, name, price: item.price, image: dishImg })}
        </div>
      </div>
    </article>
  `;
}

function renderExtraRow(item) {
  const description = item.description && item.description.toLowerCase() !== item.name.toLowerCase()
    ? `<p class="extra-desc">${escapeHtml(item.description)}</p>`
    : `<p class="extra-desc extra-desc-muted">Lägg till i din beställning</p>`;
  return `
    <article class="extra-row" data-menu-id="${escapeHtml(item.id)}" data-categories="${(item.category || ["extras"]).join(" ")}" data-name="${escapeHtml(item.name.toLowerCase())}">
      <div class="extra-copy"><h3 class="extra-name">${escapeHtml(item.name)}</h3>${description}</div>
      <div class="extra-purchase"><span class="extra-price"><strong>${item.price}</strong> kr</span>${cartAction({ id: item.id, name: item.name, price: item.price })}</div>
    </article>
  `;
}

function renderDrinkRow(item) {
  return `
    <div class="drink-row" data-menu-id="${escapeHtml(item.id)}" data-categories="dryck" data-name="${escapeHtml(item.name.toLowerCase())}">
      <span class="drink-name">${escapeHtml(item.name)}</span>
      <span class="drink-price">${item.price} kr</span>
      ${cartAction({ id: item.id, name: item.name, price: item.price })}
    </div>
  `;
}

function renderMenuSections(containerEl, sections) {
  let html = "";

  for (const { key, type } of sections) {
    const section = MENU_DATA[key];
    if (!section || !section.items) continue;

    const visual = MENU_SECTION_IMAGES[key];
    html += `<div class="menu-section${visual ? " has-visual" : ""}${type === "extras" ? " menu-section-extras" : ""}" id="section-${section.id}" data-section-id="${section.id}">`;
    html += `<div class="menu-section-header${visual ? " has-image" : ""}${type === "extras" ? " extras-section-header" : ""}">
      <h2 class="menu-section-title">${section.categoryName}</h2>
      ${section.subtitle ? `<span class="menu-section-subtitle">${section.subtitle}</span>` : ""}
      ${section.description ? `<p class="menu-section-desc">${section.description}</p>` : ""}
      ${type === "extras" ? `<span class="extras-count">${section.items.length} tillval</span>` : ""}
      ${visual ? `<figure class="menu-section-visual"><img src="${visual.src}" alt="${visual.alt}" width="1536" height="1024" loading="lazy" decoding="async" /><figcaption>AI-illustration</figcaption></figure>` : ""}
    </div>`;

    if (type === "mixed-plate") {
      html += `<div class="mixed-plate-grid">`;
      section.items.forEach(item => { html += renderMixedPlateCard(item); });
      html += `</div>`;
    } else if (type === "extras" || type === "drinks") {
      const renderFn = type === "drinks" ? renderDrinkRow : renderExtraRow;
      html += `<div class="extras-list${type === "extras" ? " extras-card-grid" : ""}">`;
      section.items.forEach(item => { html += renderFn(item); });
      html += `</div>`;
    } else {
      html += `<div class="menu-cards-grid">`;
      section.items.forEach(item => { html += renderMenuCard(item, section.categoryName); });
      html += `</div>`;
    }

    html += `</div>`;
  }

  containerEl.innerHTML = html;
  initReveal();
}

function applyMenuFilter() {
  const allCards = document.querySelectorAll(".menu-card, .extra-row, .drink-row");
  const allSections = document.querySelectorAll(".menu-section");

  allCards.forEach(card => {
    const cats = (card.dataset.categories || "").split(" ");
    const name = card.dataset.name || "";
    const code = card.dataset.code || "";
    const matchFilter = activeFilter === "alla" || cats.includes(activeFilter);
    const matchSearch = !searchQuery ||
      name.includes(searchQuery.toLowerCase()) ||
      code.includes(searchQuery.toLowerCase());

    card.style.display = (matchFilter && matchSearch) ? "" : "none";
  });

  // Hide sections with no visible items
  allSections.forEach(section => {
    const visible = section.querySelectorAll(".menu-card:not([style*='none']), .extra-row:not([style*='none']), .drink-row:not([style*='none'])");
    section.style.display = visible.length > 0 && (activeCategory === "all" || section.dataset.sectionId === activeCategory) ? "" : "none";
  });
  const activePanel = document.querySelector('[role="tabpanel"]:not([hidden])');
  const emptyState = document.getElementById("menu-empty-state");
  if (emptyState && activePanel) {
    emptyState.hidden = [...activePanel.querySelectorAll(".menu-section")].some(section => section.style.display !== "none");
    const count = [...activePanel.querySelectorAll(".menu-section")].filter(section => section.style.display !== "none").reduce((sum, section) => sum + [...section.querySelectorAll(".menu-card, .extra-row, .drink-row")].filter(card => card.style.display !== "none").length, 0);
    document.getElementById("menu-result-count").textContent = `${count} alternativ i menyn`;
  }
}

// ============================================================
// FILTER & SEARCH UI
// ============================================================

function renderFilters() {
  const filterBar = document.getElementById("menu-filter-bar");
  if (!filterBar) return;

  filterBar.innerHTML = ALL_FILTERS.map(f =>
    `<button class="filter-btn${f.id === "alla" ? " active" : ""}" data-filter="${f.id}" aria-pressed="${f.id === "alla"}">${f.label}</button>`
  ).join("");

  filterBar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.setAttribute("aria-pressed", String(b === btn)));
      activeFilter = btn.dataset.filter;
      applyMenuFilter();
      animateMenuResults();
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("menu-search");
  if (!searchInput) return;
  searchInput.addEventListener("input", e => {
    searchQuery = e.target.value.trim().toLowerCase();
    applyMenuFilter();
  });
}

// ============================================================
// CHECKOUT FORM
// ============================================================

function clearFormErrors(form) {
  form.querySelectorAll(".form-error").forEach(error => error.remove());
  form.querySelectorAll(".has-error").forEach(group => group.classList.remove("has-error"));
}

function setFieldError(field, message) {
  if (!field) return;
  const group = field.closest(".form-group");
  group?.classList.add("has-error");
  field.setAttribute("aria-invalid", "true");
  const error = document.createElement("span");
  error.className = "form-error";
  error.textContent = message;
  group?.appendChild(error);
}

function initInlineErrorClearing(form) {
  form.addEventListener("input", event => {
    const field = event.target.closest("input, textarea, select");
    if (!field) return;
    const group = field.closest(".form-group");
    group?.classList.remove("has-error");
    group?.querySelector(".form-error")?.remove();
    field.removeAttribute("aria-invalid");
  });
}

function initCheckoutForm() {
  const form = document.getElementById("order-form");
  if (!form) return;
  initInlineErrorClearing(form);

  form.addEventListener("submit", e => {
    e.preventDefault();
    clearFormErrors(form);
    if (cart.length === 0) {
      showToast("Din varukorg är tom. Lägg till minst en rätt.");
      return;
    }

    const customerInfo = {
      name: form.querySelector('[name="customer-name"]').value.trim(),
      phone: form.querySelector('[name="customer-phone"]').value.trim(),
      pickupTime: form.querySelector('[name="pickup-time"]').value.trim(),
      comment: form.querySelector('[name="comment"]').value.trim(),
      allergies: form.querySelector('[name="allergies"]').value.trim()
    };

    const required = [
      [form.querySelector('[name="customer-name"]'), customerInfo.name, "Ange ditt namn."],
      [form.querySelector('[name="customer-phone"]'), customerInfo.phone, "Ange ditt telefonnummer."],
      [form.querySelector('[name="pickup-time"]'), customerInfo.pickupTime, "Ange önskad upphämtningstid."]
    ];
    const invalid = required.filter(([, value]) => !value);
    invalid.forEach(([field,, message]) => setFieldError(field, message));
    if (invalid.length) {
      invalid[0][0]?.focus();
      return;
    }

    submitOrder(customerInfo);
  });
}

// ============================================================
// BOOKING FORM
// ============================================================

function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;
  initInlineErrorClearing(form);

  // Set min date to today
  const dateInput = form.querySelector('[name="booking-date"]');
  if (dateInput) {
    const now = new Date();
    // Format as YYYY-MM-DD in Stockholm time
    const today = now.toLocaleDateString("sv-SE").replace(/\//g, "-");
    dateInput.min = today;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    clearFormErrors(form);

    const bookingInfo = {
      name: form.querySelector('[name="booking-name"]').value.trim(),
      phone: form.querySelector('[name="booking-phone"]').value.trim(),
      date: formatBookingDate(form.querySelector('[name="booking-date"]').value),
      time: form.querySelector('[name="booking-time"]').value.trim(),
      guests: form.querySelector('[name="booking-guests"]').value.trim(),
      wishes: form.querySelector('[name="booking-wishes"]').value.trim()
    };

    const required = [
      [form.querySelector('[name="booking-name"]'), bookingInfo.name, "Ange ditt namn."],
      [form.querySelector('[name="booking-phone"]'), bookingInfo.phone, "Ange ditt telefonnummer."],
      [form.querySelector('[name="booking-date"]'), bookingInfo.date, "Välj ett datum."],
      [form.querySelector('[name="booking-time"]'), bookingInfo.time, "Välj en tid."],
      [form.querySelector('[name="booking-guests"]'), bookingInfo.guests, "Ange antal personer."]
    ];
    const invalid = required.filter(([, value]) => !value);
    invalid.forEach(([field,, message]) => setFieldError(field, message));
    if (invalid.length) {
      invalid[0][0]?.focus();
      return;
    }

    submitBooking(bookingInfo);
  });
}

function formatBookingDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("sv-SE", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "Europe/Stockholm" });
}

// Map load is handled by the inline script at bottom of index.html

// ============================================================
// WA NOT CONFIGURED MODAL
// ============================================================

function initWAModal() {
  const modal = document.getElementById("wa-not-configured-modal");
  if (!modal) return;
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("active");
  });
  modal.querySelector(".modal-close")?.addEventListener("click", () => modal.classList.remove("active"));
}

// ============================================================
// MENU TABS (Thai / Sushi)
// ============================================================

function initMenuTabs() {
  const tabs = document.querySelectorAll(".menu-tab-btn");
  const thaiContainer = document.getElementById("thai-menu-container");
  const sushiContainer = document.getElementById("sushi-menu-container");

  if (!tabs.length || !thaiContainer || !sushiContainer) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      tabs.forEach(t => t.setAttribute("aria-selected", String(t === tab)));

      const target = tab.dataset.tab;
      thaiContainer.hidden = target !== "thai";
      sushiContainer.hidden = target !== "sushi";
      syncMenuBrowser();
      // A category from the previous menu should not hide the newly selected menu.
      activeFilter = "alla";
      document.querySelectorAll(".filter-btn").forEach(button => {
        const selected = button.dataset.filter === "alla";
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      applyMenuFilter();
      animateMenuResults();
    });
    tab.addEventListener("keydown", event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? tabs[0] : event.key === "End" ? tabs[tabs.length - 1] : [...tabs].find(candidate => candidate !== tab);
      next.click();
      next.focus();
    });
  });
}

// ============================================================
// INIT
// ============================================================

function initBistroMotion() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("motion-entered");
      observer.unobserve(entry.target);
    });
  }, { threshold: .15 });
  const revealGroups = [
    [".bistro-section-heading, .catalog-heading, #bestall .reveal:first-child, #boka-bord .reveal:first-child, #hitta-hit .reveal:first-child", ""],
    [".bistro-dish, .order-form-card, .about-facts, .booking-info, .location-info", "left"],
    [".cart-preview-card, .about-content, .booking-form-card, .map-wrap", "right"]
  ];
  revealGroups.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach(element => {
      element.classList.add("motion-reveal");
      if (direction) element.dataset.motion = direction;
      observer.observe(element);
    });
  });
  document.querySelectorAll(".bistro-dishes, .menu-collection, .menu-section-visual, .extras-card-grid, .about-facts, .footer-credit").forEach(element => observer.observe(element));
  requestAnimationFrame(() => document.body.classList.add("motion-ready"));
  const menuObserver = new IntersectionObserver(entries => {
    document.body.classList.toggle("browsing-menu", entries[0].isIntersecting);
  }, { rootMargin: "-100px 0px -80px 0px", threshold: 0 });
  menuObserver.observe(document.getElementById("menu"));
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) document.getAnimations().forEach(animation => animation.cancel());
  });
}

function initPageIntro() {
  const intro = document.querySelector(".page-intro");
  if (!intro) return;
  if (motionPreference.matches) { intro.remove(); return; }
  setTimeout(() => intro.classList.add("is-leaving"), 520);
  setTimeout(() => intro.remove(), 1250);
}

function initClickFeedback() {
  const rippleSelector = ".bistro-button, .btn-order, .catalog-checkout, .catalog-add-btn, .add-btn, .btn-submit-order, .btn-submit-booking, .btn-map, .btn-call, .modal-call-btn, .mobile-cart-bar";
  document.addEventListener("pointerdown", event => {
    if (motionPreference.matches || event.button !== 0) return;
    const target = event.target.closest(rippleSelector);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "click-ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  });
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  const circle = btn.querySelector(".progress-bar");
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  if (circle) {
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = String(circumference);
  }
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    if (circle) {
      circle.style.strokeDashoffset = String(circumference - (progress * circumference));
    }
    if (scrollTop > 350) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  window.addEventListener("scroll", () => {
    const scrollPos = window.scrollY + 140;
    let currentId = "";
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute("id");
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href === `#${currentId}`) {
          link.classList.add("active");
        } else if (!link.dataset.menuJump) {
          link.classList.remove("active");
        }
      });
    }
  }, { passive: true });
}

document.addEventListener("DOMContentLoaded", () => {
  initPageIntro();
  initNavigationObservers();
  initClickFeedback();
  initReveal();
  initBackToTop();
  initScrollSpy();

  // Menu
  const thaiContainer = document.getElementById("thai-menu-container");
  if (thaiContainer) renderMenuSections(thaiContainer, menuSections);

  const sushiContainer = document.getElementById("sushi-menu-container");
  if (sushiContainer) renderMenuSections(sushiContainer, sushiSections);

  renderFilters();
  initSearch();
  initMenuTabs();
  syncMenuBrowser();
  applyMenuFilter();
  document.getElementById("menu-category").addEventListener("change", event => {
    activeCategory = event.target.value;
    applyMenuFilter();
    animateMenuResults();
  });
  document.querySelectorAll("[data-menu-family]").forEach(link => {
    link.addEventListener("click", () => {
      searchQuery = "";
      document.getElementById("menu-search").value = "";
      document.querySelector(`[data-tab="${link.dataset.menuFamily}"]`).click();
      document.querySelector(`[data-filter="${link.dataset.menuFilter}"]`).click();
    });
  });
  document.getElementById("reset-menu-filters")?.addEventListener("click", () => {
    searchQuery = "";
    activeCategory = "all";
    document.getElementById("menu-category").value = "all";
    document.getElementById("menu-search").value = "";
    document.querySelector('[data-filter="alla"]').click();
    document.getElementById("menu-search").focus();
  });

  // Forms
  initCheckoutForm();
  initBookingForm();

  // UI
  initWAModal();
  initBistroMotion();

  // Menu sections are rendered above the static content, so restore deep links
  // only after their final height is known.
  if (window.location.hash) {
    const anchorId = decodeURIComponent(window.location.hash.slice(1));
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      document.getElementById(anchorId)?.scrollIntoView({ block: "start", behavior: "auto" });
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    }));
  }

  // Respects reduced motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reduced-motion");
  }
});
