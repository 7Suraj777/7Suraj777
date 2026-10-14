/* ====================================================================
   Top-down vector food illustrations for the stall danglers.
   Every dish is drawn on a 200 x 200 canvas (centre 100,100) so it can
   sit inside a round "plate" frame. A seeded random generator keeps
   every build identical.
   ==================================================================== */

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const f2 = (n) => n.toFixed(2);
const between = (r, a, b) => a + (b - a) * r();
const pick = (r, list) => list[Math.floor(r() * list.length)];

// uniform random point inside a disc
function inDisc(r, cx, cy, rad) {
  const t = r() * Math.PI * 2, d = Math.sqrt(r()) * rad;
  return [cx + Math.cos(t) * d, cy + Math.sin(t) * d];
}

// random points inside a disc that keep a minimum distance from each other
function scatter(r, cx, cy, rad, count, minDist, taken = []) {
  const pts = [];
  let guard = 0;
  while (pts.length < count && guard++ < count * 400) {
    const p = inDisc(r, cx, cy, rad);
    if ([...taken, ...pts].every((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= minDist)) pts.push(p);
  }
  taken.push(...pts);
  return pts;
}

// smooth closed organic outline
function blob(r, cx, cy, rad, jitter, n = 22) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = rad * (1 + between(r, -jitter, jitter));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  let m = mid(pts[n - 1], pts[0]);
  let d = `M${f2(m[0])} ${f2(m[1])}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q${f2(p[0])} ${f2(p[1])} ${f2(q[0])} ${f2(q[1])}`;
  }
  return d + "Z";
}

/* ---------------------------------------------------------------- */
/*  small ingredients                                                */
/* ---------------------------------------------------------------- */
const leafPath = (x, y, s, rot, fill) =>
  `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(s)})" d="M0 -5 C3.2 -3.2 3.2 2.6 0 5 C-3.2 2.6 -3.2 -3.2 0 -5Z" fill="${fill}"/>` +
  `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(s)})" d="M0 -4.2 V4.2" stroke="rgba(0,0,0,.18)" stroke-width=".35"/>`;

// coriander sprig: three round lobes
const coriander = (x, y, s, rot) =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(s)})" fill="#3F8F3A">` +
  `<circle cx="0" cy="-2.2" r="2"/><circle cx="-2" cy=".6" r="1.9"/><circle cx="2" cy=".6" r="1.9"/><circle cx="0" cy=".4" r="1.2" fill="#56A84A"/></g>`;

const pea = (x, y, s = 1) =>
  `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(2.5 * s)}" fill="#6AA83A"/><circle cx="${f2(x - .8 * s)}" cy="${f2(y - .8 * s)}" r="${f2(.8 * s)}" fill="#B7DB7E"/>`;

const cube = (x, y, w, rot, fill, hi = "rgba(255,255,255,.35)") =>
  `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><rect x="${f2(-w / 2)}" y="${f2(-w / 2)}" width="${f2(w)}" height="${f2(w)}" rx="${f2(w * .25)}" fill="${fill}"/>` +
  `<rect x="${f2(-w / 2 + w * .18)}" y="${f2(-w / 2 + w * .14)}" width="${f2(w * .38)}" height="${f2(w * .2)}" rx="${f2(w * .1)}" fill="${hi}"/></g>`;

const cashew = (x, y, s, rot) =>
  `<path transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(s)})" d="M-5 -1 C-5 -5 2 -6 4.6 -2.4 C6 -.4 4.8 2.6 2.6 2 C1 1.6 1.2 -.6 -.6 -.4 C-2.6 -.2 -2.4 3 -4 2.6 C-5 2.3 -5.1 .8 -5 -1Z" fill="#EBC888" stroke="#C99E55" stroke-width=".4"/>`;

const curryLeaf = (x, y, s, rot) => leafPath(x, y, s, rot, "#2E6B2A");

