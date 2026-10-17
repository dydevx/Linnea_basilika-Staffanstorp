/**
 * Linnea & Basilika – WhatsApp Integration
 * 
 * Generates properly formatted WhatsApp messages for orders and table bookings.
 * Only sends if CONFIG.WHATSAPP_NUMBER is configured.
 */

function openWhatsApp(message) {
  if (!CONFIG.WHATSAPP_NUMBER) {
    showWhatsAppNotConfigured();
    return false;
  }
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank", "noopener,noreferrer");
  return true;
}

function showWhatsAppNotConfigured() {
  const modal = document.getElementById("wa-not-configured-modal");
  if (modal) {
    modal.classList.add("active");
  } else {
    alert(
      "WhatsApp är inte konfigurerat ännu.\n\n" +
      "Ring oss istället: " + CONFIG.PHONE + "\n" +
      "Öppet: " + CONFIG.OPENING_HOURS
    );
  }
}

// ---- ORDER MESSAGE ----

function buildOrderMessage(customerInfo) {
  if (cart.length === 0) return null;

  const lines = [
    `Hej ${CONFIG.RESTAURANT_NAME}!`,
    "",
    "Jag vill gärna beställa följande för avhämtning:",
    ""
  ];

  cart.forEach((item, idx) => {
    const extrasTotal = (item.extras || []).reduce((s, e) => s + (e.price || 0), 0);
    const lineTotal = (item.price + extrasTotal) * item.quantity;
    lines.push(`${idx + 1}. ${item.name}${item.code ? ` (Nr ${item.code})` : ""}`);
    lines.push(`   Antal: ${item.quantity}`);
    lines.push(`   Pris: ${lineTotal} kr`);
    if ((item.extras || []).length > 0) {
      lines.push(`   Tillbehör: ${item.extras.map(e => e.name).join(", ")}`);
    }
    if (item.note) {
      lines.push(`   Önskemål: ${item.note}`);
    }
    lines.push("");
  });

  lines.push(`Totalt: ${getCartTotal()} kr`);
  lines.push("");
  lines.push(`Namn: ${customerInfo.name}`);
  lines.push(`Telefon: ${customerInfo.phone}`);
  lines.push(`Önskad upphämtningstid: ${customerInfo.pickupTime}`);

  if (customerInfo.comment) {
    lines.push("");
    lines.push(`Kommentar: ${customerInfo.comment}`);
  }
  if (customerInfo.allergies) {
    lines.push(`Allergier/önskemål: ${customerInfo.allergies}`);
  }

  lines.push("");
  lines.push("Vänligen bekräfta beställningen och upphämtningstiden.");
  lines.push("");
  lines.push("Tack!");

  return lines.join("\n");
}

function submitOrder(customerInfo) {
  const message = buildOrderMessage(customerInfo);
  if (!message) {
    alert("Din varukorg är tom. Lägg till minst en rätt innan du beställer.");
    return;
  }
  const opened = openWhatsApp(message);
  if (opened) {
    showOrderConfirmationHint();
  }
}

function showOrderConfirmationHint() {
  const hint = document.getElementById("order-sent-hint");
  if (hint) {
    hint.style.display = "block";
    hint.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// ---- BOOKING MESSAGE ----

function buildBookingMessage(bookingInfo) {
  const lines = [
    `Hej ${CONFIG.RESTAURANT_NAME}!`,
    "",
    "Jag skulle vilja boka ett bord.",
    "",
    `Namn: ${bookingInfo.name}`,
    `Datum: ${bookingInfo.date}`,
    `Tid: ${bookingInfo.time}`,
    `Antal personer: ${bookingInfo.guests}`,
    `Telefonnummer: ${bookingInfo.phone}`
  ];

  if (bookingInfo.wishes) {
    lines.push("");
    lines.push(`Önskemål: ${bookingInfo.wishes}`);
  }

  lines.push("");
  lines.push("Vänligen bekräfta om bordet är tillgängligt.");
  lines.push("");
  lines.push("Tack så mycket!");

  return lines.join("\n");
}

function submitBooking(bookingInfo) {
  const message = buildBookingMessage(bookingInfo);
  const opened = openWhatsApp(message);
  if (opened) {
    // Show unconfirmed notice
    const notice = document.getElementById("booking-unconfirmed-notice");
    if (notice) {
      notice.style.display = "block";
      notice.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

