const pages = await fetch("http://127.0.0.1:9223/json").then(response => response.json());
const page = pages.find(candidate => candidate.type === "page" && candidate.url === "http://127.0.0.1:4173/");
if (!page) throw new Error("Local site page not found");

const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let commandId = 0;

socket.onmessage = event => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  pending.get(message.id)(message);
  pending.delete(message.id);
};

function call(method, params = {}) {
  return new Promise(resolve => {
    const id = ++commandId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
}

await new Promise(resolve => { socket.onopen = resolve; });
await call("Runtime.enable");
await call("Page.enable");

async function evaluate(expression) {
  const response = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (response.result.exceptionDetails) throw new Error(response.result.exceptionDetails.text);
  return response.result.result.value;
}

const results = {};
results.initial = await evaluate(`({
  width: innerWidth,
  scrollWidth: document.documentElement.scrollWidth,
  height: document.documentElement.scrollHeight,
  signatures: document.querySelectorAll('.signature-card').length,
  menuCards: document.querySelectorAll('.catalog-menu-card').length,
  sections: document.querySelectorAll('main > section').length
})`);

results.modal = await evaluate(`(() => {
  document.querySelector('.signature-media').click();
  return {
    open: !document.getElementById('dish-modal').hidden,
    title: document.getElementById('dish-modal-title').textContent,
    price: document.getElementById('dish-modal-price').textContent
  };
})()`);

results.cart = await evaluate(`(() => {
  document.querySelector('[data-dish-qty="1"]').click();
  document.getElementById('dish-modal-add').click();
  return {
    count: getCartCount(),
    total: getCartTotal(),
    drawerItems: document.querySelectorAll('.cart-item').length,
    thumbnail: Boolean(document.querySelector('.cart-item-thumb'))
  };
})()`);

results.menu = await evaluate(`(async () => {
  document.querySelector('[data-menu-jump="sushi"]').click();
  await new Promise(resolve => setTimeout(resolve, 25));
  return {
    sushiActive: document.getElementById('sushi-tab').classList.contains('active'),
    sushiVisible: !document.getElementById('sushi-menu-container').hidden
  };
})()`);

await call("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await call("Page.reload", { ignoreCache: true });
await new Promise(resolve => setTimeout(resolve, 1200));
results.mobile = await evaluate(`(() => {
  const button = document.getElementById('hamburger');
  const before = getComputedStyle(button).display;
  button.click();
  return {
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    hamburgerDisplay: before,
    menuOpen: document.getElementById('mobile-menu').classList.contains('open'),
    expanded: button.getAttribute('aria-expanded'),
    heroHeight: Math.round(document.getElementById('welcome').getBoundingClientRect().height)
  };
})()`);

console.log(JSON.stringify(results, null, 2));
socket.close();