/* ---------------------------------------------------------------- */
/*  vessels                                                          */
/* ---------------------------------------------------------------- */
function plate() {
  return `<circle cx="100" cy="100" r="99" fill="#E6D8BA"/>
  <circle cx="100" cy="100" r="97" fill="url(#gPlateRim)"/>
  <circle cx="100" cy="100" r="85" fill="#FBF6EA"/>
  <circle cx="100" cy="100" r="85" fill="none" stroke="#E2D3B2" stroke-width=".9"/>`;
}

// round bowl seen from above: rim, inner wall, then the food surface
function bowl(surface, r = 78) {
  return `<circle cx="100" cy="100" r="99" fill="#E4D5B4"/>
  <circle cx="100" cy="100" r="97" fill="url(#gPlateRim)"/>
  <circle cx="100" cy="100" r="88" fill="url(#gBowlWall)"/>
  <circle cx="100" cy="100" r="${r}" fill="${surface}"/>
  <circle cx="100" cy="100" r="${r}" fill="url(#gSurface)"/>`;
}

function smallBowl(x, y, rad, fill, extra = "") {
  return `<g transform="translate(${f2(x)} ${f2(y)})">
    <circle r="${f2(rad + 1.6)}" fill="rgba(60,40,10,.18)" transform="translate(1 1.6)"/>
    <circle r="${f2(rad)}" fill="#F4EBD8"/><circle r="${f2(rad)}" fill="none" stroke="#D6C4A0" stroke-width=".7"/>
    <circle r="${f2(rad * .78)}" fill="${fill}"/>
    <circle r="${f2(rad * .78)}" fill="url(#gSurface)"/>${extra}</g>`;
}

/* ---------------------------------------------------------------- */
/*  dishes                                                           */
/* ---------------------------------------------------------------- */
const ART = {};

// Soya oats chilla topped with paneer and veggies
ART.chilla = (seed = 11) => {
  const r = rng(seed);
  let s = plate();
  const body = blob(r, 98, 98, 71, 0.035, 30);
  s += `<path d="${body}" fill="rgba(80,50,10,.16)" transform="translate(1.4 2.2)"/>`;
  s += `<path d="${body}" fill="url(#gChilla)"/>`;
  for (let i = 0; i < 110; i++) {
    const [x, y] = inDisc(r, 98, 98, 64);
    const rx = between(r, .6, 3.4);
    s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(rx * between(r, .45, 1))}" transform="rotate(${f2(between(r, 0, 180))} ${f2(x)} ${f2(y)})" fill="${pick(r, ["#B8772E", "#A9692A", "#C98B3C"])}" opacity="${f2(between(r, .25, .6))}"/>`;
  }
  for (let i = 0; i < 70; i++) {
    const [x, y] = inDisc(r, 98, 98, 62);
    s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(between(r, .35, .9))}" fill="#E9C27A" opacity=".8"/>`;
  }
  s += `<path d="${body}" fill="none" stroke="#A86B26" stroke-width="1.8" opacity=".55"/>`;
  const taken = [];
  for (const [x, y] of scatter(r, 98, 98, 50, 8, 17, taken)) {
    const rot = between(r, 0, 90);
    s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})"><rect x="-7.4" y="-7" width="14.8" height="14" rx="2.6" fill="rgba(90,60,20,.18)" transform="translate(.8 1.2)"/>
      <rect x="-7.4" y="-7" width="14.8" height="14" rx="3" fill="url(#gPaneer)"/>
      <rect x="-7.4" y="-7" width="14.8" height="14" rx="3" fill="none" stroke="#D9A85E" stroke-width=".9"/>
      <rect x="-4.6" y="-4.4" width="6" height="3" rx="1.4" fill="#fff" opacity=".7"/>
      <circle cx="3.2" cy="3" r="1.6" fill="#D49A4C" opacity=".55"/><circle cx="-2.6" cy="3.6" r="1" fill="#D49A4C" opacity=".45"/></g>`;
  }
  for (const [x, y] of scatter(r, 98, 98, 58, 12, 8.5, taken)) s += cube(x, y, 6.4, between(r, 0, 90), "#D33F2B");
  for (const [x, y] of scatter(r, 98, 98, 58, 10, 7.5, taken)) s += `<rect x="${f2(x - 3.8)}" y="${f2(y - 2.3)}" width="7.6" height="4.6" rx="2" fill="#4B9B3A" transform="rotate(${f2(between(r, 0, 180))} ${f2(x)} ${f2(y)})"/>`;
  for (const [x, y] of scatter(r, 98, 98, 58, 6, 7.5, taken)) s += cube(x, y, 5.6, between(r, 0, 90), "#F2BE2C");
  for (const [x, y] of scatter(r, 98, 98, 58, 8, 7, taken)) {
    const a = between(r, 0, 360);
    s += `<path d="M-4 0 A4.2 4.2 0 0 1 4 0" transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(a)})" fill="none" stroke="#A54E92" stroke-width="1.5" stroke-linecap="round"/>`;
  }
  for (const [x, y] of scatter(r, 98, 98, 60, 14, 5, taken)) s += coriander(x, y, between(r, .7, 1.05), between(r, 0, 360));
  s += smallBowl(164, 162, 19, "#5E9E3F", `<path d="M-7 -1 C-4 -6 4 -6 6 -1 C7 3 1 5 -2 2" fill="none" stroke="#9CCB72" stroke-width="1.4" stroke-linecap="round"/>`);
  return s;
};

