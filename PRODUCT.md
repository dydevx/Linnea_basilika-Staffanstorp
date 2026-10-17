# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Guests in and around Staffanstorp who want to browse the restaurant's menu and order takeaway.

## Product Purpose

Help guests choose dishes and prices from Linnea & Basilika Staffanstorp's menu, add them to a cart, and submit a takeaway order.

## Positioning

The website turns the restaurant's printed menu information into a searchable, selectable online menu. Menu photographs are source material, not website content.

## Operating Context

The website is a static site for a restaurant at Handelsvägen 38, 245 34 Staffanstorp. Menu copy and customer-facing content are in Swedish. Guests can browse Thai, sushi, and bowls menus, add items to a persistent cart, and submit orders through WhatsApp when configured. The restaurant is open daily from 11.00 to 21.00; takeaway menu prices are shown.

## Capabilities and Constraints

- The existing site supports menu search and category filters, cart quantities, price totals, takeaway orders, table booking, phone contact, and directions.
- Menu items and prices are recorded in `linnea-basilika/js/menu-data.js`; items whose prices are unconfirmed cannot be added to the cart.
- The WhatsApp number is currently unconfigured. Do not imply that a WhatsApp order has been sent or confirmed; phone contact remains available.
- Preserve the restaurant's verified contact details, opening hours, menu names, item descriptions, and prices.

## Evidence on Hand

- Verified menu item data and prices: `linnea-basilika/js/menu-data.js`.
- Restaurant address, telephone, opening hours, and map: `linnea-basilika/js/config.js` and `linnea-basilika/index.html`.
- Menu photographs are present under `linnea-basilika/assets/images/` and at the project root. They are source references for menu information and must not be displayed as menu images on the website.
- No verified WhatsApp ordering number is available in the current configuration.

## Product Principles

- Make dishes easy to compare and select without requiring guests to read photographed menus.
- Display verified menu information accurately; do not invent prices or ingredients.
- Keep the order total and item quantities clear before guests contact the restaurant.
- Make order and booking confirmation status explicit.
