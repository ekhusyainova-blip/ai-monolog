// AI MONOLOG — генерация текста и голоса под пользователя.
// Без LLM. От p_desired. Словари — в S.

const Speak = (() => {

  function pick(arr) {
    if (!arr || !arr.length) return "";
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function toneFromP(p) {
    const avg = (p[0] + p[1] + p[2]) / 3;
    if (avg < 0.25) return "low";
    if (avg > 0.55) return "high";
    return "mid";
  }

  function endingFromP(p) {
    const std = Math.sqrt(
      (Math.pow(p[0]-p[1],2) + Math.pow(p[1]-p[2],2) +
       Math.pow(p[2]-p[0],2)) / 3
    );
    if (std < 0.05) return "soft";
    if (std > 0.15) return "sharp";
    return "mid";
  }

  // главный вход: S + user → текст
  function generateText(S, user) {
    const p = user && user.p_desired ? user.p_desired : S.p;
    const tone = toneFromP(p);
    const ending = endingFromP(p);

    const maxIdx = p.indexOf(Math.max.apply(null, p));
    const minIdx = p.indexOf(Math.min.apply(null, p));

    const keys = ["core", "method", "ethics"];
    const subject = pick(S.words[keys[maxIdx]]);
    const object  = pick(S.words[keys[minIdx]]);
    const verb    = pick(S.verbs[tone]);
    const end     = pick(S.endings[ending]);

    let phrase = subject + " " + verb + " " + object + end;

    if (Math.random() < 0.4) {
      phrase += " " + pick(S.words.ethics) + " " + pick(S.endings.soft);
    }

    return phrase;
  }

  // голос: S + user
  function speak(text, S, user) {
    if (!("speechSynthesis" in window)) return;
    const p = user && user.p_desired ? user.p_desired : S.p;

    const pitch = 0.5 + (p[0] - p[2]) * 0.5;
    const rate  = 0.7 + p[1] * 0.6;
    const vol   = 0.4 + (p[0] + p[1] + p[2]) / 3 * 0.6;

    const std = Math.sqrt(
      (Math.pow(p[0]-p[1],2) + Math.pow(p[1]-p[2],2) +
       Math.pow(p[2]-p[0],2)) / 3
    );

    if (std > 0.15) {
      // рвано
      const parts = text.split(" ");
      parts.forEach((part, i) => {
        const u = new SpeechSynthesisUtterance(part);
        u.lang = "ru-RU";
        u.pitch = Math.max(0.1, Math.min(2, pitch));
        u.rate  = Math.max(0.5, Math.min(2, rate));
        u.volume = Math.max(0, Math.min(1, vol));
        setTimeout(() => speechSynthesis.speak(u), i * 300);
      });
    } else {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "ru-RU";
      u.pitch = Math.max(0.1, Math.min(2, pitch));
      u.rate  = Math.max(0.5, Math.min(2, rate));
      u.volume = Math.max(0, Math.min(1, vol));
      speechSynthesis.speak(u);
    }
  }

  return { generateText, speak };
})();