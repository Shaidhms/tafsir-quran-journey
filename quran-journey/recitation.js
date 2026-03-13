/**
 * Quran Journey - Recitation Module
 * Auto-injects recitation features into any surah page.
 *
 * Usage: <script src="recitation.js"></script>
 *
 * Auto-detects surah number from page. Reads verse data from existing DOM.
 * Adds: (1) Mute button to carousel, (2) Play buttons in deep dive, (3) Recitation tab.
 */
(function() {
    'use strict';

    // ===== AUTO-DETECT SURAH NUMBER =====
    const progressEl = document.querySelector('.nav-bar .progress');
    const surahNum = progressEl
        ? parseInt(progressEl.textContent.match(/\d+/)?.[0] || '0')
        : 0;
    if (!surahNum) return;

    // ===== EXTRACT VERSE DATA FROM DEEP DIVE =====
    const verseCards = document.querySelectorAll('.deep-dive-section .verse-card, .deep-dive-section .verse-card.reveal-3d');
    const verseData = [];
    verseCards.forEach(card => {
        const numEl = card.querySelector('.verse-number');
        const arabicEl = card.querySelector('.verse-arabic');
        const translitEl = card.querySelector('.verse-transliteration');
        if (numEl && arabicEl) {
            verseData.push({
                num: parseInt(numEl.textContent),
                arabic: arabicEl.textContent.trim(),
                translit: translitEl ? translitEl.textContent.trim() : ''
            });
        }
    });
    if (!verseData.length) return;

    const RECITERS = [
        { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', flag: '\u{1F1F0}\u{1F1FC}' },
        { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)', flag: '\u{1F1EA}\u{1F1EC}' },
        { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary', flag: '\u{1F1EA}\u{1F1EC}' },
        { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq El-Minshawi', flag: '\u{1F1EA}\u{1F1EC}' },
        { id: 'Abdurrahmaan_As-Sudais_192kbps', name: 'Abdur-Rahman As-Sudais', flag: '\u{1F1F8}\u{1F1E6}' }
    ];

    let activeReciter = RECITERS[0].id;

    function audioUrl(reciter, sNum, vNum) {
        return `https://everyayah.com/data/${reciter}/${String(sNum).padStart(3,'0')}${String(vNum).padStart(3,'0')}.mp3`;
    }

    // ================================================================
    // 1. CAROUSEL: Mute button + auto-play audio with verse changes
    // ================================================================
    let carouselMuted = false;
    let carouselAudio = null;

    function injectMuteButton() {
        const controls = document.querySelector('.controls');
        if (!controls) return;
        const btn = document.createElement('button');
        btn.className = 'mute-btn';
        btn.id = 'muteBtn';
        btn.title = 'Toggle recitation audio';
        btn.innerHTML = `<svg viewBox="0 0 24 24" id="muteIcon"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
        btn.onclick = toggleMute;
        controls.appendChild(btn);
    }

    function toggleMute() {
        carouselMuted = !carouselMuted;
        const btn = document.getElementById('muteBtn');
        const icon = document.getElementById('muteIcon');
        if (carouselMuted) {
            btn.classList.add('muted');
            icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
            if (carouselAudio) { carouselAudio.pause(); carouselAudio = null; }
        } else {
            btn.classList.remove('muted');
            icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
            if (typeof currentVerse !== 'undefined') playCarouselAudio(currentVerse + 1);
        }
    }

    function playCarouselAudio(verseNum) {
        if (carouselMuted || verseNum < 1 || verseNum > verseData.length) return;
        if (carouselAudio) { carouselAudio.pause(); carouselAudio = null; }
        carouselAudio = new Audio(audioUrl(activeReciter, surahNum, verseNum));
        carouselAudio.play().catch(() => {});
    }

    function hookCarouselNav() {
        // Hook goVerse if it exists globally
        if (typeof window.goVerse === 'function') {
            const orig = window.goVerse;
            window.goVerse = function(index) {
                orig(index);
                if (index >= 0 && index < verseData.length) playCarouselAudio(index + 1);
            };
        }
        // Hook playVerse if it exists globally
        if (typeof window.playVerse === 'function') {
            const orig = window.playVerse;
            window.playVerse = async function(index) {
                playCarouselAudio(index + 1);
                return orig(index);
            };
        }
        // Unlock audio on first click
        document.addEventListener('click', function unlock() {
            if (!carouselMuted && typeof currentVerse !== 'undefined' && currentVerse >= 0) {
                playCarouselAudio(currentVerse + 1);
            }
            document.removeEventListener('click', unlock);
        }, { once: true });
    }

    // ================================================================
    // 2. DEEP DIVE: Play buttons on each verse card
    // ================================================================
    let ddAudio = null;
    let ddActiveBtn = null;

    function injectDeepDiveButtons() {
        verseCards.forEach((card, i) => {
            const translitEl = card.querySelector('.verse-transliteration');
            const translationEl = card.querySelector('.verse-translation');
            const insertAfter = translationEl || translitEl;
            if (!insertAfter) return;

            const btn = document.createElement('button');
            btn.className = 'verse-audio-btn';
            btn.dataset.verse = verseData[i].num;
            btn.innerHTML = `<svg class="dd-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><div class="dd-wave-bars"><span></span><span></span><span></span><span></span></div> Listen`;
            btn.onclick = function() { toggleDDAudio(btn, verseData[i].num); };
            insertAfter.parentNode.insertBefore(btn, insertAfter.nextSibling);
        });
    }

    function toggleDDAudio(btn, verseNum) {
        if (ddActiveBtn === btn && ddAudio && !ddAudio.paused) {
            ddAudio.pause(); ddAudio = null;
            btn.classList.remove('playing');
            ddActiveBtn = null;
            return;
        }
        if (ddAudio) ddAudio.pause();
        if (ddActiveBtn) ddActiveBtn.classList.remove('playing');

        ddAudio = new Audio(audioUrl(activeReciter, surahNum, verseNum));
        ddActiveBtn = btn;
        btn.classList.add('playing');
        ddAudio.play().catch(() => { btn.classList.remove('playing'); ddActiveBtn = null; });
        ddAudio.onended = () => { btn.classList.remove('playing'); ddActiveBtn = null; };
    }

    // ================================================================
    // 3. RECITATION TAB: Full player
    // ================================================================
    let recAudioElements = [];
    let recCurrentVerseIndex = -1;
    let recIsPlaying = false;
    let recRepeatMode = 'surah';
    let recPlaybackSpeed = 1;
    let recInitialized = false;

    function injectRecitationTab() {
        // Add tab button to view-toggle
        const toggle = document.querySelector('.view-toggle');
        if (!toggle) return;
        const recBtn = document.createElement('button');
        recBtn.textContent = 'Recitation';
        recBtn.onclick = function() { showRecView('recitation'); };
        toggle.appendChild(recBtn);

        // Patch showView to handle recitation
        patchShowView(toggle);

        // Build recitation section
        const section = document.createElement('div');
        section.className = 'recitation-section';
        section.id = 'recitation-view';
        section.innerHTML = buildRecitationHTML();

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) footer.parentNode.insertBefore(section, footer);
        else document.body.appendChild(section);
    }

    function buildRecitationHTML() {
        const reciterBtns = RECITERS.map((r, i) =>
            `<button class="reciter-btn${i === 0 ? ' active' : ''}" data-reciter="${r.id}" data-name="${r.name}">${r.flag} ${r.name.split(' ').pop()}</button>`
        ).join('');

        const verseRows = verseData.map((v, i) => `
            <div class="rec-verse-row" data-index="${i}">
                <div class="rec-verse-play-icon">
                    <svg class="rec-play-icon" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    <div class="rec-wave-bars"><span></span><span></span><span></span><span></span><span></span></div>
                </div>
                <div class="rec-verse-num">${v.num}</div>
                <div class="rec-verse-text">
                    <div class="rec-verse-arabic">${v.arabic}</div>
                    <div class="rec-verse-translit">${v.translit}</div>
                </div>
            </div>`).join('');

        return `
        <div class="reciter-selector" id="reciterSelector">${reciterBtns}</div>
        <div class="player-card">
            <div class="player-header">
                <div>
                    <div class="player-title">Listen to Recitation</div>
                    <div class="reciter-name-label" id="recReciterName">${RECITERS[0].name}</div>
                </div>
                <div class="rec-loading-spinner" id="recSpinner"></div>
            </div>
            <div class="surah-player">
                <button class="play-all-btn" id="recPlayBtn">
                    <svg viewBox="0 0 24 24" id="recPlayIcon"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <div class="progress-container">
                    <div class="progress-bar" id="recProgressBar">
                        <div class="progress-fill" id="recProgressFill"></div>
                    </div>
                    <div class="progress-time">
                        <span id="recCurrentTime">0:00</span>
                        <span id="recTotalTime">0:00</span>
                    </div>
                </div>
            </div>
            <div class="rec-verse-list">${verseRows}</div>
            <div class="repeat-controls">
                <span class="repeat-label">Repeat:</span>
                <button class="repeat-btn" data-mode="none">Off</button>
                <button class="repeat-btn active" data-mode="surah">Surah</button>
                <button class="repeat-btn" data-mode="verse">Verse</button>
                <div class="speed-selector">
                    <span class="repeat-label">Speed:</span>
                    <select id="recSpeedSelect">
                        <option value="0.5">0.5x</option>
                        <option value="0.75">0.75x</option>
                        <option value="1" selected>1x</option>
                        <option value="1.25">1.25x</option>
                        <option value="1.5">1.5x</option>
                    </select>
                </div>
            </div>
            <div class="rec-error-msg" id="recErrorMsg"></div>
        </div>`;
    }

    function initRecTab() {
        if (recInitialized) return;
        recInitialized = true;

        // Play button
        document.getElementById('recPlayBtn').onclick = toggleRecPlay;

        // Progress bar seek
        document.getElementById('recProgressBar').onclick = recSeek;

        // Verse row clicks
        document.querySelectorAll('.rec-verse-row').forEach((row, i) => {
            row.onclick = () => recPlayFrom(i);
        });

        // Reciter buttons
        document.querySelectorAll('#reciterSelector .reciter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('#reciterSelector .reciter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeReciter = btn.dataset.reciter;
                document.getElementById('recReciterName').textContent = btn.dataset.name;
                recPauseAll();
                recCurrentVerseIndex = -1;
                recHighlight(-1);
                document.getElementById('recProgressFill').style.width = '0%';
                document.getElementById('recCurrentTime').textContent = '0:00';
                document.getElementById('recTotalTime').textContent = '0:00';
                loadRecAudio();
            };
        });

        // Repeat buttons
        document.querySelectorAll('.repeat-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.repeat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                recRepeatMode = btn.dataset.mode;
            };
        });

        // Speed
        document.getElementById('recSpeedSelect').onchange = function() {
            recPlaybackSpeed = parseFloat(this.value);
            recAudioElements.forEach(a => a.playbackRate = recPlaybackSpeed);
        };

        loadRecAudio();
    }

    function loadRecAudio() {
        recAudioElements.forEach(a => { a.pause(); a.src = ''; });
        recAudioElements = [];
        const spinner = document.getElementById('recSpinner');
        if (spinner) spinner.style.display = 'block';
        const errEl = document.getElementById('recErrorMsg');
        if (errEl) errEl.style.display = 'none';

        let loaded = 0;
        verseData.forEach((v, i) => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.playbackRate = recPlaybackSpeed;
            audio.src = audioUrl(activeReciter, surahNum, v.num);
            audio.addEventListener('canplaythrough', () => {
                loaded++;
                if (loaded === verseData.length && spinner) spinner.style.display = 'none';
            }, { once: true });
            audio.addEventListener('error', () => {
                if (spinner) spinner.style.display = 'none';
                if (errEl) { errEl.textContent = 'Could not load audio for this reciter.'; errEl.style.display = 'block'; }
            });
            audio.addEventListener('ended', () => recOnEnd(i));
            audio.addEventListener('timeupdate', () => { if (i === recCurrentVerseIndex) recUpdateProgress(); });
            recAudioElements.push(audio);
        });
    }

    function toggleRecPlay() {
        if (recIsPlaying) recPauseAll();
        else { if (recCurrentVerseIndex < 0) recCurrentVerseIndex = 0; recPlayCurrent(); }
    }

    function recPlayFrom(i) { recPauseAll(); recCurrentVerseIndex = i; recPlayCurrent(); }

    function recPlayCurrent() {
        if (recCurrentVerseIndex < 0 || recCurrentVerseIndex >= recAudioElements.length) return;
        const a = recAudioElements[recCurrentVerseIndex];
        a.playbackRate = recPlaybackSpeed;
        a.play().then(() => { recIsPlaying = true; recUpdateBtn(); recHighlight(recCurrentVerseIndex); }).catch(() => {
            const e = document.getElementById('recErrorMsg');
            if (e) { e.textContent = 'Playback failed. Try clicking again.'; e.style.display = 'block'; }
        });
    }

    function recPauseAll() { recAudioElements.forEach(a => a.pause()); recIsPlaying = false; recUpdateBtn(); }

    function recOnEnd(i) {
        if (recRepeatMode === 'verse') { recAudioElements[i].currentTime = 0; recAudioElements[i].play(); return; }
        if (i + 1 < verseData.length) { recCurrentVerseIndex = i + 1; recPlayCurrent(); }
        else if (recRepeatMode === 'surah') { recCurrentVerseIndex = 0; recAudioElements.forEach(a => a.currentTime = 0); recPlayCurrent(); }
        else { recIsPlaying = false; recUpdateBtn(); recHighlight(-1); }
    }

    function recUpdateBtn() {
        const icon = document.getElementById('recPlayIcon');
        if (icon) icon.innerHTML = recIsPlaying
            ? '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            : '<path d="M8 5v14l11-7z"/>';
    }

    function recHighlight(idx) {
        document.querySelectorAll('.rec-verse-row').forEach((r, i) => r.classList.toggle('playing', i === idx));
    }

    function recUpdateProgress() {
        const a = recAudioElements[recCurrentVerseIndex];
        if (!a || !a.duration) return;
        let total = 0, elapsed = 0;
        recAudioElements.forEach((au, i) => {
            const d = au.duration || 0; total += d;
            if (i < recCurrentVerseIndex) elapsed += d;
            if (i === recCurrentVerseIndex) elapsed += au.currentTime;
        });
        document.getElementById('recProgressFill').style.width = (total > 0 ? (elapsed/total)*100 : 0) + '%';
        document.getElementById('recCurrentTime').textContent = fmt(elapsed);
        document.getElementById('recTotalTime').textContent = fmt(total);
    }

    function recSeek(e) {
        const bar = document.getElementById('recProgressBar');
        const pct = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
        let total = 0;
        recAudioElements.forEach(a => total += (a.duration || 0));
        const target = pct * total;
        let acc = 0;
        for (let i = 0; i < recAudioElements.length; i++) {
            const d = recAudioElements[i].duration || 0;
            if (acc + d > target) { recPauseAll(); recCurrentVerseIndex = i; recAudioElements[i].currentTime = target - acc; recPlayCurrent(); return; }
            acc += d;
        }
    }

    function fmt(s) { return Math.floor(s/60) + ':' + String(Math.floor(s%60)).padStart(2,'0'); }

    // ================================================================
    // VIEW TOGGLE PATCH
    // ================================================================
    function patchShowView(toggle) {
        // Override the existing showView
        const origShow = window.showView;
        window.showView = function(view) {
            const recSection = document.getElementById('recitation-view');
            const buttons = toggle.querySelectorAll('button');

            if (view === 'recitation') {
                showRecView('recitation');
            } else {
                if (recSection) recSection.classList.remove('visible');
                buttons.forEach(b => b.classList.remove('active'));
                // Call original for carousel/deep-dive but re-add active class
                if (origShow) origShow(view);
                // Make sure correct button is active
                if (view === 'carousel') buttons[0]?.classList.add('active');
                else if (view === 'deep-dive') buttons[1]?.classList.add('active');
            }
        };
    }

    function showRecView() {
        const carousel = document.getElementById('carousel-view');
        const deepDive = document.getElementById('deep-dive-view');
        const recSection = document.getElementById('recitation-view');
        const buttons = document.querySelectorAll('.view-toggle button');

        if (carousel) carousel.classList.add('hidden');
        if (deepDive) deepDive.classList.remove('visible');
        buttons.forEach(b => b.classList.remove('active'));
        buttons[buttons.length - 1]?.classList.add('active');
        if (recSection) recSection.classList.add('visible');
        if (!recInitialized) initRecTab();
    }

    // ================================================================
    // INIT ON DOM READY
    // ================================================================
    function init() {
        injectMuteButton();
        injectDeepDiveButtons();
        injectRecitationTab();
        hookCarouselNav();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, but we need to wait for the page's own scripts to run
        setTimeout(init, 100);
    }
})();
