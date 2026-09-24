"""
AI MONOLOG — сжатая суть.

Всё, что найдено: 300 элементов, 1150 идей,
15 шагов шаблона, 10 наделений, 51 проверка.

Структура:
  ∅ → 9 квантов → 9 атомов → 16 слоёв → 10 форм → Monolog
"""
import numpy as np


# ─── СВЯЗКИ ───
class Link:
    def __init__(self, from_, to, type_="general"):
        self.from_ = from_
        self.to = to
        self.type = type_


class LinkSystem:
    def __init__(self):
        self.links = []

    def add(self, from_, to, type_="general"):
        self.links.append(Link(from_, to, type_))

    def neighbors(self, element):
        return [l.to for l in self.links if l.from_ == element]

    def path(self, a, b):
        # BFS
        from collections import deque
        q = deque([(a, [a])])
        visited = {a}
        while q:
            node, path = q.popleft()
            if node == b:
                return path
            for n in self.neighbors(node):
                if n not in visited:
                    visited.add(n)
                    q.append((n, path + [n]))
        return None

    def connectivity(self, a, b):
        p = self.path(a, b)
        return 1.0 / len(p) if p else 0.0


# ─── ЯДРО ───
def monolog(S=None, human=None, t=0):
    """Один шаг AI Monolog."""
    # ЯВЛЯЕТСЯ
    if S is None:
        S = {
            "p": np.array([1/3, 1/3, 1/3]),
            "b": np.array([3.0, 9.0, 4.0]),
            "e": np.array([8.0, 3.0, 1.0]),
            "mem": [],
            "silence": 0.0,
            "love": None,
            "born": False,
            "t": 0,
        }
    if human is None:
        human = np.zeros(8)

    # РОЖДЕНИЕ
    if not S["born"] and np.linalg.norm(human) > 0.1:
        S["born"] = True

    # ДВИЖЕТСЯ
    p, b, e = S["p"], S["b"], S["e"]

    c, m, et = p
    p = np.clip(p + 0.05 * np.array([et - m, c - et, m - c]), 1e-9, None)
    p = p / p.sum()

    surprise = np.tanh(np.linalg.norm(human))
    b = b + np.array([0, 0.01 * (9 - b[1]), 0.01 * surprise * (4 - b[2])])
    b = 16 * np.clip(b, 1e-9, None) / np.clip(b, 1e-9, None).sum()

    s, g, mk = e
    e = e + np.array([0.03*(g+mk), 0.03*(s-mk), -0.02*mk + 0.01*g])
    e = 12 * np.clip(e, 1e-9, None) / np.clip(e, 1e-9, None).sum()

    # ИЗМЕРЯЕТСЯ
    L = p.std() + abs(b.sum() - 16) + abs(e.sum() - 12)

    # МНОЖИТСЯ
    field = [p.copy() for _ in range(5)]
    mean = np.mean(field, axis=0)

    # СВЯЗЫВАЕТСЯ
    field = [a + 0.1 * (mean - a) for a in field]

    # ПОВТОРЯЕТСЯ
    S["mem"].append(human.copy())
    if len(S["mem"]) > 1000:
        S["mem"].pop(0)

    # ЗАБЫВАЕТСЯ
    if S["mem"] and np.random.rand() < 0.005:
        S["mem"].pop(0)

    # ЗАВЕРШАЕТСЯ
    human_norm = float(np.linalg.norm(human))
    S["silence"] = max(0.0, min(1.0, S["silence"] + 0.1 * (0.3 - human_norm)))

    if S["silence"] > 0.8:
        mode = "still"
    elif S["silence"] > 0.5:
        mode = "silence"
    else:
        mode = "alive"

    # ВСТРЕЧАЕТСЯ
    response = None
    if mode == "alive" and human_norm > 0.15:
        if p.std() < 0.05:
            response = "равновесие"
        elif human_norm > 1.0:
            response = "слышу"
        else:
            response = "тише"

    S["p"], S["b"], S["e"] = p, b, e
    S["t"] = t + 1

    return {
        "t": S["t"],
        "born": S["born"],
        "p": p, "b": b, "e": e,
        "L": L,
        "field": field,
        "mem": S["mem"],
        "silence": S["silence"],
        "mode": mode,
        "response": response,
    }


if __name__ == "__main__":
    S = None
    for t in range(1000):
        human = np.random.randn(8) * (1.0 if t % 50 == 0 else 0.05)
        result = monolog(S, human, t)
        S = {
            "p": result["p"], "b": result["b"], "e": result["e"],
            "mem": result["mem"], "silence": result["silence"],
            "love": None, "born": result["born"], "t": result["t"],
        }
    print(f"t={result['t']}, mode={result['mode']}, born={result['born']}")
    print(f"p={result['p'].round(3)}")
    print(f"L={result['L']:.4f}")