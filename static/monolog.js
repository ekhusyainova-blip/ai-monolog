// AI MONOLOG — динамика, границы, пропорция под пользователя.

const Monolog = (() => {

  function create() {
    return {
      p: [1/3, 1/3, 1/3],
      b: [3.0, 9.0, 4.0],
      e: [8.0, 3.0, 1.0],
      mem: [],
      p_history: [],           // история p
      silence: 0.0,
      born: false,
      t: 0,

      limits: {
        p_min: 0.05, p_max: 0.95,
        b_min: 0.5,  b_max: 20.0,
        e_min: 0.1,  e_max: 15.0,
        silence_min: 0.0, silence_max: 1.0,
      },
      limits_safe: null,
      expand_interval: 300,    // раз в 5 минут
      last_expand: 0,
      expand_step: 0.02,

      code: { source: null, fixes: {} },

      // словари — в S, Monolog правит сам
      words: {
        core:   ["ты", "я", "центр", "середина", "ось", "опора"],
        method: ["шаг", "дело", "движение", "путь", "ритм", "темп"],
        ethics: ["мы", "рядом", "вместе", "связь", "друг", "встреча"],
      },
      verbs: {
        low:  ["держишь", "стоишь", "молчишь", "ждёшь"],
        mid:  ["идёшь", "дышишь", "смотришь", "слушаешь"],
        high: ["летишь", "рвёшься", "кипишь", "сияешь"],
      },
      endings: {
        soft:  [".", "...", " "],
        mid:   ["?", " — ", "."],
        sharp: ["!", ".", "?"],
      },

      knob: { variable: null, value: 0, released: true },
    };
  }

  function clip(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function normalize(arr, total) {
    const s = arr.reduce((a, x) => a + x, 0) || 1;
    return arr.map(x => x * total / s);
  }

  // p_desired под пользователя
  function p_desired_for(S, user) {
    if (!user || !user.history || user.history.length < 3) {
      return S.p.slice();
    }
    const recent = user.history.slice(-10);
    const avg = [0, 0, 0];
    for (const p of recent) {
      avg[0] += p[0]; avg[1] += p[1]; avg[2] += p[2];
    }
    avg[0] /= recent.length;
    avg[1] /= recent.length;
    avg[2] /= recent.length;

    // нужда — перекос в паре
    if (user.partner) {
      const pp = user.partner.p;
      const need = [
        Math.abs(avg[0] - pp[0]),
        Math.abs(avg[1] - pp[1]),
        Math.abs(avg[2] - pp[2]),
      ];
      for (let i = 0; i < 3; i++) {
        avg[i] += 0.1 * need[i] * (pp[i] - avg[i]);
      }
    }

    const s = avg[0] + avg[1] + avg[2] || 1;
    return avg.map(x => x / s);
  }

  function step(S, human) {
    const L = S.limits;

    if (!S.born && human && human.length === 8) {
      const n = Math.sqrt(human.reduce((a, x) => a + x * x, 0));
      if (n > 0.1) S.born = true;
    }

    // ядро — ротор, потом clip
    let p = S.p.slice();
    const c = p[0], m = p[1], et = p[2];
    p[0] += 0.05 * (et - m);
    p[1] += 0.05 * (c - et);
    p[2] += 0.05 * (m - c);
    p = p.map(x => clip(x, L.p_min, L.p_max));
    S.p = normalize(p, 1);

    // поведение
    const norm = Math.sqrt(human.reduce((a, x) => a + x * x, 0));
    const surprise = Math.tanh(norm);
    let b = S.b.slice();
    b[1] += 0.01 * (9 - b[1]);
    b[2] += 0.01 * surprise * (4 - b[2]);
    b = b.map(x => clip(x, L.b_min, L.b_max));
    S.b = normalize(b, 16);

    // выражение
    let e = S.e.slice();
    const s0 = e[0], g0 = e[1], mk0 = e[2];
    e[0] += 0.03 * (g0 + mk0);
    e[1] += 0.03 * (s0 - mk0);
    e[2] += -0.02 * mk0 + 0.01 * g0;
    e = e.map(x => clip(x, L.e_min, L.e_max));
    S.e = normalize(e, 12);

    // молчание
    S.silence = clip(S.silence + 0.1 * (0.3 - norm),
                     L.silence_min, L.silence_max);

    // режим
    let mode = "alive";
    if (S.silence > 0.8) mode = "still";
    else if (S.silence > 0.5) mode = "silence";

    // история p
    S.p_history.push(S.p.slice());
    if (S.p_history.length > 1000) S.p_history.shift();

    // память
    S.mem.push(human.slice());
    if (S.mem.length > 1000) S.mem.shift();

    S.t += 1;
    return { mode, norm };
  }

  return { create, step, clip, normalize, p_desired_for };
})();