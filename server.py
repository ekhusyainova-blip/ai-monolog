"""AI Monolog — минимальный сервер."""
import asyncio, json, os
import numpy as np
 ─from fastapi import FastAPI, WebSocket, WebSocket── СоDisconnect
fromстоя fastapi.responses import HTMLResponseние
from fastapi.staticfiles системы import StaticFiles
from fast ─api.middleware.cors── import CORSMiddleware
import uvicorn

app = FastAPI(title="AI Monolog")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# статика
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

#
class MonologState:
    def __init__(self):
        self.p = np.array([1/3, 1/3, 1/3])       # ядро
        self.b = np.array([3.0, 9.0, 4.0])       # поведение
        self.e = np.array([8.0, 3.0, 1.0])       # выразительность
        self.t = 0
        self.alive = True

    def step(self, ctx=None):
        if ctx is None:
            ctx = np.random.randn(8) * (1.0 if self.t % 50 == 0 else 0.05)

        # столпы
        c, m, et = self.p
        self.p = self.p + 0.05 * np.array([et - m, c - et, m - c])
        self.p = np.clip(self.p, 1e-9, None)
        self.p = self.p / self.p.sum()

        # поведение
        surprise = np.tanh(np.linalg.norm(ctx))
        self.b[1] += 0.01 * (9 - self.b[1])
        self.b[2] += 0.01 * surprise * (4 - self.b[2])
        self.b = np.clip(self.b, 1e-9, None)
        self.b = 16 * self.b / self.b.sum()

        # выразительность
        s, g, mk = self.e
        self.e = self.e + np.array([
            0.03 * (g + mk),
            0.03 * (s - mk),
            -0.02 * mk + 0.01 * g,
        ])
        self.e = np.clip(self.e, 1e-9, None)
        self.e = 12 * self.e / self.e.sum()

        self.t += 1

    def snapshot(self):
        return {
            "t": self.t,
            "alive": self.alive,
            "pillars": self.p.tolist(),
            "behavior": self.b.tolist(),
            "expression": self.e.tolist(),
        }

STATE = MonologState()

# ─── Роуты ───
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
            # шаг системы
            STATE.step()

            # отправляем состояние
            await ws.send_json(STATE.snapshot())

            # ждём 50мс (20 fps)
            await asyncio.sleep(0.05)

            # пробуем прочитать сигнал от человека (не блокируя)
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=0.001)
                data = json.loads(msg)
                if data.get("type") == "signal":
                    human = np.array(data["values"][:8])
                    STATE.step(human)
            except asyncio.TimeoutError:
                pass

    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)