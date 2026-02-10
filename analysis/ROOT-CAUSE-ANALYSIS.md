# ROOT CAUSE ANALYSIS: Why triclock.franzai.com Looks Dull vs show.franzai.com

**Date:** 2026-02-10
**Analyst:** Claude Opus 4.6
**Method:** 7-Whys Root Cause + Code Diff

## Screenshots
- `show-franzai-REFERENCE.png` — The vibrant reference (1 solid triangle, neon glow)
- `triclock-CURRENT.png` — Our version (10 washed-out overlapping triangles)

---

## WHY #1: Why does triclock look washed-out?
**ANSWER:** 10 overlapping triangles with `screen` blending create an over-bright, desaturated mess. Screen blending ADDS light — 10 overlapping colored layers push everything toward white.

## WHY #2: Why are there 10 triangles?
**ANSWER:** The original/index.html has 4 layer groups (sector=3, cross=3, wedge=3, primary=1 = 10 total). The show.franzai.com version has only 1 triangle (the primary hTip-mTip-sTip triangle). **These are DIFFERENT codebases.**

## WHY #3: Why are the colors different?
**ANSWER:** show.franzai.com uses brighter neon colors:
| Color | show.franzai.com | triclock (original) |
|-------|-----------------|-------------------|
| Hours | `#ff3366` (HOT pink) | `#ff2a6d` (darker pink) |
| Minutes | `#00d4ff` (bright cyan) | `#05d9e8` (duller teal) |
| Seconds | `#b8ff00` (neon yellow-green) | `#d1f7a0` (pastel green) |

The show version colors have HIGHER saturation and brightness. `#b8ff00` vs `#d1f7a0` is the biggest gap.

## WHY #4: Why does the show version glow better?
**ANSWER:** show.franzai.com uses `ctx.shadowBlur = 50` on a single triangle stroke — this creates a beautiful soft neon aura that bleeds outward. Our version uses 5-pass multi-width strokes which create thin layered borders, not a diffuse glow.

## WHY #5: Why does the single triangle look more solid/vibrant?
**ANSWER:** show.franzai.com fills at `alpha = 0.85` with a SINGLE triangle, plus adds per-vertex radial gradient tinting (lighter hue at hTip, darker at mTip). This creates color depth in ONE layer. Our version fills at `alpha = 0.75` but with 10 overlapping triangles that cancel each other's vibrancy through screen blending.

## WHY #6: Why are the tips/dots less impactful in triclock?
**ANSWER:**
| Element | show.franzai.com | triclock |
|---------|-----------------|---------|
| Hour tip radius | 6 | 4 |
| Min tip radius | 5 | 3.5 |
| Sec tip radius | 4 | 3 |
| Hour glow ratio | 0.08 | 0.06 |
| Min glow ratio | 0.07 | 0.05 |
| Sec glow ratio | 0.06 | 0.05 |
| Vertex dot radius | 4 | 2.5 |
| Vertex dot alpha | 0.6 | 0.5 |
| Glow stops | 0/0.3/1 | 0/0.2/0.5/1 |

Bigger dots + bigger glow = more visual presence.

## WHY #7: Why was show.franzai.com a different version?
**ANSWER:** show.franzai.com hosts an EARLIER/DIFFERENT iteration of the clock concept. It was a simpler design focused on a single color-mapped triangle. The original/index.html in our repo is a MORE COMPLEX evolution with 10 layered triangles. The complexity KILLED the vibrancy.

---

## FUNDAMENTAL ROOT CAUSE

**show.franzai.com and original/index.html are TWO COMPLETELY DIFFERENT CODEBASES.**

| Aspect | show.franzai.com (VIBRANT) | original/index.html (COMPLEX) |
|--------|--------------------------|------------------------------|
| Triangles | 1 (primary only) | 10 (sector+cross+wedge+primary) |
| Fill alpha | 0.85 | 0.75 (primary), 0.2-0.35 (others) |
| Composite | None (normal) | `screen` (additive light) |
| Triangle glow | `shadowBlur=50` (soft neon aura) | 5-pass multi-width strokes |
| Per-vertex tint | Yes (radial gradients) | No |
| Edge progress | 1 pass (6px) + core (3px) | 2 passes (14px+8px) + core (3.5px) |
| Tip radius | 6/5/4 | 4/3.5/3 |
| Glow radius | 0.08/0.07/0.06 | 0.06/0.05/0.05 |
| Vertex radius | 4 | 2.5 |
| Colors | #ff3366/#00d4ff/#b8ff00 | #ff2a6d/#05d9e8/#d1f7a0 |
| HSL sat range | 80-100 | 90-100 |
| HSL lit range | 20-70 | 35-75 |
| Canvas context | `getContext('2d')` | `getContext('2d', {alpha:false})` |
| DPR scaling | No | Yes |
| Edge labels | Yes ("HOURS→LUM") | No |
| Digital time alpha | 0.13 (ghost) | 0.9 (bold) |
| Digital time position | Inside triangle (0.28) | Below triangle (0.85) |

---

## THE FIX

To make triclock.franzai.com match show.franzai.com vibrancy:

1. **Switch to show.franzai.com colors**: `#ff3366`, `#00d4ff`, `#b8ff00`
2. **Disable extra triangle layers** (sector, cross, wedge) — only show primary
3. **Increase primary fill alpha** to 0.85
4. **Increase tip sizes** to 6/5/4 with glow 0.08/0.07/0.06
5. **Increase vertex dot sizes** to 4 with alpha 0.6
6. **Match digital time**: alpha 0.13, inside triangle at 0.28, show seconds
7. **Simplify edge progress** to single pass
8. **Adjust glow circle gradient stops** to match show version (0/0.3/1 instead of 0/0.2/0.5/1)
