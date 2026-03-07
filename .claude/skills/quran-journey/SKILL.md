---
name: quran-journey
description: Generate interactive Quran learning pages with verse-by-verse explanations, word-by-word Arabic breakdowns, pictorial carousels, and kid-friendly stories. Use this skill when the user asks to learn about a surah, understand Quran verses, learn Quranic Arabic, create visual Quran explanations, or generate surah study pages. Also trigger for "explain surah...", "teach me about surah...", "Quran journey", or "next surah".
---

# Quran Journey

Create beautiful, interactive HTML learning pages for each surah of the Quran. Each page features **3D cartoon-style doodle illustrations** that animate with a pencil drawing effect, verse-by-verse.

## Islamic Guidelines (Non-negotiable)

- NEVER depict Allah, prophets, angels, or any religious figures visually
- Cartoon figures should be generic (no specific prophet likenesses) - use simple cartoon people with head coverings
- All explanations must be sourced from authentic tafsir: Ibn Kathir, As-Sa'di, Al-Qurtubi
- All hadith references must be from authentic collections (Sahih Bukhari, Sahih Muslim, etc.)
- Include source citations for every hadith and scholarly reference
- When uncertain about a religious detail, flag it and recommend the user verify with a scholar

## Architecture: 3D Cartoon Doodle System

### Overview

Each surah page is a **single self-contained HTML file** with:
- A carousel of verses, each with an animated cartoon illustration
- Pen cursor that follows the drawing point
- Typewriter text that types out Arabic, transliteration, and explanation
- Prev/Next navigation + verse dots + keyboard arrows + speed control

### Key Difference from Old System

**Old:** Rough.js flat hand-drawn doodles with hachure fills
**New:** SVG with gradients, shadows, highlights for **3D cartoon look** - like a skilled artist drawing cartoon characters on a whiteboard

### Technical Stack

- **Single self-contained HTML file** per surah (no build step, no external dependencies except fonts)
- **Pure SVG** with gradients, filters, and cartoon-style paths (NO Rough.js)
- **Google Fonts:** Amiri (Arabic), Caveat (handwriting), Inter (UI)
- **Animation:** `stroke-dasharray` / `stroke-dashoffset` for draw-on effect + opacity fades for fills

## Page Structure

### HTML Shell

```html
<div class="header">
    <div class="arabic-title">[Arabic surah name]</div>
    <h1>[English surah name]</h1>
    <p>[Details - verse count, Makkan/Madani]</p>
</div>

<div class="slide-frame">
    <div class="slide-drawing" id="slideDrawing">
        <div id="penCursor">[realistic pencil SVG]</div>
    </div>
    <div class="slide-bottom">
        <div class="verse-num-badge" id="verseBadge"></div>
        <div class="slide-arabic-text" id="arabicText"></div>
        <div class="slide-translit-text" id="translitText"></div>
        <div class="slide-kid-text" id="kidText"></div>
    </div>
</div>

<div class="controls">
    <button id="prevBtn">Prev</button>
    <span class="verse-indicator" id="verseIndicator">1 / N</span>
    <button id="nextBtn">Next</button>
    <button>Replay</button>
</div>
<div class="verse-dots" id="verseDots"></div>
<div class="speed-control">[slider 0.3x - 3x]</div>
```

### Verse Data Array

```js
const verses = [
    {
        num: 1,
        arabic: '[Arabic text]',
        translit: '[Transliteration]',
        explanation: '[Kid-friendly explanation]',
        build: buildVerse1
    },
    // ...
];
```

Each verse has a `build` function that returns `{ svg, groups }`.

## SVG Illustration System

### Common Setup (reusable across all surahs)

Every build function starts with:
```js
function buildVerseN() {
    const { svg, groups, add } = initSvg();
    // add(groupIndex, svgElement) - adds to group AND appends to SVG DOM
    // ... draw scene ...
    return { svg, groups };
}
```

`initSvg()` creates the SVG, adds common defs (gradients, filters, patterns), and returns the `add` helper.

### CRITICAL: Always append to SVG DOM

The `add()` function MUST do both:
1. Push the node to the animation group array
2. Call `svg.appendChild(node)` to add it to the DOM

Without step 2, elements are invisible.

### Common Gradients & Filters (defined in `addCommonDefs`)

**Linear gradients:** skyGrad, skyNight, skyDramatic, groundGrad, trunkGrad, robeGrad, doorGrad, lightGrad, pathGold, waterGrad
**Radial gradients:** sunGlow, skinGrad, cloudGrad, leafGrad, mercyGlow
**Filters:** glow (gaussian blur merge), softShadow (drop shadow)
**Patterns:** dots (dot grid for whiteboard feel)

### SVG Helper Functions

```js
el(tag, attrs)           // Create any SVG element
pathEl(d, fill, stroke, sw, join)  // Create <path>
lineEl(x1, y1, x2, y2, stroke, sw) // Create <line>
textEl(text, x, y, opts) // Create <text> with Caveat font
cartoonCloud(cx, cy, scale) // 3D puffy cloud (5 ellipses + highlight)
cartoonSparkle(cx, cy, size) // 4-pointed star with glow filter
cartoonStar(cx, cy, outerR, innerR, fill, stroke) // 5-pointed star
drawPerson(add, gi, cx, cy, scale, opts) // Reusable cartoon person
```

