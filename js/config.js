/**
 * Linnea & Basilika Staffanstorp – Configuration
 * 
 * IMPORTANT: Set WHATSAPP_NUMBER to the restaurant's official WhatsApp number
 * in international format (e.g., "46701234567" for Swedish +46 70 123 45 67).
 * Do NOT use the landline 046-39 98 88 as WhatsApp.
 * Leave as empty string until confirmed.
 */
const CONFIG = {
  // WhatsApp number in international format WITHOUT + or spaces
  // Example: "46701234567"
  // Leave empty ("") until the restaurant confirms their WhatsApp number
  WHATSAPP_NUMBER: "",

  RESTAURANT_NAME: "Linnea & Basilika Staffanstorp",
  PHONE: "046-39 98 88",
  PHONE_INTL: "+46 46 39 98 88",
  PHONE_LINK: "tel:+4646399888",

  ADDRESS_STREET: "Handelsvägen 38",
  ADDRESS_ZIP: "245 34",
  ADDRESS_CITY: "Staffanstorp",
  ADDRESS_COUNTRY: "Sverige",

  OPENING_HOURS: "Måndag–Söndag: 11.00–21.00",
  OPEN_TIME: "11:00",
  CLOSE_TIME: "21:00",

  GOOGLE_MAPS_URL: "https://maps.app.goo.gl/WmcdJfUKPup41jJ58",
  GOOGLE_MAPS_EMBED: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2251.6255466547436!2d13.2332198!3d55.643328100000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4653992ee385186b%3A0x702c7420c140f84!2sLinnea%20%26%20Basilika%20Staffanstorp!5e0!3m2!1svi!2s!4v1791946890578!5m2!1svi!2s",

  // Prices on the menu are for takeaway (alla priser gäller vid take away)
  TAKEAWAY_NOTE: "Alla priser i menyn gäller vid take away.",

  // Last booking time (configurable – not assumed to be 21:00)
  // Set to null until restaurant confirms
  LAST_BOOKING_TIME: null,
};

