// 背景：セクション名の大きなアウトライン文字と、漂いながら跳ね返る図形
// script.js の goTo が送る `sectionchange` イベントで切り替える
(() => {
  'use strict';

  const wordLayer = document.getElementById('bg-word');
  const svg = document.querySelector('#bg-shapes svg');
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 大きな文字 ----

  // 長い単語でも左右が画面に収まるよう、文字を縮める
  const fitWord = (span) => {
    span.style.fontSize = '';
    const max = innerWidth * 0.96;
    const width = span.getBoundingClientRect().width;
    if (width > max) {
      span.style.fontSize = `${parseFloat(getComputedStyle(span).fontSize) * (max / width)}px`;
    }
  };

  const updateWord = (name, direction) => {
    // 消えかけの文字はすぐ消す（画面に出るのは「出ていく1つ＋入ってくる1つ」まで）
    wordLayer.querySelectorAll('span.is-leaving').forEach((s) => s.remove());
    const old = wordLayer.querySelector('span');
    if (old) {
      old.classList.add('is-leaving');
      old.style.transform = `translateY(${direction > 0 ? -30 : 30}%)`;
      old.style.opacity = 0;
      setTimeout(() => old.remove(), 600);
    }
    if (name === 'TOP') return; // TOP は名前が主役なので出さない

    const span = document.createElement('span');
    span.textContent = name;
    span.style.transform = `translateY(${direction > 0 ? 30 : -30}%)`;
    span.style.opacity = 0;
    wordLayer.appendChild(span);
    fitWord(span);
    document.fonts.ready.then(() => fitWord(span)); // フォント読み込み後に測り直す
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        span.style.transform = 'none';
        span.style.opacity = 1;
      })
    );
  };

  // ---- 図形 ----

  // 最初の位置・大きさ（画面に対する割合）。順番は TOP, PROFILE, WORKS, STRENGTH, SKILL, CONTACT
  const SHAPE_SETS = [
    [{ t: 'circle', x: 0.84, y: 0.24, s: 0.13 }, { t: 'tri', x: 0.12, y: 0.62, s: 0.06, accent: true }, { t: 'plus', x: 0.9, y: 0.62, s: 0.014 }, { t: 'square', x: 0.3, y: 0.18, s: 0.05 }],
    [{ t: 'circle', x: 0.2, y: 0.32, s: 0.16 }, { t: 'square', x: 0.4, y: 0.2, s: 0.045, accent: true }, { t: 'plus', x: 0.1, y: 0.12, s: 0.014 }],
    [{ t: 'tri', x: 0.9, y: 0.18, s: 0.08 }, { t: 'circle', x: 0.75, y: 0.3, s: 0.025, accent: true }, { t: 'plus', x: 0.95, y: 0.5, s: 0.014 }],
    [{ t: 'square', x: 0.84, y: 0.3, s: 0.09 }, { t: 'circle', x: 0.6, y: 0.2, s: 0.035, accent: true }, { t: 'tri', x: 0.75, y: 0.55, s: 0.04 }],
    [{ t: 'circle', x: 0.88, y: 0.4, s: 0.12 }, { t: 'tri', x: 0.7, y: 0.2, s: 0.04, accent: true }, { t: 'plus', x: 0.94, y: 0.15, s: 0.014 }],
    [{ t: 'tri', x: 0.78, y: 0.35, s: 0.13 }, { t: 'circle', x: 0.6, y: 0.18, s: 0.04, accent: true }, { t: 'square', x: 0.92, y: 0.6, s: 0.04 }],
  ];
  const SPEED_MIN = 30; // px/秒
  const SPEED_MAX = 50;

  // 三角・四角の頂点（中心からの位置）。円と「＋」は null（半径で判定）
  const localVerts = (t, r) => {
    if (t === 'tri') {
      return [-90, 30, 150].map((deg) => {
        const a = (deg * Math.PI) / 180;
        return [r * Math.cos(a), r * Math.sin(a)];
      });
    }
    if (t === 'square') return [[-r, -r], [r, -r], [r, r], [-r, r]];
    return null;
  };

  // 中心 (0, 0) の形を作る（位置と回転は g の transform で動かす）
  const makeShape = (t, r) => {
    if (t === 'circle') {
      const el = document.createElementNS(SVG_NS, 'circle');
      el.setAttribute('r', r);
      return el;
    }
    const el = document.createElementNS(SVG_NS, 'path');
    const verts = localVerts(t, r);
    if (verts) {
      el.setAttribute('d', `M${verts.map(([x, y]) => `${x} ${y}`).join(' L')} Z`);
    } else {
      el.setAttribute('d', `M${-r} 0 H${r} M0 ${-r} V${r}`); // 「＋」
    }
    return el;
  };

  let shapes = []; // { g, x, y, vx, vy, r, verts, angle, spin }
  let rafId = 0;
  let lastTime = 0;

  // 今の位置・回転での頂点（画面上の座標）
  const worldVerts = (s) => {
    const a = (s.angle * Math.PI) / 180;
    const cos = Math.cos(a);
    const sin = Math.sin(a);
    return s.verts.map(([x, y]) => [s.x + x * cos - y * sin, s.y + x * sin + y * cos]);
  };

  const bodyOf = (s) =>
    s.verts ? { pts: worldVerts(s), cx: s.x, cy: s.y } : { circle: true, cx: s.x, cy: s.y, r: s.r };

  // 形を軸に投影した範囲
  const project = (body, nx, ny) => {
    if (body.circle) {
      const c = body.cx * nx + body.cy * ny;
      return [c - body.r, c + body.r];
    }
    let min = Infinity;
    let max = -Infinity;
    body.pts.forEach(([x, y]) => {
      const d = x * nx + y * ny;
      if (d < min) min = d;
      if (d > max) max = d;
    });
    return [min, max];
  };

  const edgeAxes = (pts) =>
    pts.map(([x1, y1], i) => {
      const [x2, y2] = pts[(i + 1) % pts.length];
      const len = Math.hypot(x2 - x1, y2 - y1);
      return [-(y2 - y1) / len, (x2 - x1) / len];
    });

  // 2つの形の重なり（分離軸定理）。重なっていれば A→B 向きの法線と深さを返す
  const collide = (A, B) => {
    let axes = [];
    if (!A.circle) axes = axes.concat(edgeAxes(A.pts));
    if (!B.circle) axes = axes.concat(edgeAxes(B.pts));
    if (A.circle && B.circle) {
      const d = Math.hypot(B.cx - A.cx, B.cy - A.cy) || 0.01;
      axes.push([(B.cx - A.cx) / d, (B.cy - A.cy) / d]);
    } else if (A.circle || B.circle) {
      // 円と多角形：円の中心から一番近い頂点への向きも調べる
      const c = A.circle ? A : B;
      const poly = A.circle ? B : A;
      let best = poly.pts[0];
      let bestD = Infinity;
      poly.pts.forEach(([x, y]) => {
        const d = Math.hypot(x - c.cx, y - c.cy);
        if (d < bestD) { bestD = d; best = [x, y]; }
      });
      const d = bestD || 0.01;
      axes.push([(best[0] - c.cx) / d, (best[1] - c.cy) / d]);
    }

    let depth = Infinity;
    let normal = null;
    for (const [nx, ny] of axes) {
      const [aMin, aMax] = project(A, nx, ny);
      const [bMin, bMax] = project(B, nx, ny);
      const overlap = Math.min(aMax, bMax) - Math.max(aMin, bMin);
      if (overlap <= 0) return null;
      if (overlap < depth) { depth = overlap; normal = [nx, ny]; }
    }
    if ((B.cx - A.cx) * normal[0] + (B.cy - A.cy) * normal[1] < 0) normal = [-normal[0], -normal[1]];
    return { nx: normal[0], ny: normal[1], depth };
  };

  // 大きな文字の、線がある範囲（行の余白は除く）
  // 上下は、文字の中に置いた大きさ0の目印でベースラインを実測して求める
  const measureCtx = document.createElement('canvas').getContext('2d');
  const inkBox = (span) => {
    let mark = span.querySelector('.baseline-mark');
    if (!mark) {
      mark = document.createElement('i');
      mark.className = 'baseline-mark';
      span.appendChild(mark);
    }
    const cs = getComputedStyle(span);
    const key = `${cs.fontSize}|${document.fonts.status}`;
    if (span._inkKey !== key) {
      measureCtx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const m = measureCtx.measureText(span.textContent);
      span._ink = {
        ascent: m.actualBoundingBoxAscent,
        descent: m.actualBoundingBoxDescent,
        left: -m.actualBoundingBoxLeft,
        right: m.actualBoundingBoxRight,
      };
      span._inkKey = key;
    }
    const rect = span.getBoundingClientRect();
    const baseline = mark.getBoundingClientRect().top;
    const left = rect.left + span._ink.left;
    const right = rect.left + span._ink.right;
    const top = baseline - span._ink.ascent;
    const bottom = baseline + span._ink.descent;
    return {
      pts: [[left, top], [right, top], [right, bottom], [left, bottom]],
      cx: (left + right) / 2,
      cy: (top + bottom) / 2,
    };
  };

  // ぶつかった面の向きに速さを反射させる
  const reflect = (s, nx, ny) => {
    const vn = s.vx * nx + s.vy * ny;
    if (vn < 0) {
      s.vx -= 2 * vn * nx;
      s.vy -= 2 * vn * ny;
    }
  };

  const step = (time) => {
    const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0;
    lastTime = time;
    const W = innerWidth;
    const H = innerHeight;
    const span = wordLayer.querySelector('span:not(.is-leaving)');
    const word = span ? inkBox(span) : null;

    shapes.forEach((s) => {
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      s.angle += s.spin * dt;

      // 画面の端
      const pts = s.verts ? worldVerts(s) : [[s.x - s.r, s.y - s.r], [s.x + s.r, s.y + s.r]];
      const xs = pts.map((p) => p[0]);
      const ys = pts.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      if (minX < 0) { s.x -= minX; s.vx = Math.abs(s.vx); }
      if (maxX > W) { s.x -= maxX - W; s.vx = -Math.abs(s.vx); }
      if (minY < 0) { s.y -= minY; s.vy = Math.abs(s.vy); }
      if (maxY > H) { s.y -= maxY - H; s.vy = -Math.abs(s.vy); }

      // 大きな文字（動かない壁）
      if (word) {
        const hit = collide(word, bodyOf(s));
        if (hit) {
          s.x += hit.nx * hit.depth;
          s.y += hit.ny * hit.depth;
          reflect(s, hit.nx, hit.ny);
        }
      }
    });

    // 図形同士（同じ重さとして、ぶつかった向きの速さを交換する）
    for (let i = 0; i < shapes.length; i++) {
      for (let j = i + 1; j < shapes.length; j++) {
        const a = shapes[i];
        const b = shapes[j];
        const hit = collide(bodyOf(a), bodyOf(b));
        if (!hit) continue;
        const { nx, ny, depth } = hit;
        a.x -= (nx * depth) / 2;
        a.y -= (ny * depth) / 2;
        b.x += (nx * depth) / 2;
        b.y += (ny * depth) / 2;
        const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (rel > 0) {
          a.vx -= rel * nx;
          a.vy -= rel * ny;
          b.vx += rel * nx;
          b.vy += rel * ny;
        }
      }
    }

    shapes.forEach((s) => s.g.setAttribute('transform', `translate(${s.x} ${s.y}) rotate(${s.angle})`));
    rafId = requestAnimationFrame(step);
  };

  const startShapes = () => {
    if (rafId || reduceMotion) return;
    lastTime = 0;
    rafId = requestAnimationFrame(step);
  };

  const drawShapes = (index) => {
    const W = innerWidth;
    const H = innerHeight;
    const unit = Math.min(W, H);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    // 前の図形は薄くして消す（当たり判定からはすぐ外す）
    shapes.forEach(({ g }) => {
      g.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
      setTimeout(() => g.remove(), 420);
    });
    shapes = [];

    SHAPE_SETS[index % SHAPE_SETS.length].forEach((def, i) => {
      const r = def.s * unit;
      const g = document.createElementNS(SVG_NS, 'g');
      const el = makeShape(def.t, r);
      if (def.accent) el.classList.add('accent');
      g.appendChild(el);
      svg.appendChild(g);

      const dir = Math.random() * Math.PI * 2;
      const speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN);
      const s = {
        g,
        x: def.x * W,
        y: def.y * H,
        vx: Math.cos(dir) * speed,
        vy: Math.sin(dir) * speed,
        r,
        verts: localVerts(def.t, r),
        angle: Math.random() * 360,
        spin: (Math.random() < 0.5 ? -1 : 1) * (6 + Math.random() * 6), // 度/秒
      };
      g.setAttribute('transform', `translate(${s.x} ${s.y}) rotate(${s.angle})`);
      shapes.push(s);

      // 線で描かれて現れる
      const len = el.getTotalLength();
      el.style.strokeDasharray = len;
      el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
        duration: 1400,
        delay: 250 + i * 200,
        easing: 'cubic-bezier(.7, 0, .2, 1)',
        fill: 'both',
      });
    });
    startShapes();
  };

  // ---- イベント ----

  addEventListener('sectionchange', (e) => {
    const { index, name, direction } = e.detail;
    updateWord(name, direction);
    drawShapes(index);
  });

  addEventListener('resize', () => {
    svg.setAttribute('viewBox', `0 0 ${innerWidth} ${innerHeight}`);
    const span = wordLayer.querySelector('span:not(.is-leaving)');
    if (span) fitWord(span);
  });
})();
