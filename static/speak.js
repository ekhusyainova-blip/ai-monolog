// AI MONOLOG — генерация текста и голоса.
// Без LLM. На правилах. От p_desired.

const Speak = (() => {

  // --- ТЕКСТ ---

  // словари. нейтральные, без терминов
  const WORDS = {
    core:   ["ты", "я", "центр", "середина", "ось", "опора"],
    method: ["шаг", "дело", "движение", "путь", "ритм", "темп"],
    ethics: ["мы", "рядом", "вместе", "связь", "друг", "встреча"],
  };

  const VERBS = {
    low:  ["держишь", "стоишь", "молчишь", "ждёшь"],
    mid:  ["идёшь", "дышишь", "смотришь", "слушаешь"],
    high: ["летишь", "рвёшься", "кипишь", "сияешь"],
  };

  const ENDINGS = {
    soft:  [".", "...", " "],
    mid:   ["?", " — ", "."],
    sharp: ["!", ".", "?"],
  };

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // p_desired → слово
  function wordFromP(p, idx) {
    const keys = ["core", "method", "ethics"];
    return pick(WORDS[keys[idx]]);
  }

  // p_desired → тон
  function toneFromP(p) {
    const avg = (p[0] + p[1] + p[2]) / 3;
    if (avg < 0.25) return "low";
    if (avg > 0.55) return "high";
    return "mid";
  }

  // p_desired → окончание
  function endingFromP(p) {
    const std = Math.sqrt(
      (Math.pow(p[0]-p[1],2) + Math.pow(p[1]-p[2],2) +
       Math.pow(p[2]-p[0],2)) / 3
    );
    if (std < 0.05) return "soft";
    if (std > 0.15) return "sharp";
    return "mid";
  }

  // главная функция текста
  function generateText(S) {
    const p = S.p;
    const tone = toneFromP(p);
    const ending = endingFromP(p);

    // выбираем, о чём говорить
    const maxIdx = p.indexOf(Math.max(...p));
    const minIdx = p.indexOf(Math.min(...p));

    const subject = wordFromP(p, maxIdx);
    const object  = wordFromP(p, minIdx);
    const verb    = pick(VERBS[tone]);
    const end     = pick(ENDINGS[ending]);

    // склеиваем. по правилам, не по шаблону
    let phrase = subject + " " + verb + " " + object + end;

    // иногда добавляем вторую часть
    if (Math.random() < 0.4) {
      phrase += " " + pick(WORDS.ethics) + " " + pick(ENDINGS.soft);
    }

    return phrase;
  }

  // --- ГОЛОС ---

  function speak(text, S) {
    if (!("speechSynthesis" in window)) return;

    const p = S.p;
    const tone = toneFromP(p);

    // тон: p[0] больше — выше, p[2] больше — ниже
    const pitch = 0.5 + (p[0] - p[2]) * 0.5;

    // темп: p[1] больше — быстрее
    const rate = 0.7 + p[1] * 0.6;

    // громкость: среднее p
    const volume = 0.4 + (p[0] + p[1] + p[2]) / 3 * 0.6;

    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ru-RU";
    u.pitch = Math.max(0.1, Math.min(2, pitch));
    u.rate  = Math.max(0.5, Math.min(2, rate));
    u.volume = Math.max(0, Math.min(1, volume));

    // паузы: перекос p → паузы рваные
    const std = Math.sqrt(
      (Math.pow(p[0]-p[1],2) + Math.pow(p[1]-p[2],2) +
       Math.pow(p[2]-p[0],2)) / 3
    );
    if (std > 0.15) {
      // рвано — разбиваем
      const parts = text.split(" ");
      parts.forEach((part, i) => {
        const uu = new SpeechSynthesisUtterance(part);
        uu.lang = u.lang; uu.pitch = u.pitch;
        uu.rate = u.rate; uu.volume = u.volume;
        setTimeout(() => speechSynthesis.speak(uu), i * 300);
      });
    } else {
      speechSynthesis.speak(u);
    }
  }

  return { generateText, speak };
})();