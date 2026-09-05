(function () {
  const canvas = document.getElementById("game");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const COLS = 10;
  const ROWS = 20;
  const HIDDEN = 2;
  const CELL = 36;
  canvas.width = COLS * CELL;
  canvas.height = ROWS * CELL;

  const COLORS = {
    I: { fill: "#b8f03c", hi: "#e8ff9a", lo: "#6a9a08" },
    O: { fill: "#e4c878", hi: "#fff1c4", lo: "#a07a28" },
    T: { fill: "#7a5cff", hi: "#c9bbff", lo: "#3d28b0" },
    S: { fill: "#2ec9b0", hi: "#b6f5ea", lo: "#0f7a6c" },
    Z: { fill: "#ff5a4a", hi: "#ffc0b8", lo: "#b01c14" },
    J: { fill: "#3e8cff", hi: "#b7d4ff", lo: "#154a9a" },
    L: { fill: "#ffb020", hi: "#ffe09a", lo: "#b06a00" },
  };

  const SHAPES = {
    I: [
      [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
      [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
      [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
    ],
    O: [
      [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
      [[0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
    ],
    T: [
      [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
      [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
    ],
    S: [
      [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
      [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
    ],
    Z: [
      [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
      [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
      [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
    ],
    J: [
      [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
      [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
      [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
    ],
    L: [
      [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
      [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
      [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
      [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
    ],
  };

  const KICKS = {
    JLSTZ: {
      "0-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
      "1-0": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
      "1-2": [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
      "2-1": [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
      "2-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
      "3-2": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
      "3-0": [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
      "0-3": [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
    },
    I: {
      "0-1": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
      "1-0": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
      "1-2": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
      "2-1": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
      "2-3": [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]],
      "3-2": [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]],
      "3-0": [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]],
      "0-3": [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]],
    },
  };

  const BAG = ["I", "O", "T", "S", "Z", "J", "L"];
  const LINE_SCORES = [0, 100, 300, 500, 800];
  const GRAVITY = [0.016, 0.021, 0.03, 0.04, 0.055, 0.08, 0.12, 0.18, 0.28, 0.4, 0.55, 0.7, 0.85, 1, 1.2, 1.5];

  const holdCanvas = document.getElementById("hold");
  const nextCanvases = [...document.querySelectorAll("[data-next]")];
  const scoreEl = document.querySelector("[data-score]");
  const linesEl = document.querySelector("[data-lines]");
  const levelEl = document.querySelector("[data-level]");
  const highEl = document.querySelector("[data-high]");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayBody = document.getElementById("overlay-body");
  const toast = document.getElementById("toast");
  const startBtn = document.getElementById("start-btn");

  let board, queue, current, hold, holdUsed, score, lines, level, high, dropAcc, lockAcc, paused, over, started, particles, flash, keys, das, arr;

  function emptyBoard() {
    return Array.from({ length: ROWS + HIDDEN }, () => Array(COLS).fill(null));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fillQueue() {
    while (queue.length < 8) queue.push(...shuffle(BAG));
  }

  function spawnPiece(type) {
    return { type, rot: 0, x: 3, y: -1 };
  }

  function cells(p) {
    const m = SHAPES[p.type][p.rot];
    const out = [];
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (m[r][c]) out.push({ x: p.x + c, y: p.y + r });
      }
    }
    return out;
  }

  function collides(p) {
    return cells(p).some(({ x, y }) => x < 0 || x >= COLS || y >= ROWS + HIDDEN || (y >= 0 && board[y][x]));
  }

  function tryMove(dx, dy) {
    const n = { ...current, x: current.x + dx, y: current.y + dy };
    if (!collides(n)) {
      current = n;
      lockAcc = 0;
      return true;
    }
    return false;
  }

  function tryRotate(dir) {
    const from = current.rot;
    const to = (from + dir + 4) % 4;
    const table = current.type === "I" ? KICKS.I : current.type === "O" ? { [`${from}-${to}`]: [[0, 0]] } : KICKS.JLSTZ;
    const kicks = table[`${from}-${to}`] || [[0, 0]];
    for (const [kx, ky] of kicks) {
      const n = { ...current, rot: to, x: current.x + kx, y: current.y - ky };
      if (!collides(n)) {
        current = n;
        lockAcc = 0;
        beep(520, 0.04, "square", 0.03);
        return true;
      }
    }
    return false;
  }

  function ghostY() {
    let g = { ...current };
    while (!collides({ ...g, y: g.y + 1 })) g.y += 1;
    return g.y;
  }

  function lock() {
    cells(current).forEach(({ x, y }) => {
      if (y >= 0) board[y][x] = current.type;
    });
    beep(180, 0.06, "triangle", 0.04);
    const full = [];
    for (let r = 0; r < board.length; r++) {
      if (board[r].every(Boolean)) full.push(r);
    }
    if (full.length) {
      full.forEach((r) => {
        for (let x = 0; x < COLS; x++) burst(x, r, COLORS[board[r][x]]);
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(null));
      });
      const n = full.length;
      score += LINE_SCORES[n] * level;
      lines += n;
      level = Math.min(15, 1 + Math.floor(lines / 10));
      flash = n === 4 ? 1 : 0.45;
      announce(n === 4 ? "Well!" : n === 3 ? "Triple" : n === 2 ? "Double" : "Single");
      beep(n === 4 ? 880 : 660, 0.12, "sine", 0.06);
    }
    holdUsed = false;
    nextPiece();
  }

  function nextPiece() {
    fillQueue();
    current = spawnPiece(queue.shift());
    if (collides(current)) {
      over = true;
      overlayTitle.textContent = "Game Over";
      overlayBody.textContent = `Score ${score.toLocaleString()} · Lines ${lines}`;
      startBtn.textContent = "Play Again";
      overlay.classList.remove("hidden");
      if (score > high) {
        high = score;
        localStorage.setItem("dropwell-high", String(high));
      }
      paintHud();
    }
  }

  function holdPiece() {
    if (holdUsed) return;
    holdUsed = true;
    const t = current.type;
    if (!hold) {
      hold = t;
      nextPiece();
    } else {
      const swap = hold;
      hold = t;
      current = spawnPiece(swap);
    }
    beep(400, 0.05, "sine", 0.03);
  }

  function hardDrop() {
    let d = 0;
    while (tryMove(0, 1)) d++;
    score += d * 2;
    lock();
    beep(240, 0.05, "sawtooth", 0.03);
  }

  function announce(text) {
    toast.textContent = text;
    toast.classList.remove("show");
    void toast.offsetWidth;
    toast.classList.add("show");
  }

  function burst(cx, cy, color) {
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: (cx + 0.5) * CELL,
        y: (cy - HIDDEN + 0.5) * CELL,
        vx: (Math.random() - 0.5) * 6,
        vy: (Math.random() - 0.8) * 6,
        life: 1,
        color: color.fill,
      });
    }
  }

  let audio;
  function beep(freq, dur, type, gain) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = gain;
      o.connect(g);
      g.connect(audio.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + dur);
      o.stop(audio.currentTime + dur);
    } catch (_) {}
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function drawMino(c, x, y, s, type, alpha) {
    const col = COLORS[type];
    const g = c.createLinearGradient(x, y, x + s, y + s);
    g.addColorStop(0, col.hi);
    g.addColorStop(0.45, col.fill);
    g.addColorStop(1, col.lo);
    c.globalAlpha = alpha;
    roundRect(c, x + 1, y + 1, s - 2, s - 2, s * 0.16);
    c.fillStyle = g;
    c.fill();
    c.fillStyle = "rgba(255,255,255,0.35)";
    roundRect(c, x + s * 0.14, y + s * 0.12, s * 0.46, s * 0.22, s * 0.1);
    c.fill();
    c.strokeStyle = "rgba(0,0,0,0.22)";
    c.lineWidth = 1;
    roundRect(c, x + 1.5, y + 1.5, s - 3, s - 3, s * 0.16);
    c.stroke();
    c.globalAlpha = 1;
  }

  function drawPiecePreview(target, type) {
    const c = target.getContext("2d");
    const w = (target.width = target.clientWidth * 2 || 160);
    const h = (target.height = target.clientHeight * 2 || 120);
    c.clearRect(0, 0, w, h);
    if (!type) return;
    const m = SHAPES[type][0];
    const size = Math.min(w, h) / 5.2;
    let minX = 99, minY = 99, maxX = 0, maxY = 0;
    m.forEach((row, r) => row.forEach((v, col) => {
      if (v) {
        minX = Math.min(minX, col);
        minY = Math.min(minY, r);
        maxX = Math.max(maxX, col);
        maxY = Math.max(maxY, r);
      }
    }));
    const ox = (w - (maxX - minX + 1) * size) / 2 - minX * size;
    const oy = (h - (maxY - minY + 1) * size) / 2 - minY * size;
    m.forEach((row, r) => row.forEach((v, col) => {
      if (v) drawMino(c, ox + col * size, oy + r * size, size, type, 1);
    }));
  }

  function paintHud() {
    if (scoreEl) scoreEl.textContent = score.toLocaleString();
    if (linesEl) linesEl.textContent = String(lines);
    if (levelEl) levelEl.textContent = String(level);
    if (highEl) highEl.textContent = high.toLocaleString();
    if (holdCanvas) drawPiecePreview(holdCanvas, hold);
    nextCanvases.forEach((cv, i) => drawPiecePreview(cv, queue[i]));
  }

  function draw() {
    ctx.fillStyle = "#071018";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(canvas.width, y * CELL);
      ctx.stroke();
    }
    for (let y = HIDDEN; y < board.length; y++) {
      for (let x = 0; x < COLS; x++) {
        if (board[y][x]) drawMino(ctx, x * CELL, (y - HIDDEN) * CELL, CELL, board[y][x], 1);
      }
    }
    if (started && !over) {
      const gy = ghostY();
      cells({ ...current, y: gy }).forEach(({ x, y }) => {
        if (y >= HIDDEN) {
          ctx.globalAlpha = 0.22;
          roundRect(ctx, x * CELL + 3, (y - HIDDEN) * CELL + 3, CELL - 6, CELL - 6, 6);
          ctx.strokeStyle = COLORS[current.type].hi;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
      cells(current).forEach(({ x, y }) => {
        if (y >= HIDDEN) drawMino(ctx, x * CELL, (y - HIDDEN) * CELL, CELL, current.type, 1);
      });
    }
    particles.forEach((p) => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
      ctx.globalAlpha = 1;
    });
    if (flash > 0) {
      ctx.fillStyle = `rgba(255,255,255,${flash * 0.25})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function tick(dt) {
    if (!started || paused || over) return;
    const g = GRAVITY[Math.min(level, GRAVITY.length - 1)];
    const soft = keys.has("ArrowDown");
    const grounded = collides({ ...current, y: current.y + 1 });
    if (grounded) {
      lockAcc += dt;
      if (lockAcc > 0.5) lock();
    } else {
      dropAcc += dt * (soft ? Math.max(g * 20, 0.8) : g) * 60;
      while (dropAcc >= 1) {
        dropAcc -= 1;
        if (tryMove(0, 1)) {
          if (soft) score += 1;
        } else {
          break;
        }
      }
    }
    const left = keys.has("ArrowLeft");
    const right = keys.has("ArrowRight");
    if (left || right) {
      das += dt;
      if (das > 0.16) {
        arr += dt;
        if (arr > 0.035) {
          tryMove(left ? -1 : 1, 0);
          arr = 0;
        }
      }
    }
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18;
      p.life -= dt * 1.6;
    });
    particles = particles.filter((p) => p.life > 0);
    flash = Math.max(0, flash - dt * 2.2);
  }

  function reset() {
    board = emptyBoard();
    queue = [];
    fillQueue();
    hold = null;
    holdUsed = false;
    score = 0;
    lines = 0;
    level = 1;
    high = Number(localStorage.getItem("dropwell-high") || 0);
    dropAcc = 0;
    lockAcc = 0;
    paused = false;
    over = false;
    started = true;
    particles = [];
    flash = 0;
    keys = new Set();
    das = 0;
    arr = 0;
    nextPiece();
    overlay.classList.add("hidden");
    paintHud();
  }

  let last = 0;
  function loop(t) {
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016);
    last = t;
    tick(dt);
    draw();
    if (started && !over) paintHud();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  function onKey(e, down) {
    const map = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowDown: "soft",
      ArrowUp: "cw",
      x: "cw",
      X: "cw",
      z: "ccw",
      Z: "ccw",
      Control: "ccw",
      c: "hold",
      C: "hold",
      Shift: "hold",
      " ": "hard",
      p: "pause",
      P: "pause",
      Escape: "pause",
    };
    const act = map[e.key];
    if (!act) return;
    e.preventDefault();
    if (!down) {
      keys.delete(e.key);
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") das = arr = 0;
      return;
    }
    if (e.repeat && (act === "cw" || act === "ccw" || act === "hard" || act === "hold" || act === "pause")) return;
    if (!started || over) {
      if (act === "hard" || act === "pause") reset();
      return;
    }
    if (act === "pause") {
      paused = !paused;
      overlayTitle.textContent = paused ? "Paused" : "";
      overlayBody.textContent = paused ? "Press P or Esc to resume" : "";
      startBtn.textContent = "Resume";
      overlay.classList.toggle("hidden", !paused);
      return;
    }
    if (paused) return;
    keys.add(e.key);
    if (act === "left") tryMove(-1, 0);
    if (act === "right") tryMove(1, 0);
    if (act === "cw") tryRotate(1);
    if (act === "ccw") tryRotate(-1);
    if (act === "hold") holdPiece();
    if (act === "hard") hardDrop();
  }

  window.addEventListener("keydown", (e) => onKey(e, true));
  window.addEventListener("keyup", (e) => onKey(e, false));

  startBtn?.addEventListener("click", () => {
    if (paused) {
      paused = false;
      overlay.classList.add("hidden");
      return;
    }
    reset();
  });

  document.querySelectorAll("[data-act]").forEach((btn) => {
    const fire = () => {
      if (!started || over) return reset();
      const a = btn.dataset.act;
      if (a === "left") tryMove(-1, 0);
      if (a === "right") tryMove(1, 0);
      if (a === "soft") tryMove(0, 1);
      if (a === "cw") tryRotate(1);
      if (a === "ccw") tryRotate(-1);
      if (a === "hold") holdPiece();
      if (a === "hard") hardDrop();
    };
    btn.addEventListener("click", fire);
  });

  high = Number(localStorage.getItem("dropwell-high") || 0);
  board = emptyBoard();
  queue = [];
  particles = [];
  flash = 0;
  keys = new Set();
  paintHud();
  draw();
})();
