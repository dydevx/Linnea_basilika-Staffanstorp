# Linnea & Basilika Staffanstorp – Webbplats

Premium restaurant website for **Linnea & Basilika Staffanstorp** – Asian Fusion, Thai & Sushi.

---

## ⚡ Quick Start

1. Open `index.html` in a web browser — the site works immediately as a static website.
2. To deploy: upload the entire `linnea-basilika/` folder to GitHub Pages, Netlify, or any static hosting.

---

## 🔧 Configuration — Important First Step

### Set WhatsApp Number

Before going live, configure the official WhatsApp number in [`js/config.js`](js/config.js):

```js
WHATSAPP_NUMBER: "46701234567", // Replace with the actual number
```

- Format: international format **without** `+` or spaces
- Example: `+46 70 123 45 67` → `"46701234567"`
- **Do NOT** use the landline `046-39 98 88` — this is a fixed-line number
- Leave empty (`""`) until confirmed — the site will fall back to a phone call modal

---

## 📁 Project Structure

```
linnea-basilika/
├── index.html              Main HTML file
├── css/
│   ├── style.css           Main styles (text-first catalog)
│   └── responsive.css      Responsive breakpoints
├── js/
│   ├── config.js           ⚙️ Restaurant config & WhatsApp number
│   ├── menu-data.js        All menu items with verified prices
│   ├── cart.js             Shopping cart (localStorage)
│   ├── whatsapp.js         WhatsApp message builder
│   └── script.js           Navigation, UI, animations
└── assets/
    └── images/             Source references; not displayed on the website
```

---

## ✅ Features

### Menu
- Full Thai menu: Gästernas Favoriter, Stark Basilika, Vitlöksmarinerad, Curryer (3 typer), Pad Thai, Wokade Nudlar, Huvudrätter, Extras, Dryck
- Full Sushi & Bowls menu: Maki Rolls, Crunchy Fried Maki, Nigiri Mix, Nigiri on the Side, Sushi Mix Meny, Sushi Bowls, Sides, Upgrades, Dryck
- Text-first dish catalog with name, description, takeaway price, and add-to-cart action; menu photographs are not displayed
- Search by name or dish number
- Filter by category (Kyckling, Räkor, Curry, Sushi, Bowls, etc.)
- Spicy level indicators 🌶🌶🌶
- Items with unconfirmed prices are clearly marked

### Shopping Cart
- Add/remove items with +/- buttons
- Persistent via `localStorage` — survives page refresh
- Real-time total calculation
- Live cart summary beside the menu on desktop, with quantity controls and a slide-in cart drawer

### WhatsApp Ordering
- Generates a complete Swedish order message
- Includes dish names, codes, quantities, prices, and total
- Customer form: name, phone, pickup time, comments, allergies
- **Safe:** only works when `WHATSAPP_NUMBER` is configured

### Table Booking
- Date picker (no past dates)
- Time input (restaurant hours)
- WhatsApp message with full booking details
- Clear notice: *"Din bokning är inte bekräftad förrän restaurangen har svarat"*

### Design
- Dark editorial Asian Fusion theme with a text-first ordering catalog
- Color scheme: `#111310` bg · `#E87536` orange · `#78B85A` green
- Fonts: Outfit (headings) + Inter (body)
- Sticky navigation with glassmorphism scroll effect
- Smooth scroll-reveal animations
- Respects `prefers-reduced-motion`
- Mobile hamburger menu
- WhatsApp & Call floating buttons
- Google Maps lazy-load (click to activate)

### SEO & Performance
- Semantic HTML5
- Schema.org Restaurant markup
- Open Graph meta tags
- Lazy loading for images and maps
- No external dependencies (except Google Fonts)
- Works on GitHub Pages without backend

---

## 🌍 GitHub Pages Deployment

1. Push the `linnea-basilika/` folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to the branch and folder containing `index.html`
4. Your site will be live at `https://username.github.io/repo-name/`

---

## 📝 Menu Data Notes

Menu data was transcribed and verified from physical menu pages. Those images are reference material only and are not displayed on the website:
- Linnea & Basilika menu images (7 photos)
- Sushi & Bowls (A&M) menu images (7 photos)

Drinks are stored separately for each menu because prices differ slightly between the two menus.

Items with `price: null` (Tempura Räkor, Tempura Kyckling, Popcorn Kyckling bowls) have unconfirmed prices and **cannot be added to cart** — they show "Kontakta restaurangen".

---

## 📞 Restaurant Contact

**Linnea & Basilika Staffanstorp**  
Handelsvägen 38, 245 34 Staffanstorp  
Tel: 046-39 98 88  
Öppet: Måndag–Söndag 11.00–21.00  
[Google Maps](https://maps.app.goo.gl/WmcdJfUKPup41jJ58)

---

*Webbdesign av HoangCaster*