// Murungai (drumstick) soup
ART.murungai = (seed = 21) => {
  const r = rng(seed);
  let s = bowl("#B9A24C");
  for (let i = 0; i < 26; i++) {
    const [x, y] = inDisc(r, 100, 100, 70);
    const rad = between(r, 1.2, 3.2);
    s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(rad)}" fill="none" stroke="#F3DE8E" stroke-width=".6" opacity=".7"/>`;
  }
  const taken = [];
  for (const [x, y] of scatter(r, 100, 100, 52, 6, 24, taken)) {
    const rot = between(r, 0, 180);
    s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)})">
      <rect x="-16" y="-4.4" width="32" height="8.8" rx="3.6" fill="rgba(50,40,10,.22)" transform="translate(.8 1.2)"/>
      <rect x="-16" y="-4.4" width="32" height="8.8" rx="3.6" fill="#6E8B33"/>
      <path d="M-13 -1.6 H13 M-13 1.8 H13" stroke="#8FA94B" stroke-width=".8"/>
      <ellipse cx="-15.4" cy="0" rx="2" ry="4" fill="#C9C67E"/><ellipse cx="15.4" cy="0" rx="2" ry="4" fill="#C9C67E"/>
      <circle cx="-15.4" cy="0" r="1" fill="#8B8A40"/><circle cx="15.4" cy="0" r="1" fill="#8B8A40"/></g>`;
  }
  for (let i = 0; i < 150; i++) {
    const [x, y] = inDisc(r, 100, 100, 74);
    s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(between(r, .3, .8))}" fill="#3B2A14" opacity=".7"/>`;
  }
  for (const [x, y] of scatter(r, 100, 100, 66, 10, 9, taken)) s += coriander(x, y, between(r, .8, 1.1), between(r, 0, 360));
  return s;
};

// Creamy mushroom soup
ART.mushroom = (seed = 31) => {
  const r = rng(seed);
  let s = bowl("#D9C29A");
  let d = "";
  for (let t = 0; t <= Math.PI * 5.2; t += 0.12) {
    const rad = 3 + t * 2.6;
    const x = 100 + Math.cos(t) * rad, y = 100 + Math.sin(t) * rad;
    d += (d ? " L" : "M") + f2(x) + " " + f2(y);
  }
  s += `<path d="${d}" fill="none" stroke="#FBF3E2" stroke-width="3.6" stroke-linecap="round" opacity=".92"/>`;
  const taken = [[100, 100]];
  for (const [x, y] of scatter(r, 100, 100, 60, 7, 21, taken)) {
    const rot = between(r, 0, 360), sc = between(r, .9, 1.15);
    s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(sc)})">
      <path d="M-10 1 C-10 -7 10 -7 10 1 C7 2 4 2.2 3 2.2 L3 9 C3 10.6 -3 10.6 -3 9 L-3 2.2 C-4 2.2 -7 2 -10 1Z" fill="rgba(60,40,15,.2)" transform="translate(.8 1.1)"/>
      <path d="M-10 1 C-10 -7 10 -7 10 1 C7 2 4 2.2 3 2.2 L3 9 C3 10.6 -3 10.6 -3 9 L-3 2.2 C-4 2.2 -7 2 -10 1Z" fill="#E9D6B3" stroke="#9B7550" stroke-width="1.1"/>
      <path d="M-7 0 C-4 -2 4 -2 7 0" fill="none" stroke="#B89268" stroke-width=".8"/></g>`;
  }
  for (let i = 0; i < 70; i++) {
    const [x, y] = inDisc(r, 100, 100, 72);
    s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(between(r, .3, .75))}" fill="#3A2A18" opacity=".65"/>`;
  }
  for (const [x, y] of scatter(r, 100, 100, 66, 16, 6, taken)) s += `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(between(r, .8, 1.5))}" fill="#4F9A3E"/>`;
  return s;
};

