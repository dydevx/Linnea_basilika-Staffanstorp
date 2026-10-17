const pages = await fetch("http://127.0.0.1:9223/json").then(response => response.json());
const page = pages.find(candidate => candidate.type === "page" && candidate.url === "http://127.0.0.1:4173/");
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
const results = [];
for (const width of [375, 390, 430, 768, 1024, 1440, 1920]) {
  await call("Emulation.setDeviceMetricsOverride", { width, height: width < 768 ? 844 : 1080, deviceScaleFactor: 1, mobile: width < 768 });
  await new Promise(resolve => setTimeout(resolve, 80));
  const response = await call("Runtime.evaluate", {
    expression: `({viewport:innerWidth, content:document.documentElement.scrollWidth, overflow:document.documentElement.scrollWidth > innerWidth, navHeight:Math.round(document.getElementById('main-nav').getBoundingClientRect().height), heroHeight:Math.round(document.getElementById('welcome').getBoundingClientRect().height)})`,
    returnByValue: true
  });
  results.push({ requested: width, ...response.result.result.value });
}
console.log(JSON.stringify(results, null, 2));
socket.close();
