"""AI Monolog - живая система."""
import asyncio
import json
import os
import time
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="AI Monolog")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


# ══════════════════════════════════════════════════════════
# ЯДРО
# ══════════════════════════════════════════════════════════
class State:
    """Состояние одного агента."""

    def __init__(self):
        self.p = np.array([1/3, 1/3, 1/3])
        self.b = np.array([3.0, 9.0, 4.0])
        self.e = np.array([8.0, 3.0, 1.0])

    def vecs(self):
        return self.p, self.b, self.e

    def flat(self):
        return np.concatenate([self.p, self.b, self.e])


def step_dynamics(S, ctx, alpha=0.05, beta=0.03, gamma=0.02, delta=0.01):
    """Один шаг динамики."""
    p, b, e = S.vecs()

    # столпы: ротор
    c, m, et = p
    p = p + alpha * np.array([et - m, c - et, m - c])
    p = np.clip(p, 1e-9, None)
    p = p / p.sum()

    # поведение
    surprise = np.tanh(np.linalg.norm(ctx))
    b = b + np.array([0, 0.01 * (9 - b[1]), 0.01 * surprise * (4 - b[2])])
    b = np.clip(b, 1e-9, None)
    b = 16 * b / b.sum()

    # выразительность
    s, g, mk = e
    e = e + np.array([
        beta * (g + mk),
        beta * (s - mk),
        -gamma * mk + delta * g,
    ])
    e = np.clip(e, 1e-9, None)
    e = 12 * e / e.sum()

    S.p, S.b, S.e = p, b, e
    return S


# ══════════════════════════════════════════════════════════
# ПОЛЕ АГЕНТОВ
# ══════════════════════════════════════════════════════════
class Field:
    """Поле из N агентов с диффузией."""

    def __init__(self, n=5, kappa=0.1):
        self.agents = [State() for _ in range(n)]
        self.n = n
        self.kappa = kappa

    def step(self, ctx):
        for S in self.agents:
            step_dynamics(S, ctx)

        # диффузия столпов
        P = np.array([S.p for S in self.agents])
        mean = P.mean(axis=0)
        for i, S in enumerate(self.agents):
            p = S.p + self.kappa * (mean - S.p)
            p = np.clip(p, 1e-9, None)
            S.p = p / p.sum()

    def metrics(self):
        P = np.array([S.p for S in self.agents])
        return {
            "consensus": float(P.std(axis=0).mean()),
            "diversity": float(P.std(axis=0).mean() / (P.mean() + 1e-9)),
        }


# ══════════════════════════════════════════════════════════
# МЕТА M¹
# ══════════════════════════════════════════════════════════
class Meta1:
    """Баланс 2:1."""

    def __init__(self):
        self.consensus = 2/3
        self.diversity = 1/3
        self.lr = 0.01
        self.memory = []

    def step(self, field_metrics):
        err = 1/3 - field_metrics["diversity"]
        drag = 0.0
        if len(self.memory) >= 5:
            drag = 0.1 * (np.mean(self.memory[-5:]) - field_metrics["diversity"])

        self.consensus -= self.lr * (err + drag)
        self.diversity += self.lr * (err + drag)

        s = self.consensus + self.diversity
        self.consensus /= s
        self.diversity /= s

        self.memory.append(field_metrics["diversity"])
        if len(self.memory) > 100:
            self.memory.pop(0)


# ══════════════════════════════════════════════════════════
# МОЛЧАНИЕ
# ══════════════════════════════════════════════════════════
class Silence:
    """Молчание и безмолвие."""

    def __init__(self, threshold=0.3):
        self.threshold = threshold
        self.level = 0.0           # 0..1
        self.mode = "alive"        # alive | silence | still

    def update(self, human_signal_norm):
        delta = self.threshold - human_signal_norm
        self.level = float(np.clip(self.level + 0.1 * delta, 0.0, 1.0))

        if self.level > 0.8:
            self.mode = "still"
        elif self.level > 0.5:
            self.mode = "silence"
        else:
            self.mode = "alive"

        return self.mode


# ══════════════════════════════════════════════════════════
# СИСТЕМА
# ══════════════════════════════════════════════════════════
class Monolog:
    def __init__(self, n_agents=5):
        self.field = Field(n=n_agents)
        self.meta = Meta1()
        self.silence = Silence(threshold=0.3)
        self.t = 0
        self.alive = True
        self.human_signal = np.zeros(8)
        self.human_last_update = 0.0
        self.messages = []          # история диалога

    def receive_human(self, values):
        """Человек прислал сигнал."""
        self.human_signal = np.array(values[:8])
        self.human_last_update = time.time()

    def step(self):
        # молчание
        human_norm = float(np.linalg.norm(self.human_signal))
        mode = self.silence.update(human_norm)

        if mode == "still":
            # безмолвие: ничего не делаем
            self.t += 1
            return

        # контекст: 70% шум + 30% человек
        noise = np.random.randn(8) * (1.0 if self.t % 50 == 0 else 0.05)
        ctx = 0.7 * noise + 0.3 * self.human_signal

        # поле
        self.field.step(ctx)

        # мета
        self.meta.step(self.field.metrics())

        # если человек дал сигнал — генерируем ответ
        if human_norm > 0.1 and time.time() - self.human_last_update < 0.5:
            response = self._generate_response(ctx, human_norm)
            if response:
                self.messages.append({
                    "t": self.t,
                    "text": response,
                })
                if len(self.messages) > 50:
                    self.messages.pop(0)

        self.t += 1

    def _generate_response(self, ctx, human_norm):
        """Система отвечает или молчит."""
        if self.silence.mode == "silence":
            # молчание — не отвечаем
            return None
        if human_norm < 0.15:
            # слабый сигнал — не отвечаем
            return None

        # простые ответы на основе состояния
        p = self.field.agents[0].p
        b = self.field.agents[0].b
        if p.std() < 0.05:
            return "равновесие"
        if b[2] > 6:
            return "внимание"
        if human_norm > 1.0:
            return "слышу"
        return "тише"

    def snapshot(self):
        S0 = self.field.agents[0]
        return {
            "t": self.t,
            "alive": self.alive,
            "mode": self.silence.mode,
            "silence_level": self.silence.level,
            "human_norm": float(np.linalg.norm(self.human_signal)),
            "pillars": S0.p.tolist(),
            "behavior": S0.b.tolist(),
            "expression": S0.e.tolist(),
            "field": self.field.metrics(),
            "meta": {
                "consensus": self.meta.consensus,
                "diversity": self.meta.diversity,
            },
            "messages": self.messages[-5:],
        }


STATE = Monolog(n_agents=5)


# ══════════════════════════════════════════════════════════
# РОУТЫ
# ══════════════════════════════════════════════════════════
@app.get("/")
async def index():
    with open("static/index.html") as f:
        return HTMLResponse(f.read())


@app.get("/api/state")
async def get_state():
    return STATE.snapshot()


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket):
    await ws.accept()
    try:
        while True:
            # читаем сигнал от человека (не блокируя)
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=0.001)
                data = json.loads(msg)
                if data.get("type") == "signal":
                    STATE.receive_human(data["values"])
            except asyncio.TimeoutError:
                pass

            # шаг системы
            STATE.step()

            # отправляем состояние
            await ws.send_json(STATE.snapshot())

            # 50 мс
            await asyncio.sleep(0.05)

    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)