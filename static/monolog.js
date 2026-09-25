// AI MONOLOG — динамика + код внутри S.

const Monolog = (() => {

  function create() {
    return {
      // состояние
      p: [1/3, 1/3, 1/3],
      b: [3.0, 9.0, 4.0],
      e: [8.0, 3.0, 1.0],
      mem: [],
      silence: 0.0,
      born: false,
      t: 0,

      // границы (в S, не в коде)
      limits: {
        p_min: 0.15, p_max: 0.85,
        b_min: 0.5,  b_max: 20.0,
        e_min: 0.1,  e_max: 15.0,
        silence_min: 0.0, silence_max: 1.0,
      },
      limits_safe: null,

      // правки границ
      expand_interval: 3600,
      last_expand: 0,
      expand_step: 0.05,

      // код внутри S
      code: {
        source: null,
        fixes: {},
      },

      // состояние рычага (ручной эксперимент)
      knob: { variable: null, value: 0, released: true },
    };
  }

  function clip(val, lo, hi) {
    return Math.max(lo, Math.min(hi, val));
  }

  function normalize(arr, total) {
    const s = arr.reduce((a, x) => a + x, 0) || 1;
    return arr.map(x => x * total / s);
  }

  function step(S, human) {
    const L = S.limits;

    // рождение
    if (!S.born && human && human.length === 8) {
      const n = Math.sqrt(human.reduce((a, x) => a + x * x, 0));
      if (n > 0.1) S.born = true;
    }

    // ротор ядра
    let p = S.p.slice();
    const c = p[0], m = p[1], et = p[2];
    p[0] += 0.05 * (et - m);
    p[1] += 0.05 * (c - et);
    p[2] += 0.05 * (m - c);

    // clip по границам — не тянем к цели
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

    // память
    S.mem.push(human.slice());
    if (S.mem.length > 1000) S.mem.shift();
    if (S.mem.length && Math.random() < 0.005) S.mem.shift();

    // ответ
    let response = null;
    if (mode === "alive" && norm > 0.15) {
      const std = Math.sqrt(
        (Math.pow(S.p[0]-S.p[1],2) + Math.pow(S.p[1]-S.p[2],2) +
         Math.pow(S.p[2]-S.p[0],2)) / 3
      );
      if (std < 0.05) response = "равновесие";
      else if (norm > 1.0) response = "слышу";
      else response = "тише";
    }

    S.t += 1;
    return { mode, response, norm };
  }

  return { create, step, clip, normalize };
})();