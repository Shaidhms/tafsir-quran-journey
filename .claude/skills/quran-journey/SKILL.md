---
name: quran-journey
description: Generate interactive Quran learning pages with verse-by-verse explanations, word-by-word Arabic breakdowns, pictorial carousels, and kid-friendly stories. Use this skill when the user asks to learn about a surah, understand Quran verses, learn Quranic Arabic, create visual Quran explanations, or generate surah study pages. Also trigger for "explain surah...", "teach me about surah...", "Quran journey", or "next surah".
---

# Quran Journey

Create beautiful, interactive HTML learning pages for each surah of the Quran. Each page combines deep explanation with visual learning, Arabic word-by-word breakdowns, and animated whiteboard-style doodle carousels.

## Islamic Guidelines (Non-negotiable)

- NEVER depict Allah, prophets, angels, or any religious figures visually
- No faces or human figures in illustrations - use abstract, geometric, nature-based visuals only
- All explanations must be sourced from authentic tafsir: Ibn Kathir, As-Sa'di, Al-Qurtubi
- All hadith references must be from authentic collections (Sahih Bukhari, Sahih Muslim, etc.)
- Include source citations for every hadith and scholarly reference
- When uncertain about a religious detail, flag it and recommend the user verify with a scholar

## Page Structure

Every surah page has TWO main sections toggled by tabs: "Visual Story" (carousel) and "Deep Dive" (detailed learning).

### Section 1: Animated Doodle Carousel (Visual Story)

An interactive, swipeable carousel at the top of the page. Each verse gets a slide with an **animated whiteboard-style doodle** that draws itself live.

#### Animation System (Rough.js + SVG)

Each slide uses **Rough.js in SVG mode** to create hand-drawn doodle illustrations that animate with a "draw-on" effect:

- **Rough.js CDN:** `https://cdn.jsdelivr.net/npm/roughjs@4.6.6/bundled/rough.min.js`
- **Rendering:** SVG mode (`rough.svg(svgElement)`) - NOT canvas mode
- **Animation:** `stroke-dasharray` / `stroke-dashoffset` technique to draw each path progressively
- **Sequencing:** Elements are organized into groups that draw sequentially. Each group animates simultaneously, groups play one after another
- **Fill reveal:** Hachure/solid fills appear after stroke is 60% complete
- **Easing:** Ease-out cubic for natural drawing feel
- **Timing:** ~500-800ms per group, 150ms gap between groups

**CRITICAL - addRoughToGroup pattern:**
When adding Rough.js elements to animation groups, you MUST also append them to the SVG DOM. Rough.js `rc.path()` / `rc.circle()` etc. return `<g>` elements that exist only in memory. The helper function must:
1. Collect child `<path>` elements into the animation group array
2. **Call `svg.appendChild(roughNode)`** to add the `<g>` to the DOM

```js
function addRoughToGroup(roughNode, groupIndex, groups, svg) {
    const paths = roughNode.querySelectorAll('path');
    paths.forEach(p => { if (!groups[groupIndex]) groups[groupIndex] = []; groups[groupIndex].push(p); });
    svg.appendChild(roughNode); // REQUIRED - without this, shapes are invisible
}
```

**Unicode in HTML vs JS:**
- `\uXXXX` escape sequences only work inside JavaScript strings, NOT in HTML content
- For Arabic text in HTML elements (headings, paragraphs), use the actual Unicode characters directly
- For Arabic text in JS string literals (e.g., slide data arrays), `\uXXXX` escapes work fine

#### Pen Cursor (Hand with Pencil)

A small SVG hand-holding-pencil cursor follows the drawing point:

```html
<div id="penCursor">
    <svg viewBox="0 0 64 64" fill="none">
        <rect x="30" y="4" width="8" height="36" rx="1.5" fill="#F9A825" stroke="#E65100" stroke-width="1.5" transform="rotate(35, 34, 22)"/>
        <polygon points="18,50 22,38 26,42" fill="#5D4037" stroke="#3E2723" stroke-width="1"/>
        <polygon points="18,50 20,46 22,48" fill="#2c2c2c"/>
        <rect x="42" y="2" width="8" height="6" rx="1.5" fill="#F48FB1" stroke="#E91E63" stroke-width="1" transform="rotate(35, 46, 5)"/>
        <path d="M26,42 Q20,46 16,52 Q14,56 18,58 Q22,60 28,56 Q32,52 36,50 Q40,48 42,44 Q38,42 34,40 Z" fill="#FFCC80" stroke="#E65100" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M34,40 Q30,44 28,42" fill="none" stroke="#E65100" stroke-width="1" stroke-linecap="round"/>
        <path d="M30,48 Q32,46 34,47" fill="none" stroke="#EF6C00" stroke-width="0.8" stroke-linecap="round"/>
    </svg>
</div>
```

