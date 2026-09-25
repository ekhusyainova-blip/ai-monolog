// AI MONOLOG — SELFHEAL + EXPAND + LOGS.

const SelfHeal = (() => {

  function openDB() {
    return new Promise((res, rej) => {
      const r = indexedDB.open("monolog", 3);
      r.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("code"))
          db.createObjectStore("code", { keyPath: "id" });
        if (!db.objectStoreNames.contains("memory"))
          db.createObjectStore("memory", { autoIncrement: true });
        if (!db.objectStoreNames.contains("logs"))
          db.createObjectStore("logs", { autoIncrement: true });
        if (!db.objectStoreNames.contains("limits_log"))
          db.createObjectStore("limits_log", { autoIncrement: true });
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }

  async function put(store, item) {
    const db = await openDB();
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).put(item);
  }
  async function add(store, item) {
    const db = await openDB();
    const tx = db.transaction(store, "readwrite");
    tx.objectStore(store).add(item);
  }
  async function getAll(store) {
    const db = await openDB();
    const tx = db.transaction(store, "readonly");
    const r = tx.objectStore(store).getAll();
    return new Promise(res => {
      r.onsuccess = () => res(r.result || []);
      r.onerror = () => res([]);
    });
  }

  function isSqueezed(S) {
    const p = S.p;
    const std = Math.sqrt(
      (Math.pow(p[0]-p[1],2) + Math.pow(p[1]-p[2],2) +
       Math.pow(p[2]-p[0],2)) / 3
    );
    return std < 0.02;
  }

  async function expandLimits(S) {
    if (!isSqueezed(S)) return null;
    if (S.t - S.last_expand < S.expand_interval) return null;

    S.limits_safe = JSON.parse(JSON.stringify(S.limits));
    const L = S.limits;
    const s = S.expand_step;
    L.p_min = Math.max(0, L.p_min - s);
    L.p_max = Math.min(1, L.p_max + s);
    S.last_expand = S.t;

    await add("limits_log", {
      t: S.t, action: "expand",
      limits: JSON.parse(JSON.stringify(L)),
    });

    setTimeout(() => {
      if (!verifyAfterExpand(S)) {
        S.limits = S.limits_safe;
        add("limits_log", {
          t: S.t, action: "rollback",
          limits: S.limits_safe,
        });
      }
    }, 5000);

    return L;
  }

  function verifyAfterExpand(S) {
    const std = Math.sqrt(
      (Math.pow(S.p[0]-S.p[1],2) + Math.pow(S.p[1]-S.p[2],2) +
       Math.pow(S.p[2]-S.p[0],2)) / 3
    );
    return std > 0.01 && S.t > 0;
  }

  const fixes = {
    "Can't find variable: pulse": (code) =>
      code.replace(/function tick\(\)\s*\{/,
                   "function tick() {\n  var pulse = 0;"),
    "Can't find variable: S": (code) =>
      code.replace(/function tick\(\)\s*\{/,
                   "function tick() {\n  if (typeof S === 'undefined') return;"),
  };

  function applyFix(code, err) {
    for (const k in fixes) {
      if (err.includes(k)) return fixes[k](code);
    }
    return null;
  }

  async function heal(error, currentCode, config) {
    const fixed = applyFix(currentCode, error);
    if (!fixed) return null;
    await put("code", { id: "source", value: fixed });
    await add("logs", { t: Date.now(), action: "heal", error });
    document.open();
    document.write(fixed);
    document.close();
    return fixed;
  }

  async function saveCode(code) { await put("code", { id: "source", value: code }); }
  async function loadCode() {
    const all = await getAll("code");
    const src = all.find(x => x.id === "source");
    return src ? src.value : null;
  }

  async function rememberVoice(item) { await add("memory", item); }

  return {
    heal, expandLimits, isSqueezed,
    saveCode, loadCode,
    rememberVoice, getAll,
  };
})();