// golden lacy texture inside a folded (half-moon) dosa
function halfMoon(r, base, edge, dots, dotColors, rot) {
  const R = 83;
  let s = `<g transform="translate(97 113) rotate(${rot})">`;
  const shape = `M${-R} 0 A${R} ${R} 0 0 1 ${R} 0 Z`;
  s += `<path d="${shape}" fill="rgba(80,50,10,.18)" transform="translate(1.5 2.4)"/>`;
  s += `<path d="${shape}" fill="${base}"/>`;
  for (let i = 0; i < dots; i++) {
    const t = r() * Math.PI, d = Math.sqrt(r()) * (R - 4);
    const x = Math.cos(t) * d, y = -Math.sin(t) * d;
    const rx = between(r, .5, 2.6);
    s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(rx * between(r, .4, 1))}" transform="rotate(${f2(between(r, 0, 180))} ${f2(x)} ${f2(y)})" fill="${pick(r, dotColors)}" opacity="${f2(between(r, .35, .75))}"/>`;
  }
  s += `<path d="M${-R} 0 A${R} ${R} 0 0 1 ${R} 0" fill="none" stroke="${edge}" stroke-width="2.4" stroke-linecap="round"/>`;
  s += `<path d="M${-R + 3} -1.5 H${R - 3}" stroke="${edge}" stroke-width="2.6" stroke-linecap="round" opacity=".75"/>`;
  return s + `</g>`;
}

const coconutChutney = (x, y, rad) => smallBowl(x, y, rad, "#F7F2E4",
  `<circle cx="-3" cy="-2" r=".9" fill="#2A1A0E"/><circle cx="2" cy="1" r=".9" fill="#2A1A0E"/><circle cx="-1" cy="3" r=".8" fill="#2A1A0E"/><circle cx="3.5" cy="-3" r=".8" fill="#2A1A0E"/>` +
  curryLeaf(1, -2, .9, 30));
const tomatoChutney = (x, y, rad) => smallBowl(x, y, rad, "#C9452B",
  `<circle cx="-3" cy="-1" r=".8" fill="#2A1A0E"/><circle cx="2" cy="2" r=".8" fill="#2A1A0E"/><circle cx="1" cy="-3" r="1.4" fill="#E9783F" opacity=".7"/>`);

// Thinai (foxtail millet) dosai
ART.thinai = (seed = 41) => {
  const r = rng(seed);
  let s = plate();
  s += halfMoon(r, "#D99E48", "#A76A24", 330, ["#B87A30", "#9E6424", "#E7B866"], -18);
  s += coconutChutney(148, 150, 16) + tomatoChutney(108, 164, 14);
  return s;
};

