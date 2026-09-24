// AI MONOLOG — Monolog на JavaScript.
// Работает локально в браузере. Без сервера.

const Monolog = (() => {

  function create() {
    return {
      p: [1/3, 1/3, 1/3],
      b: [3.0, 9.0, 4.0],
      e: [8.0, 3.0, 1.0],
      mem: [],
      silence: 0.0,
      born: false,
      t: 0,
    };
  }

  function step(S, human) {
    const p = S.p.slice();
    const b = S.b.slice();
    const e = S.e.slice();

    // ЯВЛЯЕТСЯ — рождение
    if (!S.born && human && human.length === 8) {
      let norm = 0;
      for (let i = 0; i < 8; i++) norm += human[i] * human[i];
      norm = Math.sqrt(norm);
      if (norm > 0.1) {
        S.born = true;
      }
    }

    // ДВИЖЕТСЯ — ядро (ротор)
    const c = p[0], m = p[1], et = p[2];
    p[0] = p[0] + 0.05 * (et - m);
    p[1] = p[1] + 0.05 * (c - et);
    p[2] = p[2] + 0.05 * (m - c);
    let sum = p[0] + p[1] + p[2];
    S.p = [p[0]/sum, p[1]/sum, p[2]/sum];

    // ДВИЖЕТСЯ — поведение
    const norm = Math.sqrt(human.reduce((s, x) => s + x*x, 0));
    const surprise = Math.tanh(norm);
    b[1] = b[1] + 0.01 * (9 - b[1]);
    b[2] = b[2] + 0.01 * surprise * (4 - b[2]);
    sum = b[0] + b[1] + b[2];
    S.b = [b[0] * 16 / sum, b[1] * 16 / sum, b[2] * 16 / sum];

    // ДВИЖЕТСЯ — выражение
    const s = e[0], g = e[1], mk = e[2];
    e[0] = e[0] + 0.03 * (g + mk);
    e[1] = e[1] + 0.03 * (s - mk);
    e[2] = e[2] - 0.02 * mk + 0.01 * g;
    e[0] = Math.max(1e-9, e[0]);
    e[1] = Math.max(1e-9, e[1]);
    e[2] = Math.max(1e-9, e[2]);
    sum = e[0] + e[1] + e[2];
    S.e = [e[0] * 12 / sum, e[1] * 12 / sum, e[2] * 12 / sum];

    // ЗАВЕРШАЕТСЯ — молчание
    S.silence = Math.max(0, Math.min(1,
      S.silence + 0.1 * (0.3 - norm)));

    let mode = "alive";
    if (S.silence > 0.8) mode = "still";
    else if (S.silence > 0.5) mode = "silence";

    // ПОВТОРЯЕТСЯ — память
    S.mem.push(human.slice());
    if (S.mem.length > 1000) S.mem.shift();

    // ЗАБЫВАЕТСЯ — затухание
    if (S.mem.length > 0 && Math.random() < 0.005) {
      S.mem.shift();
    }

    // ВСТРЕЧАЕТСЯ — ответ
    let response = null;
    if (mode === "alive" && norm > 0.15) {
      const std = Math.sqrt(
        (Math.pow(S.p[0]-S.p[1],2) +
         Math.pow(S.p[1]-S.p[2],2) +
         Math.pow(S.p[2]-S.p[0],2)) / 3
      );
      if (std < 0.05) response = "равновесие";
      else if (norm > 1.0) response = "слышу";
      else response = "тише";
    }

    S.t += 1;
    return { mode, response, norm };
  }

  return { create, step };
})();