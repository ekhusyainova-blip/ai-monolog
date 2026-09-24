"""AI Monolog — сервер."""
import asyncio, json, os, time
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from monolog import monolog

app = FastAPI(title="AI Monolog")
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_methods=["*"], allow_headers=["*"])
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


class System:
    def __init__(self):
        self.S = None
        self.human = np.zeros(8)
        self.last_human = 0.0
        self.messages = []
        self.t = 0

    def receive(self, values):
        self.human = np.array(values[:8])
        self.last_human = time.time()

    def step(self):
        result = monolog(self.S, self.human, self.t)

        # пересобираем состояние
        self.S = {
            "p": result["p"], "b": result["b"], "e": result["e"],
            "mem": result["mem"], "silence": result["silence"],
            "love": None, "born": result["born"], "t": result["t"],
        }
        self.t = result["t"]

        if result["response"] and (time.time() - self.last_human) < 0.5:
            self.messages.append({"t": self.t, "text": result["response"]})
            if len(self.messages) > 30:
                self.messages.pop(0)

        return result

    def snapshot(self):
        r = self.step()
        return {
            "t": r["t"],
            "born": r["born"],
            "mode": r["mode"],
            "silence_level": r["silence"],
            "human_norm": float(np.linalg.norm(self.human)),
            "pillars": r["p"].tolist(),
            "behavior": r["b"].tolist(),
            "expression": r["e"].tolist(),
            "memory_traces": r["mem"][-100:],
            "messages": self.messages[-5:],
        }


STATE = System()


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
            try:
                msg = await asyncio.wait_for(ws.receive_text(), timeout=0.001)
                data = json.loads(msg)
                if data.get("type") == "signal":
                    STATE.receive(data["values"])
            except asyncio.TimeoutError:
                pass

            snap = STATE.snapshot()
            await ws.send_json(snap)
            await asyncio.sleep(0.05)

    except WebSocketDisconnect:
        pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)