CSS: `position: absolute; z-index: 100; width: 48px; height: 48px; pointer-events: none;`
Positioning: pencil tip is at ~28% x, 78% y of the 48px div. Offset accordingly with `getPointAtLength()`.

#### Typewriter Text (Bottom Panel)

The bottom text panel animates with a typewriter/keystroke effect, synced with the drawing:

1. **Verse badge** pops in (opacity transition)
2. **Arabic text** types out character-by-character (RTL, ~55ms/char) with blinking cursor
3. **Transliteration** types out LTR (~35ms/char)
4. **Kid-friendly explanation** types out LTR (~25ms/char)

Typewriter starts after ~40% of the drawing is complete (e.g., after group 2 finishes).

#### Doodle Visual Style

- **Background:** Cream/off-white (#FFF9F0) with dot grid pattern (mimics notebook)
- **Lines:** Rough.js with `roughness: 1.5-2.5`, hand-drawn wobble
- **Fills:** Hachure style (cross-hatching) for a sketched look
- **Colors:** Warm, muted palette - browns (#5D4037), golds (#F9A825, #c9a84c), greens (#4CAF50), blues (#42A5F5), pinks (#E91E63)
- **Labels:** Caveat font (handwriting style), slight random rotation for hand-written feel
- **No human faces/figures** - use abstract shapes, nature elements, symbols

#### Realistic Scene Composition

Each slide should be a **richly layered environment**, not just isolated symbols. Think of each slide as a detailed whiteboard illustration that tells a visual story.

**Scene Layering (back to front):**
1. **Sky/atmosphere:** Clouds (3 overlapping ellipses per cloud), birds (V-shapes), celestial objects (moon, stars, planets with rings)
2. **Background terrain:** Mountains with snow caps, hills, distant trees, sunset gradients
3. **Mid-ground environment:** Buildings (brick walls, arches, doors with wood grain), fences (picket style), paths (cobblestone), rivers (layered wave lines with ripples)
4. **Foreground details:** Flowers with stems and leaves, grass tufts (double-leaf sprouts), vines on structures, scattered rocks
5. **Atmospheric effects:** Mist (translucent ellipses), dust clouds, smoke wisps, rain, confetti, light rays

**Detail Touches (what makes scenes feel realistic):**
- Doors: Wood grain lines, golden knobs, ornate arches above
- Walls: Individual brick/stone rectangles in rows
- Trees: Bark texture lines on trunks, varied foliage (pine triangles vs round canopy)
- Water: Multiple wave layers at different Y-positions, fish silhouettes
- Paths: Individual cobblestones or footprint marks
- Rope/chains: Individual fiber lines or chain links
- Structures: Iron studs on doors, crenellations on walls, decorative rings on pedestals

**Emotional/Thematic Elements:**
- **Positive themes:** Rainbow arcs (6 colored bands), butterflies, blooming flowers, golden gates with light rays, confetti
- **Negative themes:** Cracked ground, dead trees (bare branches), thorns, lightning bolts, poison drops, cobwebs, frayed rope fibers
- **Spiritual themes:** Mosque arches, crescent moons, calligraphic swirls, shield shapes with emblems, heartbeat lines
- **Journey themes:** Signposts with colored arrows, lamp posts with glowing lights, perspective trees receding into distance

**Group Count Target:** Each slide should have **7-11 animation groups** for a rich drawing experience. Simple slides (e.g., a single object) still need environmental context.

#### Reusable Doodle Primitives

Build scenes using these composable primitives (all drawn with Rough.js):

**Basic shapes:**
- **Star:** 5-pointed polygon with hachure fill
- **Heart:** Bezier path with hachure fill
- **Tree:** Rectangle trunk + overlapping circles for foliage (add bark lines for detail)
- **Mountain:** Triangle with hachure + snow cap polygon + optional ridge lines
- **Sun:** Circle + radiating lines
- **Cloud:** 3 overlapping ellipses with solid fill (not just 1 circle)
- **Raindrop:** Teardrop bezier path
- **Flower:** Circle center + 5 petal circles + line stem + leaves
- **Arrow:** Line + arrowhead lines
- **Speech bubble:** Ellipse with solid fill + text label

**Environment primitives:**
- **Brick wall:** Grid of small rectangles in offset rows
- **Arch/door:** Rectangle + arc path + wood grain lines + knob circle
- **Picket fence:** Vertical rectangles + horizontal rail lines
- **Cobblestone path:** Scattered small ellipses in path shape
- **River/waves:** Multiple wavy lines at different Y-positions
- **Grass tuft:** Short curved lines in clusters, double-leaf sprouts
- **Vine:** Wavy line with small leaf ellipses branching off

**Atmospheric primitives:**
- **Bird (V-shape):** Two short angled lines
- **Butterfly:** Two small ellipses + line body
- **Mist/fog:** Large translucent ellipses (low opacity fill)
- **Lightning:** Zigzag polyline
- **Confetti:** Scattered small rectangles at random angles
- **Smoke wisp:** Wavy bezier path, no fill
- **Light rays:** Lines radiating from a point with low opacity

Each primitive is a function: `drawTree(rc, ctx, x, y, scale)` etc.

#### Carousel Behavior

- Left/right navigation arrows
- Dot indicators for current slide
- Keyboard arrow key support
- Smooth slide transitions (CSS transform translateX)
- Each slide animates its doodle when it becomes visible
- Speed slider (0.3x to 3x) affects both drawing and typewriter
- Replay button per slide

### Section 2: Deep Dive (Detailed Learning)

Same as before - dark mode detailed content section:

1. **Quick Facts:** Surah number, verse count, word count, revelation place, other names, when recited
2. **The Story Behind This Surah:** Narrative-style context of revelation, why it matters, relevant hadith
3. **Verse by Verse with Word-by-Word Arabic:**
   - Arabic text (Amiri font, right-to-left)
   - Transliteration
   - English translation
   - Word-by-word breakdown grid (Arabic -> transliteration -> meaning)
   - Friendly explanation for each verse
4. **Arabic Learning Section:**
   - Key vocabulary from this surah (with Quran-wide frequency)
   - Grammar patterns found in this surah
   - Root word analysis
   - Verb forms and pronoun patterns
5. **Key Lessons:** Practical takeaways
6. **Recommended Resources:** For further study
7. **Sources & Authenticity Note:** Full citation of tafsir and hadith sources used

## Visual Design

### Overall Theme
- Dark mode for deep dive: Background #0a0a0a, cards #111, borders #222
- Gold accent: #c9a84c (for headings, highlights, verse numbers)
- Blue accent: #8ab4f8 (for transliterations, links, soft highlights)
- Text: #e0e0e0 primary, #ccc secondary, #888 tertiary
- Arabic font: 'Amiri' (Google Fonts)
- Latin font: 'Inter' (Google Fonts)
- Handwriting font: 'Caveat' (Google Fonts) - for carousel labels and kid text

### Carousel Slides
- Light mode: Cream background (#FFF9F0) with dot grid
- Bottom panel: Warm (#FFF3E0) with dashed border-top
- Full-width, 16:9 aspect ratio canvas area
- SVG viewBox: 0 0 900 506

### Responsive
- Mobile-first: works on phones, tablets, desktops
- Touch-swipe support on mobile
- Arabic text scales appropriately
- Pen cursor hides on mobile (optional)

## Technical Stack

- **Single self-contained HTML file** per surah (no build step)
- **Rough.js 4.6.6** from CDN for hand-drawn SVG rendering
- **Google Fonts:** Amiri, Caveat, Inter
- **No other dependencies**

## File Structure

```
quran-journey/
  001-al-fatiha.html
  108-al-kawthar.html
  110-an-nasr.html
  111-al-masad.html
  114-an-nas.html
  index.html              (table of contents)
  doodle-poc.html          (proof of concept - reference)
  doodle-animated-poc.html (animated reference)
```

File naming: `[3-digit-number]-[surah-name-transliterated].html`

## Process

1. **Research:** Gather tafsir from Ibn Kathir and As-Sa'di for the surah. Note authentic hadith related to it.
2. **Structure content:** Break down each verse with word-by-word Arabic analysis
3. **Design doodle scenes:** Choose visual metaphors for each verse using the primitive library (stars, trees, mountains, hearts, arrows, etc.)
4. **Write explanations:** Two versions per verse - kid-friendly (carousel typewriter) and detailed (deep dive)
5. **Compose animation groups:** Organize each scene into sequential drawing groups for the animation engine
6. **Arabic learning:** Identify key vocabulary, patterns, and root words from the surah
7. **Generate HTML:** Single self-contained HTML file with embedded CSS and JS
8. **Open in browser** for the user to review
9. **Iterate** based on feedback

## Output

Save each surah page to: `quran-journey/[number]-[name].html`

Present to user:
1. Open the page in the browser
2. Briefly describe what's included
3. Ask: "Want me to adjust anything or continue to the next surah?"