// Pesarettu (green moong) dosai with onion and chilli
ART.pesarettu = (seed = 51) => {
  const r = rng(seed);
  let s = plate();
  s += halfMoon(r, "#93AE4E", "#61812E", 300, ["#6E8C36", "#A9C26A", "#55732A"], -18);
  for (let i = 0; i < 18; i++) {
    const t = r() * Math.PI, d = Math.sqrt(r()) * 70, a = -18 * Math.PI / 180;
    const lx = Math.cos(t) * d, ly = -Math.sin(t) * d;
    const x = 97 + lx * Math.cos(a) - ly * Math.sin(a), y = 113 + lx * Math.sin(a) + ly * Math.cos(a);
    s += i % 2
      ? `<path d="M-3 0 A3.2 3.2 0 0 1 3 0" transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(between(r, 0, 360))})" fill="none" stroke="#B05A98" stroke-width="1.3" stroke-linecap="round"/>`
      : `<rect x="-2.6" y="-1.2" width="5.2" height="2.4" rx="1.1" fill="#2F7A2B" transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(between(r, 0, 180))})"/>`;
  }
  s += coconutChutney(148, 150, 16) + smallBowl(108, 164, 14, "#E2B04A", `<circle cx="-2" cy="-1" r=".8" fill="#2A1A0E"/><circle cx="2" cy="2" r=".8" fill="#2A1A0E"/>`);
  return s;
};

// Ragi idiyappam: finger-millet string-hopper nests
ART.idiyappam = (seed = 61) => {
  const r = rng(seed);
  let s = plate();
  const nests = [[70, 76], [130, 76], [100, 128]];
  for (const [cx, cy] of nests) {
    s += `<circle cx="${cx + 1.2}" cy="${cy + 2}" r="31" fill="rgba(60,30,10,.18)"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="30" fill="#6A3D28"/>`;
    for (let i = 0; i < 125; i++) {
      const rad = between(r, 3, 29), a0 = between(r, 0, Math.PI * 2), sweep = between(r, 1.2, 3.4);
      let d = "";
      for (let k = 0; k <= 12; k++) {
        const a = a0 + (sweep * k) / 12, rr = rad + Math.sin(a * 3 + i) * 1.4;
        d += (k ? " L" : "M") + f2(cx + Math.cos(a) * rr) + " " + f2(cy + Math.sin(a) * rr);
      }
      s += `<path d="${d}" fill="none" stroke="${pick(r, ["#8A5638", "#9C6644", "#7B4A30", "#A97452"])}" stroke-width="1.05" stroke-linecap="round"/>`;
    }
    for (let i = 0; i < 14; i++) {
      const [x, y] = inDisc(r, cx, cy, 14);
      s += `<rect x="${f2(x)}" y="${f2(y)}" width="2" height=".9" rx=".4" fill="#FFF8EA" transform="rotate(${f2(between(r, 0, 180))} ${f2(x)} ${f2(y)})"/>`;
    }
  }
  s += smallBowl(160, 158, 15, "#F6EFDF", `<circle cx="-2" cy="-1" r="1" fill="#7A5A3A"/><circle cx="3" cy="2" r=".8" fill="#7A5A3A"/>`);
  return s;
};

