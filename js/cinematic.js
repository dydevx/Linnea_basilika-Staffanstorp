(function () {
  "use strict";

  const allItems = Object.values(MENU_DATA).flatMap(section => section.items || []);
  const itemsById = new Map(allItems.map(item => [item.id, item]));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const imageRules = [
    [/^meny-b\b/i, "assets/images/generated/mixed-plate-b.png"],
    [/^meny-c\b/i, "assets/images/generated/mixed-plate-c.png"],
    [/^meny-d\b/i, "assets/images/generated/mixed-plate-d.png"],
    [/huvud-39/i, "assets/images/generated/crispy-salmon.png"],
    [/huvud-46|spett|satay/i, "assets/images/generated/chicken-satay-landscape.png"],
    [/gron-curry-14|gul-curry-25|rod-curry-15/i, "assets/images/generated/vegetable-tofu-curry.png"],
    [/maki-spicy-tuna/i, "assets/images/generated/spicy-tuna-roll.png"],
    [/nigiri-/i, "assets/images/generated/nigiri-assortment.png"],
    [/side-|huvud-67/i, "assets/images/generated/asian-sides.png"],
    [/pad-thai/, "assets/images/generated/hero-pad-thai.png"],
    [/stark-basilika|basil/i, "assets/images/ai/thai-basil.png"],
    [/gron-curry|green/i, "assets/images/ai/green-curry.png"],
    [/gul-curry|yellow/i, "assets/images/ai/yellow-curry.png"],
    [/rod-curry|red/i, "assets/images/ai/red-curry.png"],
    [/dragon/i, "assets/images/generated/dragon-grill-roll.png"],
    [/crunchy|tempura|friterad/i, "assets/images/ai/crunchy-maki.png"],
    [/bowl/i, "assets/images/ai/sushi-bowl.png"],
    [/maki|nigiri|sushi|mix-/i, "assets/images/ai/sushi.png"],
    [/wok|nudlar|noodles|huvud-65/i, "assets/images/ai/wok-noodles.png"],
    [/vitlok|garlic|oxfile|biff|huvud-45|huvud-47/i, "assets/images/ai/garlic-beef.png"],
    [/lax|salmon|huvud-39/i, "assets/images/generated/dragon-grill-roll.png"],
    [/ank|duck|huvud-54|huvud-56/i, "assets/images/ai/thai-basil.png"],
    [/meny-|mixed/i, "assets/images/ai/mixed-plate.png"]
  ];

  const signatureImages = {
    "pad-thai-58": "assets/images/generated/signature-pad-thai.jpg",
    "stark-basilika-26": "assets/images/generated/signature-thai-basil.jpg",
    "gron-curry-10": "assets/images/generated/signature-green-curry.jpg",
    "huvud-46": "assets/images/generated/chicken-satay-landscape.png",
    "maki-dragon": "assets/images/generated/signature-dragon-roll.jpg",
    "mix-10": "assets/images/generated/signature-sushi-mix.jpg"
  };

  window.getDishImage = function getDishImage(item) {
    if (!item) return "assets/images/ai/mixed-plate.png";
    if (item.image) return item.image;
    const lookup = `${item.id || ""} ${item.name || ""} ${(item.category || []).join(" ")}`.toLowerCase();
    const match = imageRules.find(([pattern]) => pattern.test(lookup));
    return match ? match[1] : "assets/images/ai/mixed-plate.png";
  };

  function normalizeVisibleText(value) {
    return String(value || "").replace(/[–—]/g, "-");
  }

  function getItem(id) {
    return itemsById.get(id);
  }

  function cartPayload(item) {
    return {
      id: item.id,
      code: item.code || null,
      name: normalizeVisibleText(item.fullName || item.name),
      price: item.price,
      image: window.getDishImage(item)
    };
  }

  function renderSignatures() {
    const grid = document.getElementById("signature-grid");
    if (!grid) return;
    const ids = ["pad-thai-58", "stark-basilika-26", "gron-curry-10", "huvud-46", "maki-dragon", "mix-10"];
    grid.innerHTML = ids.map((id, index) => {
      const item = getItem(id);
      if (!item) return "";
      const shortNames = {
        "pad-thai-58": "Pad Thai",
        "stark-basilika-26": "Stark Basilika",
        "gron-curry-10": "Grön Curry",
        "huvud-46": "Kycklingspett",
        "maki-dragon": "Dragon Grill Roll",
        "mix-10": "Sushi Mix"
      };
      const payload = encodeURIComponent(JSON.stringify(cartPayload(item)));
      return `<article class="signature-card" style="--reveal-delay:${index * 55}ms">
        <button class="signature-media" type="button" data-open-dish="${item.id}" aria-label="Visa ${escapeHtml(shortNames[id])}">
          <img src="${signatureImages[id]}" alt="${escapeHtml(shortNames[id])}" loading="lazy" decoding="async">
        </button>
        <div class="signature-copy">
          <h3>${escapeHtml(shortNames[id])}</h3>
          <span class="signature-price">${item.price} kr</span>
          <p>${escapeHtml(normalizeVisibleText(item.description || ""))}</p>
          <button class="add-btn catalog-add-btn" type="button" data-cart-item="${payload}" aria-label="Lägg till ${escapeHtml(shortNames[id])}"><span>Lägg till</span></button>
        </div>
      </article>`;
    }).join("");
  }

  let activeDish = null;
  let dishQuantity = 1;
  let dishReturnFocus = null;

  function openDish(item, trigger) {
    const modal = document.getElementById("dish-modal");
    if (!modal || !item || item.price == null) return;
    activeDish = item;
    dishQuantity = 1;
    dishReturnFocus = trigger || document.activeElement;
    const image = document.getElementById("dish-modal-image");
    image.src = window.getDishImage(item);
    image.alt = normalizeVisibleText(item.fullName || item.name);
    document.getElementById("dish-modal-code").textContent = item.code ? `NR ${item.code}` : "LINNEA & BASILIKA";
    document.getElementById("dish-modal-title").textContent = normalizeVisibleText(item.fullName || item.name);
    document.getElementById("dish-modal-description").textContent = normalizeVisibleText(item.description || (item.dishes || []).join(", "));
    document.getElementById("dish-modal-spicy").innerHTML = item.spicyLevel ? `<span class="spicy-badge">${item.spicyLevel === 1 ? "Milt stark" : item.spicyLevel === 2 ? "Stark" : "Mycket stark"}</span>` : "";
    document.getElementById("dish-modal-price").textContent = `${item.price} kr`;
    document.getElementById("dish-modal-quantity").textContent = "1";
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".dish-modal-close")?.focus();
  }

  function closeDish() {
    const modal = document.getElementById("dish-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    activeDish = null;
    document.body.style.overflow = "";
    dishReturnFocus?.focus?.({ preventScroll: true });
  }

  function initDishModal() {
    const modal = document.getElementById("dish-modal");
    if (!modal) return;
    document.addEventListener("click", event => {
      const openTrigger = event.target.closest("[data-open-dish]");
      if (openTrigger) {
        openDish(getItem(openTrigger.dataset.openDish), openTrigger);
        return;
      }
      const card = event.target.closest(".catalog-menu-card[data-menu-id]");
      if (card && !event.target.closest("[data-cart-item]")) openDish(getItem(card.dataset.menuId), card);
    });
    document.addEventListener("keydown", event => {
      const card = event.target.closest?.(".catalog-menu-card[data-menu-id]");
      if (card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openDish(getItem(card.dataset.menuId), card);
      }
      if (event.key === "Escape" && !modal.hidden) closeDish();
    });
    modal.querySelectorAll("[data-close-dish-modal]").forEach(button => button.addEventListener("click", closeDish));
    modal.querySelectorAll("[data-dish-qty]").forEach(button => button.addEventListener("click", () => {
      dishQuantity = Math.max(1, Math.min(20, dishQuantity + Number(button.dataset.dishQty)));
      document.getElementById("dish-modal-quantity").textContent = String(dishQuantity);
    }));
    document.getElementById("dish-modal-add")?.addEventListener("click", () => {
      if (!activeDish) return;
      addToCart({ ...cartPayload(activeDish), quantity: dishQuantity });
      closeDish();
    });
  }

  function initGallery() {
    const lightbox = document.getElementById("gallery-lightbox");
    if (!lightbox) return;
    const image = lightbox.querySelector("img");
    document.querySelectorAll("[data-lightbox-src]").forEach(button => button.addEventListener("click", () => {
      image.src = button.dataset.lightboxSrc;
      image.alt = button.querySelector("img")?.alt || "Matbild";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      lightbox.querySelector("button")?.focus();
    }));
    const close = () => { lightbox.hidden = true; image.src = ""; document.body.style.overflow = ""; };
    lightbox.addEventListener("click", event => { if (event.target === lightbox || event.target.closest(".gallery-lightbox-close")) close(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && !lightbox.hidden) close(); });
  }

  function initCinematicReveals() {
    const elements = document.querySelectorAll(".signature-card, .gallery-tile");
    if (reduceMotion.matches) {
      elements.forEach(element => element.classList.add("motion-entered"));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("motion-entered");
        observer.unobserve(entry.target);
      });
    }, { threshold: .14 });
    elements.forEach(element => observer.observe(element));
  }

  function initMenuJumps() {
    document.querySelectorAll('[data-menu-jump="sushi"]').forEach(link => link.addEventListener("click", () => {
      setTimeout(() => document.getElementById("sushi-tab")?.click(), 0);
    }));
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderSignatures();
    initDishModal();
    initGallery();
    initCinematicReveals();
    initMenuJumps();
  });
})();
