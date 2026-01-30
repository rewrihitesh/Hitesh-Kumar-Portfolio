
// Custom Ring Particles with Color Cycling Logic
// Based on the original ring-particles worklet

// Random Number Generator (Seeded)
function t(t) { return function () { t = 1831565813 + (t |= 0) | 0; var a = Math.imul(t ^ t >>> 15, 1 | t); return (((a = a + Math.imul(a ^ a >>> 7, 61 | a) ^ a) ^ a >>> 14) >>> 0) / 4294967296 } }

registerPaint("ring-particles", class {
    static get inputProperties() {
        return [
            "--ring-radius", "--ring-thickness", "--particle-count", "--particle-rows",
            "--particle-color", "--particle-size", "--animation-tick",
            "--particle-min-alpha", "--particle-max-alpha", "--ring-x", "--ring-y",
            "--fade-easing", "--seed", "--color-mode"
        ]
    }

    constructor() {
        this.getRandom = t(0);
        // User requested palette - Electric & Modern (Matches new design)
        this.palette = [
            '#38BDF8', // Sky 400
            '#818CF8', // Indigo 400
            '#A78BFA', // Violet 400
            '#E879F9', // Fuchsia 400
            '#22D3EE', // Cyan 400
            '#C084FC'  // Purple 400
        ];
    }

    getBezierValue(t, a, r, e, n) {
        const i = 1 - t, s = t * t, o = i * i;
        return o * i * a + 3 * o * t * r + 3 * i * s * e + s * t * n
    }

    solveBezierX(t, a, r) {
        let e = t;
        for (let n = 0; n < 8; n++) {
            const n = this.getBezierValue(e, 0, a, r, 1), i = (this.getBezierValue(e + .001, 0, a, r, 1) - n) / .001;
            if (0 === i) break;
            e -= (n - t) / i
        }
        return Math.max(0, Math.min(1, e))
    }

    parseEasing(t) {
        const a = t.trim();
        if ("linear" === a) return [0, 0, 1, 1];
        if ("ease" === a) return [.25, .1, .25, 1];
        if ("ease-in" === a) return [.42, 0, 1, 1];
        if ("ease-out" === a) return [0, 0, .58, 1];
        if ("ease-in-out" === a) return [.42, 0, .58, 1];
        const r = a.match(/cubic-bezier\(([^)]+)\)/);
        return r && 4 === r[1].split(",").length ? r[1].split(",").map(Number) : [.42, 0, 1, 1]
    }

    hash(t) {
        let a = 43758.5453123 * Math.sin(t);
        return a - Math.floor(a)
    }

    randomInt(t, a) {
        return Math.floor(this.getRandom() * (a - t + 1)) + t
    }

    randomFloat(t, a) {
        return t + this.getRandom() * (a - t)
    }

    // Helper to get color based on mode and index
    getColor(mode, ringIndex, totalRings, particleIndex) {
        // Mode 0: Concentric (Red inner -> Blue outer)
        // Mode 1: Random mixed

        // We use a threshold to snap the mode if animating
        // If mode < 0.5, use Concentric. Else Random.

        if (mode < 0.5) {
            // Concentric: Round robin based on ring index
            // Simply cycle through palette: 0, 1, 2, 3, 4, 5, 0, 1...
            return this.palette[ringIndex % this.palette.length];
        } else {
            // Random: deterministic random based on particle/ring index hash
            // (We want it to be static per frame unless seed changes, using the RNG state would be messy inside loops 
            // if we want stability, but here we want random assignment per particle)
            // Let's just pick one randomly. Since this.getRandom is re-seeded each paint call, 
            // usage sequence matters. We need to be careful not to consume randomness inconsistently if we want stable jitter.
            // Actually, for "Random" mode, we want each particle to have a random color.
            // To keep it stable across frames (tick), we can just use the indices.
            const colorIndex = (ringIndex * 7 + particleIndex * 3) % this.palette.length;
            return this.palette[colorIndex];
        }
    }

    parseProps(t) {
        return ["--ring-radius", "--ring-thickness", "--ring-x", "--ring-y", "--particle-count", "--particle-rows", "--particle-color", "--particle-size", "--particle-min-alpha", "--particle-max-alpha", "--fade-easing", "--animation-tick", "--seed", "--color-mode"].map(a => {
            const r = t.get(a);
            if ("undefined" == typeof CSSUnparsedValue || r instanceof CSSUnparsedValue) {
                if (!r.length || "" === r) return;
                switch (a) {
                    case "--ring-radius": case "--ring-thickness": case "--ring-x": case "--ring-y": case "--particle-size": case "--particle-min-alpha": case "--particle-max-alpha": case "--color-mode":
                        return "random" != r ? parseFloat(r.toString()) : r.toString().trim();
                    case "--particle-count": case "--particle-rows": case "--fade-easing": case "--animation-tick": case "--seed":
                        return "random" != r ? parseInt(r.toString()) : r.toString().trim();
                    default: return r.toString().trim()
                }
            }
            if (!(r instanceof CSSUnparsedValue) || r.length) return r instanceof CSSUnitValue ? r.value : r.toString().trim()
        })
    }

    paint(a, r, e) {
        let [n = "random", i = "random", s = 50, o = 50, l = "random", c = "random", h = "random", m = "random", d = 0, u = 1, p = "ease-in", g = 0, f = 0, colorMode = 0] = this.parseProps(e);

        // Handle undefined or NaN colorMode gracefully
        if (isNaN(colorMode)) colorMode = 0;

        this.getRandom = t(f), "random" === n && (n = this.randomInt(50, 250)), "random" === i && (i = this.randomInt(100, 200)), "random" === l && (l = this.randomInt(50, 200)), "random" === c && (c = this.randomInt(50, 100)), "random" === h && (h = `hsl(${this.randomInt(0, 360)},${this.randomInt(0, 100)}%,${this.randomInt(0, 100)}%)`), "random" === m && (m = this.randomInt(1, 3));
        const M = this.randomInt(2, 8), I = this.randomInt(1, 2), S = this.hash(f + 10) > .5 ? 1 : -1, z = this.randomInt(2, 9), x = -S, P = this.randomFloat(.2, .8), V = this.randomInt(8, 20), k = r.width * s / 100, b = r.height * o / 100, [w, B, y, v] = this.parseEasing(p), C = g * Math.PI * 2, R = n + i, U = i / 2;

        // Removed global fillStyle setting, moved inside loop

        for (let t = 0; t < c; t++) { // t is ring index (0 to particle-rows)
            const r = n + (c > 1 ? t / (c - 1) : 0) * i;

            // Determine ring color if in Concentric mode to avoid re-calc per particle
            // But for Random mode we need per-particle.
            // Optimization: Calculate ring-base color here.

            for (let e = 0; e < l; e++) { // e is particle index in ring (0 to particle-count)
                const i = e / l * Math.PI * 2, s = Math.sin(i * M + C * I * S) + Math.sin(i * z + 1 * C * x) + Math.sin(t * P + C);
                let o = (s + 3) / 6;
                o = Math.pow(Math.max(0, o), 1.5);
                let alpha = d + o * (u - d);
                const h_rad = r + s * V, p_x = k + Math.cos(i) * h_rad, g_y = b + Math.sin(i) * h_rad;
                let f_dist = Math.min(h_rad - n, R - h_rad) / U;
                f_dist < 0 && (f_dist = 0), f_dist > 1 && (f_dist = 1);
                const F = this.solveBezierX(f_dist, w, y);
                alpha *= this.getBezierValue(F, 0, B, v, 1), alpha < 0 && (alpha = 0), alpha > 1 && (alpha = 1);

                if (alpha > .01) {
                    // Set color
                    const particleColor = this.getColor(colorMode, t, c, e);
                    a.fillStyle = particleColor;

                    a.globalAlpha = alpha;
                    a.beginPath();
                    a.arc(p_x, g_y, m, 0, 2 * Math.PI);
                    a.fill();
                }
            }
        }
    }
});