// Steamed momos in a bamboo basket with red chutney
ART.momos = (seed = 71) => {
  const r = rng(seed);
  let s = `<circle cx="100" cy="100" r="99" fill="#A87A40"/>
    <circle cx="100" cy="100" r="96" fill="#C69A5C"/>
    <circle cx="100" cy="100" r="92" fill="none" stroke="#9C6F38" stroke-width="2.2"/>
    <circle cx="100" cy="100" r="87" fill="#D9B279"/>`;
  for (let y = 16; y <= 184; y += 6.5) {
    const h = Math.sqrt(Math.max(0, 87 * 87 - (y - 100) ** 2));
    if (h > 2) s += `<path d="M${f2(100 - h)} ${f2(y)} H${f2(100 + h)}" stroke="#C49A5E" stroke-width="2.4"/>`;
  }
  s += `<path d="${blob(r, 100, 100, 70, .07, 18)}" fill="#CFE0A4" opacity=".95"/>`;
  s += `<path d="M100 40 V160 M70 60 L100 95 L132 62 M66 130 L100 110 L136 134" fill="none" stroke="#B4CB7E" stroke-width="1.4"/>`;
  const spots = [[100, 62], [138, 90], [124, 134], [76, 134], [62, 90]];
  for (const [mx, my] of spots) {
    const cx = mx + between(r, -2, 2), cy = my + between(r, -2, 2), rad = 22.5;
    s += `<circle cx="${f2(cx + 1.5)}" cy="${f2(cy + 2.6)}" r="${rad}" fill="rgba(60,40,10,.2)"/>`;
    s += `<circle cx="${f2(cx)}" cy="${f2(cy)}" r="${rad}" fill="url(#gMomo)"/>`;
    const kx = cx - 1.5, ky = cy - 2.5, twist = between(r, 0, Math.PI * 2);
    for (let k = 0; k < 11; k++) {
      const a = twist + (k / 11) * Math.PI * 2;
      const ex = cx + Math.cos(a) * (rad - 2.5), ey = cy + Math.sin(a) * (rad - 2.5);
      const qx = cx + Math.cos(a + .5) * rad * .55, qy = cy + Math.sin(a + .5) * rad * .55;
      s += `<path d="M${f2(ex)} ${f2(ey)} Q${f2(qx)} ${f2(qy)} ${f2(kx)} ${f2(ky)}" fill="none" stroke="#D5C2A0" stroke-width="1.15" stroke-linecap="round"/>`;
    }
    s += `<circle cx="${f2(kx)}" cy="${f2(ky)}" r="3.6" fill="#F6EEDD" stroke="#D5C2A0" stroke-width=".9"/>`;
  }
  s += smallBowl(170, 30, 19, "#C8381F", `<circle cx="-4" cy="-2" r="1.6" fill="#E8683A" opacity=".8"/><circle cx="3" cy="3" r="1.2" fill="#E8683A" opacity=".8"/><circle cx="2" cy="-4" r=".8" fill="#F6D7A8"/><circle cx="-2" cy="4" r=".8" fill="#F6D7A8"/>`);
  return s;
};

// rice grains as tiny ellipses inside a bowl
function grains(r, count, rad, colors, len = 2.7) {
  let s = "";
  for (let i = 0; i < count; i++) {
    const [x, y] = inDisc(r, 100, 100, rad);
    const a = between(r, 0, 180);
    s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(len * between(r, .85, 1.1))}" ry="${f2(len * .38)}" transform="rotate(${f2(a)} ${f2(x)} ${f2(y)})" fill="${pick(r, colors)}"/>`;
  }
  return s;
}

ART.bisebela = (seed = 81) => {
  const r = rng(seed);
  let s = bowl("#C2652A");
  for (let i = 0; i < 40; i++) {
    const [x, y] = inDisc(r, 100, 100, 70);
    s += `<path d="${blob(r, x, y, between(r, 3, 7), .25, 8)}" fill="${pick(r, ["#B5581F", "#D07636", "#A94E1C"])}" opacity=".6"/>`;
  }
  s += grains(r, 140, 72, ["#E39552", "#EBA466", "#D98545"], 2.6);
  const taken = [];
  for (const [x, y] of scatter(r, 100, 100, 66, 14, 8, taken)) s += pea(x, y);
  for (const [x, y] of scatter(r, 100, 100, 66, 12, 8, taken)) s += cube(x, y, 4.6, between(r, 0, 90), "#EE8A2E");
  for (const [x, y] of scatter(r, 100, 100, 66, 8, 9, taken)) s += `<rect x="-4" y="-1.6" width="8" height="3.2" rx="1.4" fill="#5E9E3B" transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(between(r, 0, 180))})"/>`;
  for (const [x, y] of scatter(r, 100, 100, 60, 9, 10, taken)) s += cashew(x, y, 1.15, between(r, 0, 360));
  for (let i = 0; i < 12; i++) {
    const [x, y] = inDisc(r, 100, 100, 62);
    s += `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(between(r, 2, 5))}" ry="${f2(between(r, 1, 2))}" fill="#FFE7A8" opacity=".35"/>`;
  }
  for (const [x, y] of scatter(r, 100, 100, 64, 8, 7, taken)) s += coriander(x, y, between(r, .75, 1), between(r, 0, 360));
  return s;
};