### 3D Cartoon Style Guidelines

**What makes it "3D cartoon":**
- **Gradients** on everything: linear for flat surfaces (trunks, robes), radial for round objects (sun, heads, fruits)
- **Highlights:** White/light overlays at the light-facing side (e.g., top-left of circles, left side of trunks)
- **Drop shadows:** `filter: url(#softShadow)` on clouds, characters, key objects
- **Glow effects:** `filter: url(#glow)` on sparkles, sun, light sources
- **Cartoon eyes:** White ellipse + dark pupil + tiny white shine dot
- **Thick outlines:** 2-3px strokes with rounded joins
- **Warm color palette:** Rich gradients, not flat colors

**Cartoon person (reusable `drawPerson`):**
- Head: circle with skin gradient, highlight, cartoon eyes (white + pupil + shine)
- Head covering: curved path in light grey
- Body: robe with gradient, fold lines
- Mouth: smile path or "awe" ellipse
- Optional: raised arms with circular hands

### Scene Composition Per Verse

Each verse illustration should be a **complete scene**, not isolated symbols.

**Layer order (back to front):**
1. Sky/atmosphere (gradient fills)
2. Distant elements (hills, mountains, clouds)
3. Mid-ground (buildings, trees, water)
4. Foreground (characters, ground details)
5. Overlay effects (sparkles, light rays, labels)
6. Title text

**Group count:** 6-10 animation groups per verse. Each group animates ~600ms with 100ms gaps.

### Realistic Pencil Cursor

A detailed SVG pencil with:
- Yellow body with 3D linear gradient + highlight stripe
- Silver ferrule with crimp lines
- Pink eraser with highlight
- Sharpened wood cone with gradient
- Dark graphite tip with shine
- Drop shadow filter

```css
#penCursor { width: 52px; height: 65px; }
```
Tip offset: `tipOffsetX = 18, tipOffsetY = 58`

## Animation Engine

### Hide + Animate Pattern

1. **Build scene** -> returns `{ svg, groups }`
2. **hideAllPaths(groups)** -> sets `strokeDashoffset` or `opacity: 0` on all elements
3. **Loop through groups sequentially:**
   - `await animateGroup(groups[i], 600)`
   - Trigger typewriter text at ~40% through groups
4. **hidePen()** when done

### Key: try/catch around getTotalLength

Elements inside `<g>` with filters may throw "non-rendered element" errors. Always wrap:
```js
try {
    if (el.getTotalLength) {
        const len = el.getTotalLength();
        // ... use strokeDasharray/offset
    }
} catch(e) {}
// fallback: opacity-based animation
```

### Typewriter Engine

Animates text character-by-character with blinking cursor:
1. Verse badge pops in
2. Arabic text types RTL (~50ms/char)
3. Transliteration types LTR (~30ms/char)
4. Kid-friendly explanation types LTR (~20ms/char)

Starts after ~40% of drawing groups complete.

## Visual Design

### Color Scheme
- **Dark UI:** Background #0a0a0a, text #e0e0e0
- **Gold accent:** #c9a84c (headings, highlights, verse nav)
- **Canvas:** Cream #FFF9F0 with dot grid, bottom panel #FFF3E0
- **Verse badge:** Orange #e67e22

### Fonts
- **Arabic:** 'Amiri', serif (RTL)
- **Handwriting/labels:** 'Caveat', cursive
- **UI:** 'Inter', sans-serif

### SVG Canvas
- ViewBox: `0 0 900 506` (16:9 aspect ratio)
- Slide frame: max-width 900px, rounded corners, border, box-shadow

## File Structure

```
quran-journey/
  index.html                    (table of contents)
  001-al-fatiha.html           (3D cartoon version)
  108-al-kawthar.html          (3D cartoon version)
  110-an-nasr.html             (3D cartoon version)
  111-al-masad.html            (3D cartoon version)
  114-an-nas.html              (3D cartoon version)
  3d-cartoon-poc.html          (original PoC - reference)
  archives/                    (old Rough.js versions)
```

File naming: `[3-digit-number]-[surah-name-transliterated].html`

## Process

1. **Research:** Gather tafsir from Ibn Kathir and As-Sa'di. Note relevant hadith.
2. **Plan scenes:** Choose a visual concept for each verse (nature scenes, metaphors, journeys)
3. **Build verse data:** Arabic text, transliteration, kid-friendly explanation per verse
4. **Draw scenes:** Using SVG helpers, gradients, cartoon style - compose rich layered scenes
5. **Test animation:** Open in browser, check all verses animate correctly, no JS errors
6. **Open for review:** Let user navigate through all verses

## Reference Implementation

See `001-al-fatiha.html` for the complete reference implementation with all 7 verses, full animation engine, realistic pencil cursor, and navigation controls.
