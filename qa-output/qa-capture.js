import { writeFileSync } from "node:fs";

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
await call("Page.enable");
await call("Runtime.enable");
await call("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });
await call("Page.reload", { ignoreCache: true });
await new Promise(resolve => setTimeout(resolve, 1800));

for (const [name, selector] of [
  ["signature", ".signature-showcase"],
  ["menu", "#menu"],
  ["about", "#om-oss"],
  ["gallery", "#galleri"],
  ["booking", "#boka-bord"],
  ["contact", "#hitta-hit"]
]) {
  await call("Runtime.evaluate", { expression: `document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start'});` });
  await new Promise(resolve => setTimeout(resolve, 320));
  const shot = await call("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  writeFileSync(new URL(`./${name}-view.png`, import.meta.url), Buffer.from(shot.result.data, "base64"));
}

socket.close();