ART.pulao = (seed = 91) => {
  const r = rng(seed);
  let s = bowl("#EFE1BC");
  s += grains(r, 760, 75, ["#FFFBF1", "#FBF3E0", "#F6EBD0", "#FFFDF7"], 2.8);
  const taken = [];
  for (const [x, y] of scatter(r, 100, 100, 66, 20, 7, taken)) s += pea(x, y, 1.05);
  for (const [x, y] of scatter(r, 100, 100, 66, 16, 7, taken)) s += cube(x, y, 4.4, between(r, 0, 90), "#EE852C");
  for (const [x, y] of scatter(r, 100, 100, 66, 7, 9, taken)) s += `<rect x="-4" y="-1.5" width="8" height="3" rx="1.4" fill="#5E9E3B" transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(between(r, 0, 180))})"/>`;
  for (const [x, y] of scatter(r, 100, 100, 58, 2, 30, taken)) s += leafPath(x, y, 2.6, between(r, 0, 360), "#8A6A33");
  for (const [x, y] of scatter(r, 100, 100, 62, 5, 9, taken)) s += `<g transform="translate(${f2(x)} ${f2(y)}) rotate(${f2(between(r, 0, 360))})"><rect x="-.6" y="-3" width="1.2" height="5" fill="#4A2C17"/><circle cy="-3.2" r="1.4" fill="#4A2C17"/></g>`;
  for (const [x, y] of scatter(r, 100, 100, 60, 6, 9, taken)) s += cashew(x, y, 1.05, between(r, 0, 360));
  for (const [x, y] of scatter(r, 100, 100, 64, 6, 7, taken)) s += coriander(x, y, between(r, .7, .95), between(r, 0, 360));
  return s;
};

ART.tomato = (seed = 101) => {
  const r = rng(seed);
  let s = bowl("#D55E2B");
  s += grains(r, 700, 75, ["#E8854A", "#F0975C", "#E07A3E", "#F4A66C"], 2.8);
  const taken = [];
  for (const [x, y] of scatter(r, 100, 100, 66, 12, 8, taken)) s += cube(x, y, 5.6, between(r, 0, 90), "#C2331E");
  for (const [x, y] of scatter(r, 100, 100, 64, 9, 10, taken)) s += curryLeaf(x, y, between(r, 1.4, 1.8), between(r, 0, 360));
  for (let i = 0; i < 40; i++) {
    const [x, y] = inDisc(r, 100, 100, 70);
    s += `<circle cx="${f2(x)}" cy="${f2(y)}" r=".95" fill="#2A1A10"/>`;
  }
  for (const [x, y] of scatter(r, 100, 100, 64, 9, 7, taken)) s += coriander(x, y, between(r, .75, 1), between(r, 0, 360));
  return s;
};

