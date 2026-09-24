// AI MONOLOG — SELFHEAL
// Самоправка: память + IndexedDB + GitHub

const SelfHeal = (() => {

  // ─── IndexedDB ───
  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open("monolog", 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("code")) {
          db.createObjectStore("code", { keyPath: "id" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveToIndexedDB(code) {
    try {
      const db = await openDB();
      const tx = db.transaction("code", "readwrite");
      tx.objectStore("code").put({ id: "source", value: code });
      return true;
    } catch (e) {
      console.warn("[selfheal] indexedDB save error:", e);
      return false;
    }
  }

  async function loadFromIndexedDB() {
    try {
      const db = await openDB();
      const tx = db.transaction("code", "readonly");
      const result = tx.objectStore("code").get("source");
      return new Promise((resolve) => {
        result.onsuccess = () => resolve(result.result ? result.result.value : null);
        result.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  // ─── GitHub API ───
  async function saveToGitHub(code, token, user, repo, path) {
    try {
      const url = "https://api.github.com/repos/" + user + "/" + repo + "/contents/" + path;
      const current = await fetch(url, {
        headers: { "Authorization": "token " + token }
      }).then(r => r.json());

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          "Authorization": "token " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "selfheal: auto-fix " + new Date().toISOString(),
          content: btoa(unescape(encodeURIComponent(code))),
          sha: current.sha
        })
      });
      return res.ok;
    } catch (e) {
      console.warn("[selfheal] github save error:", e);
      return false;
    }
  }

  // ─── Очередь для офлайна ───
  async function queueForSync(code) {
    try {
      const db = await openDB();
      const tx = db.transaction("code", "readwrite");
      tx.objectStore("code").put({ id: "queue", value: code });
    } catch (e) {}
  }

  async function getQueued() {
    try {
      const db = await openDB();
      const tx = db.transaction("code", "readonly");
      const result = tx.objectStore("code").get("queue");
      return new Promise((resolve) => {
        result.onsuccess = () => resolve(result.result ? result.result.value : null);
        result.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  }

  async function clearQueue() {
    try {
      const db = await openDB();
      const tx = db.transaction("code", "readwrite");
      tx.objectStore("code").delete("queue");
    } catch (e) {}
  }

  // ─── Правила самоправки ───
  const fixes = {
    "Can't find variable: pulse": function(code) {
      return code.replace(
        /function tick\(\)\s*\{/,
        "function tick() {\n  var pulse = 0;"
      );
    },
    "Can't find variable: S": function(code) {
      return code.replace(
        /function tick\(\)\s*\{/,
        "function tick() {\n  if (typeof S === 'undefined') return;"
      );
    },
    "t is not defined": function(code) {
      return code.replace(
        /S\.t\s*\+=\s*1;/g,
        "if (typeof S !== 'undefined') S.t += 1;"
      );
    },
    "Monolog is not defined": function(code) {
      return code.replace(
        /<script src="\/static\/monolog\.js"><\/script>/,
        '<script src="/static/monolog.js?v=' + Date.now() + '"></script>'
      );
    }
  };

  function applyFix(code, error) {
    for (var pattern in fixes) {
      if (error.indexOf(pattern) !== -1) {
        console.log("[selfheal] applying fix for:", pattern);
        return fixes[pattern](code);
      }
    }
    return null;
  }

  // ─── Главная функция ───
  async function heal(error, currentCode, config) {
    // 1. применить правку
    var fixed = applyFix(currentCode, error);
    if (!fixed) {
      console.warn("[selfheal] no fix for:", error);
      return null;
    }

    // 2. сохранить в IndexedDB
    await saveToIndexedDB(fixed);

    // 3. сохранить в GitHub (если есть сеть и токен)
    if (navigator.onLine && config.token) {
      var ok = await saveToGitHub(
        fixed,
        config.token,
        config.user,
        config.repo,
        config.path
      );
      if (!ok) {
        await queueForSync(fixed);
      }
    } else {
      await queueForSync(fixed);
    }

    // 4. перезагрузить
    console.log("[selfheal] reloading with fixed code");
    document.open();
    document.write(fixed);
    document.close();

    return fixed;
  }

  // ─── Sync при возврате в сеть ───
  window.addEventListener("online", async () => {
    var queued = await getQueued();
    if (queued && window.__config && window.__config.token) {
      var ok = await saveToGitHub(
        queued,
        window.__config.token,
        window.__config.user,
        window.__config.repo,
        window.__config.path
      );
      if (ok) {
        await clearQueue();
      }
    }
  });

  return {
    heal: heal,
    loadFromIndexedDB: loadFromIndexedDB,
    saveToIndexedDB: saveToIndexedDB,
  };

})();