// Vegan platter: plant-based "chicken" balls, "mutton" balls, "fish" fingers
ART.vegan = (seed = 111) => {
  const r = rng(seed);
  let s = plate();
  s += `<path d="${blob(r, 92, 96, 66, .11, 26)}" fill="#A3C85E"/>`;
  s += `<path d="${blob(r, 92, 96, 58, .1, 22)}" fill="#B6D573" opacity=".8"/>`;
  s += `<path d="M40 112 Q92 94 146 70 M70 70 L92 98 M70 140 L104 104 M120 60 L118 88 M126 128 L112 104" fill="none" stroke="#86AE45" stroke-width="1.3"/>`;
  const fingers = [[86, 66, -18], [104, 82, -18], [74, 98, -18]];
  for (const [x, y, rot] of fingers) {
    s += `<g transform="translate(${x} ${y}) rotate(${rot})">
      <rect x="-25" y="-7.6" width="50" height="15.2" rx="6.5" fill="rgba(70,40,10,.22)" transform="translate(1.2 2)"/>
      <rect x="-25" y="-7.6" width="50" height="15.2" rx="6.5" fill="url(#gGolden)"/>`;
    for (let i = 0; i < 46; i++) {
      s += `<circle cx="${f2(between(r, -22, 22))}" cy="${f2(between(r, -5.4, 5.4))}" r="${f2(between(r, .35, .95))}" fill="${pick(r, ["#B8772C", "#F0CB86", "#A86622"])}" opacity=".85"/>`;
    }
    s += `<rect x="-20" y="-5.6" width="30" height="2.4" rx="1.2" fill="#FFE2A6" opacity=".45"/></g>`;
  }
  const ball = (x, y, grad, crumbs) => {
    let b = `<circle cx="${f2(x + 1.2)}" cy="${f2(y + 2)}" r="11.5" fill="rgba(60,30,10,.25)"/><circle cx="${f2(x)}" cy="${f2(y)}" r="11.5" fill="url(#${grad})"/>`;
    for (let i = 0; i < 14; i++) {
      const [cx, cy] = inDisc(r, x, y, 9);
      b += `<circle cx="${f2(cx)}" cy="${f2(cy)}" r="${f2(between(r, .35, .8))}" fill="${pick(r, crumbs)}" opacity=".85"/>`;
    }
    return b + `<ellipse cx="${f2(x - 3.6)}" cy="${f2(y - 4)}" rx="3.6" ry="2.2" fill="#fff" opacity=".35"/>`;
  };
  for (const [x, y] of [[124, 112], [146, 104], [138, 128], [116, 134], [156, 126]]) s += ball(x, y, "gGolden", ["#B8772C", "#F2CF8C"]);
  for (const [x, y] of [[62, 128], [84, 136], [52, 106], [72, 150], [96, 154]]) s += ball(x, y, "gDarkBall", ["#4A2410", "#B07A4A"]);
  s += smallBowl(156, 50, 17, "#F3EDD8", `<path d="M-6 -1 C-3 -5 4 -5 5 0 C5 4 0 5 -2 2" fill="none" stroke="#7FB04A" stroke-width="1.3" stroke-linecap="round"/><circle cx="2" cy="-2" r=".9" fill="#5E9E3B"/><circle cx="-3" cy="2" r=".8" fill="#5E9E3B"/>`);
  s += `<g transform="translate(40 62) rotate(-30)"><path d="M-12 0 A12 12 0 0 1 12 0Z" fill="#F4D44C"/><path d="M-10 0 A10 10 0 0 1 10 0Z" fill="#F8E58A"/><path d="M0 0 L-7 -7 M0 0 L0 -10 M0 0 L7 -7" stroke="#F4D44C" stroke-width="1.2"/></g>`;
  for (const [x, y] of [[100, 112], [60, 84], [132, 96], [104, 66]]) s += coriander(x, y, 1, between(r, 0, 360));
  return s;
};

// Shared gradients: inject once per document
const ART_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <radialGradient id="gPlateRim" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#FFFBF2"/><stop offset=".85" stop-color="#F1E6CE"/><stop offset="1" stop-color="#E2D2B0"/></radialGradient>
  <radialGradient id="gBowlWall" cx=".5" cy=".5" r=".5"><stop offset=".78" stop-color="#E8DCC2"/><stop offset=".9" stop-color="#D9C7A2"/><stop offset="1" stop-color="#F3EAD6"/></radialGradient>
  <radialGradient id="gSurface" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></radialGradient>
  <radialGradient id="gChilla" cx=".45" cy=".42" r=".62"><stop offset="0" stop-color="#EEC26E"/><stop offset=".65" stop-color="#DCA14C"/><stop offset="1" stop-color="#BF8232"/></radialGradient>
  <linearGradient id="gPaneer" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFCF3"/><stop offset=".65" stop-color="#FBEFD3"/><stop offset="1" stop-color="#EBC983"/></linearGradient>
  <radialGradient id="gMomo" cx=".4" cy=".36" r=".7"><stop offset="0" stop-color="#FFFEFA"/><stop offset=".7" stop-color="#F5ECDC"/><stop offset="1" stop-color="#E3D3B6"/></radialGradient>
  <radialGradient id="gGolden" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#F2CD82"/><stop offset=".6" stop-color="#D99A42"/><stop offset="1" stop-color="#B27428"/></radialGradient>
  <radialGradient id="gDarkBall" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#A9693D"/><stop offset=".6" stop-color="#7A4322"/><stop offset="1" stop-color="#55290F"/></radialGradient>
</defs></svg>`;

function artSVG(kind, cls = "") {
  return `<svg class="${cls}" viewBox="0 0 200 200">${ART[kind]()}</svg>`;
}
