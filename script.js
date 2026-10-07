const webDevPairs = [
    { concept: 'Thẻ tạo liên kết (Link)', code: '<a>', category: 'html' },
    { concept: 'Thẻ chèn hình ảnh', code: '<img>', category: 'html' },
    { concept: 'Thẻ bọc nội dung khối', code: '<div>', category: 'html' },
    { concept: 'Tạo danh sách không thứ tự', code: '<ul>', category: 'html' },
    { concept: 'Thẻ tạo bảng', code: '<table>', category: 'html' },
    { concept: 'Thẻ nhập dữ liệu người dùng', code: '<input>', category: 'html' },
    { concept: 'Thẻ tiêu đề lớn nhất', code: '<h1>', category: 'html' },
    { concept: 'Thẻ chứa thông tin trang', code: '<head>', category: 'html' },
    { concept: 'Thẻ tạo nút bấm', code: '<button>', category: 'html' },
    { concept: 'Thẻ tạo đoạn văn bản', code: '<p>', category: 'html' },
    { concept: 'Thay đổi màu chữ', code: 'color', category: 'css' },
    { concept: 'Màu nền', code: 'background-color', category: 'css' },
    { concept: 'Cỡ chữ', code: 'font-size', category: 'css' },
    { concept: 'In đậm chữ', code: 'font-weight: bold', category: 'css' },
    { concept: 'Bo góc phần tử', code: 'border-radius', category: 'css' },
    { concept: 'Căn giữa nội dung Flex', code: 'justify-content: center', category: 'css' },
    { concept: 'Khoảng cách bên trong', code: 'padding', category: 'css' },
    { concept: 'Khoảng cách bên ngoài', code: 'margin', category: 'css' },
    { concept: 'Làm mờ phần tử', code: 'opacity', category: 'css' },
    { concept: 'Hiệu ứng chuyển đổi', code: 'transition', category: 'css' },
    { concept: 'In ra màn hình console', code: 'console.log()', category: 'js' },
    { concept: 'Khai báo hằng số', code: 'const', category: 'js' },
    { concept: 'Bắt sự kiện', code: 'addEventListener()', category: 'js' },
    { concept: 'Lấy phần tử theo ID', code: 'getElementById()', category: 'js' },
    { concept: 'Lấy phần tử bằng CSS Selector', code: 'querySelector()', category: 'js' },
    { concept: 'Hẹn giờ thực thi', code: 'setTimeout()', category: 'js' },
    { concept: 'Chuyển JSON thành Object', code: 'JSON.parse()', category: 'js' },
    { concept: 'Tạo mảng mới từ mảng cũ', code: '.map()', category: 'js' },
    { concept: 'Lọc các phần tử mảng', code: '.filter()', category: 'js' },
    { concept: 'Cấu trúc rẽ nhánh', code: 'if / else', category: 'js' },
];

const LEVEL_CONFIG = {
    easy: { pairCount: 6, categories: ['html'], columns: 3, label: 'Dễ' },
    medium: { pairCount: 8, categories: ['css'], columns: 4, label: 'Trung bình' },
    hard: { pairCount: 10, categories: ['js'], columns: 5, label: 'Khó' },
};
const LEVEL_ORDER = ['easy', 'medium', 'hard'];

const STORAGE_KEY = 'memoryCardGame_completedLevels';
const SCORE_KEY = 'memoryCardGame_highScores';
const MUTE_KEY = 'memoryCardGame_muted';
const MUSIC_KEY = 'memoryCardGame_music';
const ACHIEVE_KEY = 'memoryCardGame_achievements';
const STATS_KEY = 'memoryCardGame_stats';

const ACHIEVEMENT_DEFS = [
    { id: 'first_win', name: 'Bước Đầu Tiên', desc: 'Hoàn thành level đầu tiên', icon: '🎯' },
    { id: 'speed_demon', name: 'Tốc Độ Ánh Sáng', desc: 'Hoàn thành level trong < 60s', icon: '⚡' },
    { id: 'three_star', name: 'Sao Sáng', desc: 'Đạt 3 sao ở bất kỳ level nào', icon: '⭐' },
    { id: 'master', name: 'Cao Thủ', desc: 'Phá đảo cả 3 level', icon: '👑' },
    { id: 'hint_avoider', name: 'Tự Lực Cánh Sinh', desc: 'Hoàn thành level không dùng gợi ý', icon: '💪' },
    { id: 'practice_makes_perfect', name: 'Luyện Tập', desc: 'Chơi 5 game ở chế độ luyện tập', icon: '🎯' },
    { id: 'persistent', name: 'Kiên Trì', desc: 'Chơi tổng cộng 20 game', icon: '🔥' },
    { id: 'speedrun', name: 'Speedrunner', desc: 'Hoàn thành level Dễ trong < 30s', icon: '🏃' },
];

function getCompletedLevels() {
    try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : { easy: false, medium: false, hard: false }; }
    catch { return { easy: false, medium: false, hard: false }; }
}
function markLevelCompleted(level) {
    const c = getCompletedLevels(); c[level] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
}
function isLevelUnlocked(level) {
    const idx = LEVEL_ORDER.indexOf(level);
    if (idx === 0) return true;
    return getCompletedLevels()[LEVEL_ORDER[idx - 1]] === true;
}
function getNextLevel(currentLevel) {
    const idx = LEVEL_ORDER.indexOf(currentLevel);
    return idx < LEVEL_ORDER.length - 1 ? LEVEL_ORDER[idx + 1] : null;
}
function resetAllProgress() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACHIEVE_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(SCORE_KEY);
}

// High Scores
function getHighScores() {
    try { const d = localStorage.getItem(SCORE_KEY); return d ? JSON.parse(d) : []; }
    catch { return []; }
}
function saveScore(moves, time, level) {
    const scores = getHighScores();
    scores.push({ moves, time, level, date: new Date().toLocaleDateString('vi-VN') });
    scores.sort((a, b) => a.moves - b.moves || a.time - b.time);
    if (scores.length > 5) scores.length = 5;
    localStorage.setItem(SCORE_KEY, JSON.stringify(scores));
}

// Star Rating
function calculateStars(moves, totalPairs, level) {
    const base = totalPairs * 2;
    const ratios = { easy: 1.3, medium: 1.5, hard: 1.8 };
    const ratio = ratios[level] || 1.5;
    if (moves <= base) return 3;
    if (moves <= base * ratio) return 2;
    return 1;
}

// Stats
function getStats() {
    try { const d = localStorage.getItem(STATS_KEY); return d ? JSON.parse(d) : { gamesPlayed: 0, wins: 0, totalMoves: 0, totalTime: 0, bestTime: null, hintsUsed: 0, starsCount: { 1: 0, 2: 0, 3: 0 }, practiceGames: 0 }; }
    catch { return { gamesPlayed: 0, wins: 0, totalMoves: 0, totalTime: 0, bestTime: null, hintsUsed: 0, starsCount: { 1: 0, 2: 0, 3: 0 }, practiceGames: 0 }; }
}
function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
function updateStats(moves, time, stars, isPractice) {
    const s = getStats();
    s.gamesPlayed++;
    if (!isPractice) s.wins++;
    s.totalMoves += moves;
    s.totalTime += time;
    if (s.bestTime === null || time < s.bestTime) s.bestTime = time;
    if (stars) s.starsCount[stars] = (s.starsCount[stars] || 0) + 1;
    if (isPractice) s.practiceGames++;
    saveStats(s);
}

// Achievements
function getAchievements() {
    try { const d = localStorage.getItem(ACHIEVE_KEY); return d ? JSON.parse(d) : []; }
    catch { return []; }
}
function awardAchievement(id) {
    const list = getAchievements();
    if (list.includes(id)) return false;
    list.push(id);
    localStorage.setItem(ACHIEVE_KEY, JSON.stringify(list));
    return true;
}
function checkAchievements(stars, level, hintsUsed, isPractice, time) {
    const completed = getCompletedLevels();
    const stats = getStats();
    const allDone = completed.easy && completed.medium && completed.hard;
    const newly = [];
    if (awardAchievement('first_win')) newly.push('first_win');
    if (time < 60 && awardAchievement('speed_demon')) newly.push('speed_demon');
    if (stars === 3 && awardAchievement('three_star')) newly.push('three_star');
    if (allDone && awardAchievement('master')) newly.push('master');
    if (hintsUsed === 0 && awardAchievement('hint_avoider')) newly.push('hint_avoider');
    if (isPractice && stats.practiceGames >= 5 && awardAchievement('practice_makes_perfect')) newly.push('practice_makes_perfect');
    if (stats.gamesPlayed >= 20 && awardAchievement('persistent')) newly.push('persistent');
    if (level === 'easy' && time < 30 && awardAchievement('speedrun')) newly.push('speedrun');
    return newly;
}

// Achievements & Stats UI
function renderAchievements() {
    const grid = document.getElementById('achievement-grid');
    if (!grid) return;
    const unlocked = getAchievements();
    grid.innerHTML = ACHIEVEMENT_DEFS.map(a => `
        <div class="achievement-badge ${unlocked.includes(a.id) ? 'unlocked' : 'locked'}">
            <span class="achievement-icon">${unlocked.includes(a.id) ? a.icon : '🔒'}</span>
            <div class="achievement-info">
                <span class="achievement-name">${a.name}</span>
                <span class="achievement-desc">${a.desc}</span>
            </div>
        </div>
    `).join('');

    const stats = getStats();
    const sDiv = document.getElementById('stats-dashboard');
    if (sDiv) {
        sDiv.style.display = 'grid';
        sDiv.style.gridTemplateColumns = '1fr 1fr';
        sDiv.style.gap = '8px';
        sDiv.style.marginBottom = '12px';
        sDiv.innerHTML = `
            <div class="stat-card"><span class="stat-card-value">${stats.gamesPlayed}</span><span class="stat-card-label">Đã chơi</span></div>
            <div class="stat-card"><span class="stat-card-value">${stats.wins}</span><span class="stat-card-label">Thắng</span></div>
            <div class="stat-card"><span class="stat-card-value">${stats.totalMoves}</span><span class="stat-card-label">Tổng lượt</span></div>
            <div class="stat-card"><span class="stat-card-value">${stats.bestTime !== null ? formatTime(stats.bestTime) : '--:--'}</span><span class="stat-card-label">Kỷ lục</span></div>
            <div class="stat-card"><span class="stat-card-value">${stats.hintsUsed}</span><span class="stat-card-label">Đã gợi ý</span></div>
            <div class="stat-card"><span class="stat-card-value">${Object.values(stats.starsCount).reduce((a,b)=>a+b,0)} ⭐</span><span class="stat-card-label">Sao đạt được</span></div>
        `;
    }
}

// Screen shake
function screenShake() {
    const board = document.getElementById('game-board');
    if (!board) return;
    board.classList.remove('shake');
    void board.offsetWidth;
    board.classList.add('shake');
    setTimeout(() => board.classList.remove('shake'), 500);
}

// Game state
let currentLevel = null;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 0;
let moves = 0;
let timerInterval = null;
let seconds = 0;
let isProcessing = false;
let isMuted = false;
let isMusicOn = false;
let hintsRemaining = 3;
let hintsUsed = 0;
let isPracticeMode = false;
let bgmInterval = null;
let musicCtx = null;

// Audio
let audioCtx = null;
function initAudio() {
    if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    if (audioCtx.state === 'suspended') audioCtx.resume();
}
function playNote(freq, duration, type, volume, startTime) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = type || 'square';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + (startTime || 0));
    gain.gain.setValueAtTime(volume || 0.06, audioCtx.currentTime + (startTime || 0));
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (startTime || 0) + duration);
    osc.start(audioCtx.currentTime + (startTime || 0));
    osc.stop(audioCtx.currentTime + (startTime || 0) + duration);
}
function loadMuteState() {
    try { isMuted = localStorage.getItem(MUTE_KEY) === 'true'; } catch { isMuted = false; }
    updateMuteButton();
}
function toggleMute() { isMuted = !isMuted; localStorage.setItem(MUTE_KEY, isMuted); updateMuteButton(); }
function updateMuteButton() {
    const btn = document.getElementById('btn-mute');
    if (btn) { btn.textContent = isMuted ? '🔇' : '🔊'; btn.classList.toggle('muted', isMuted); }
}
function playFlip() { if (isMuted) return; initAudio(); playNote(660 + Math.random()*300, 0.06, 'square', 0.05); }
function playMatch() { if (isMuted) return; initAudio(); playNote(523,0.1,'square',0.07,0); playNote(659,0.1,'square',0.07,0.07); playNote(784,0.12,'square',0.07,0.14); }
function playMismatch() { if (isMuted) return; initAudio(); playNote(250,0.12,'sawtooth',0.03,0); playNote(180,0.15,'sawtooth',0.03,0.08); }
function playWin() { if (isMuted) return; initAudio(); [523,587,659,784,880,1047].forEach((f,i)=>playNote(f,0.12,'square',0.07,i*0.09)); }
function playClick() { if (isMuted) return; initAudio(); playNote(800,0.03,'square',0.03); }

// BGM
function loadMusicState() {
    try { isMusicOn = localStorage.getItem(MUSIC_KEY) === 'true'; } catch { isMusicOn = false; }
    updateMusicButton();
}
function toggleMusic() {
    isMusicOn = !isMusicOn;
    localStorage.setItem(MUSIC_KEY, isMusicOn);
    updateMusicButton();
    if (isMusicOn) startBGM(); else stopBGM();
}
function updateMusicButton() {
    const btn = document.getElementById('btn-music');
    if (btn) { btn.textContent = isMusicOn ? '🎵' : '🎵'; btn.classList.toggle('muted', !isMusicOn); }
}
const BGM_NOTES = [262, 294, 330, 349, 392, 349, 330, 294];
let bgmIdx = 0;
function startBGM() {
    stopBGM();
    if (isMuted || !isMusicOn) return;
    initAudio();
    musicCtx = audioCtx;
    bgmInterval = setInterval(() => {
        if (isMuted || !isMusicOn || !musicCtx) return;
        const freq = BGM_NOTES[bgmIdx % BGM_NOTES.length];
        playNote(freq, 0.18, 'square', 0.03);
        playNote(freq * 2, 0.18, 'square', 0.015);
        bgmIdx++;
    }, 250);
}
function stopBGM() { clearInterval(bgmInterval); bgmInterval = null; bgmIdx = 0; }

// Stars
function createStars() {
    if (document.querySelector('.stars-container')) return;
    const container = document.createElement('div');
    container.className = 'stars-container';
    container.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden;';
    for (let i = 0; i < 40; i++) {
        const star = document.createElement('div');
        const size = 1 + Math.random() * 2;
        star.style.cssText = `position:absolute;left:${Math.random()*100}%;top:${Math.random()*100}%;width:${size}px;height:${size}px;background:#fff;opacity:${0.1+Math.random()*0.4};animation:twinkle ${2+Math.random()*4}s ease-in-out infinite;animation-delay:${Math.random()*4}s;border-radius:50%;`;
        container.appendChild(star);
    }
    document.body.prepend(container);
}

// Confetti enhanced
function createConfetti(cardEl) {
    const rect = cardEl.getBoundingClientRect();
    const colors = ['#ff00ff','#00ffff','#00ff88','#ffcc00','#ff0044','#ffffff'];
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 100;
        p.style.cssText = `left:${rect.left+rect.width/2+(Math.random()-0.5)*60}px;top:${rect.top+rect.height/2}px;background:${color};--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;`;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1000);
    }
}
function createFireworks() {
    const colors = ['#ff00ff','#00ffff','#00ff88','#ffcc00','#ff0044','#ffffff','#ff8800'];
    for (let wave = 0; wave < 3; wave++) {
        setTimeout(() => {
            for (let i = 0; i < 40; i++) {
                const p = document.createElement('div');
                p.className = 'particle';
                const color = colors[Math.floor(Math.random() * colors.length)];
                const angle = Math.random() * Math.PI * 2;
                const dist = 60 + Math.random() * 180;
                const x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
                const y = window.innerHeight / 2 + (Math.random() - 0.5) * 100;
                p.style.cssText = `left:${x}px;top:${y}px;background:${color};width:${4+Math.random()*4}px;height:${4+Math.random()*4}px;--dx:${Math.cos(angle)*dist}px;--dy:${Math.sin(angle)*dist}px;animation-duration:${0.8+Math.random()*0.6}s;`;
                document.body.appendChild(p);
                setTimeout(() => p.remove(), 1400);
            }
        }, wave * 400);
    }
}

// Level UI
function updateLevelUI() {
    const completed = getCompletedLevels();
    LEVEL_ORDER.forEach(level => {
        const btn = document.getElementById(`btn-level-${level}`);
        if (!btn) return;
        const iconEl = btn.querySelector('.level-icon');
        const statusEl = btn.querySelector('.status-text');
        const unlocked = isLevelUnlocked(level);
        const done = completed[level];
        btn.classList.remove('locked', 'completed');
        if (done) {
            btn.classList.add('completed'); btn.disabled = false;
            iconEl.textContent = '✅'; statusEl.textContent = 'Hoàn thành';
        } else if (unlocked) {
            btn.disabled = false;
            iconEl.textContent = level === 'easy' ? '🟢' : level === 'medium' ? '🟡' : '🔴';
            statusEl.textContent = 'Sẵn sàng';
        } else {
            btn.classList.add('locked'); btn.disabled = true;
            iconEl.textContent = '🔒'; statusEl.textContent = 'Đã khóa';
        }
    });
}

// Game
function startGame(level) {
    currentLevel = level;
    const config = LEVEL_CONFIG[level];
    isPracticeMode = false;
    matchedPairs = 0; totalPairs = config.pairCount; moves = 0; seconds = 0;
    flippedCards = []; isProcessing = true; hintsRemaining = 3; hintsUsed = 0;
    updateMovesCount(); updatePairsCount(); updateHintUI();

    timerDisplay.textContent = '00:00';
    const bar = document.getElementById('timer-bar-fill');
    if (bar) bar.style.width = '100%';

    const levelPairs = webDevPairs.filter(p => config.categories.includes(p.category));
    const selectedPairs = shuffleArray([...levelPairs]).slice(0, config.pairCount);
    cards = [];
    selectedPairs.forEach((pair, index) => {
        cards.push({ id: `pair-${index}-concept`, pairId: index, type: 'concept', text: pair.concept, category: pair.category });
        cards.push({ id: `pair-${index}-code`, pairId: index, type: 'code', text: pair.code, category: pair.category });
    });
    cards = shuffleArray(cards);
    renderBoard(config.columns);
    switchScreen('game');

    const totalCards = cards.length;
    const dealDelay = 50 + totalCards * 60 + 300;
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(el => { el.classList.add('flipped'); el.classList.remove('dealing'); });
    }, dealDelay);
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(el => el.classList.remove('flipped'));
        startCountdown(() => { isProcessing = false; startTimer(); });
    }, dealDelay + 2200);

    stopBGM();
    if (isMusicOn) startBGM();
}

// Practice mode
function startPracticeMode() {
    const pairCount = parseInt(document.getElementById('practice-pairs').value, 10);
    const useHtml = document.getElementById('practice-html').checked;
    const useCss = document.getElementById('practice-css').checked;
    const useJs = document.getElementById('practice-js').checked;
    const useTimer = document.getElementById('practice-timer').checked;
    const useHints = document.getElementById('practice-hints').checked;

    const cats = [];
    if (useHtml) cats.push('html');
    if (useCss) cats.push('css');
    if (useJs) cats.push('js');
    if (cats.length === 0) { alert('Chọn ít nhất 1 danh mục!'); return; }

    const available = webDevPairs.filter(p => cats.includes(p.category));
    const count = Math.min(pairCount, available.length);
    if (count < 2) { alert('Không đủ thẻ cho số cặp này!'); return; }

    isPracticeMode = true;
    currentLevel = 'practice';
    const config = { columns: Math.min(count, 5) };
    matchedPairs = 0; totalPairs = count; moves = 0; seconds = 0;
    flippedCards = []; isProcessing = true;
    hintsRemaining = useHints ? 5 : 0; hintsUsed = 0;

    updateMovesCount(); updatePairsCount(); updateHintUI();
    timerDisplay.textContent = '00:00';
    const bar = document.getElementById('timer-bar-fill');
    if (bar) { bar.style.width = '100%'; bar.style.display = useTimer ? 'block' : 'none'; }

    const selectedPairs = shuffleArray([...available]).slice(0, count);
    cards = [];
    selectedPairs.forEach((pair, index) => {
        cards.push({ id: `pair-${index}-concept`, pairId: index, type: 'concept', text: pair.concept, category: pair.category });
        cards.push({ id: `pair-${index}-code`, pairId: index, type: 'code', text: pair.code, category: pair.category });
    });
    cards = shuffleArray(cards);

    const cols = count >= 5 ? 5 : count >= 4 ? 4 : count >= 3 ? 3 : 2;
    renderBoard(cols);
    switchScreen('game');

    const dealDelay = 50 + cards.length * 60 + 300;
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(el => { el.classList.add('flipped'); el.classList.remove('dealing'); });
    }, dealDelay);
    setTimeout(() => {
        document.querySelectorAll('.memory-card').forEach(el => el.classList.remove('flipped'));
        startCountdown(() => { isProcessing = false; if (useTimer) startTimer(); });
    }, dealDelay + 2200);

    stopBGM();
    if (isMusicOn) startBGM();
}

function renderBoard(columns) {
    gameBoard.innerHTML = '';
    gameBoard.setAttribute('data-columns', columns);
    cards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.classList.add('memory-card');
        cardEl.dataset.id = card.id;
        cardEl.dataset.pairId = card.pairId;
        const textClass = card.type === 'code' ? 'card-text code' : 'card-text';
        cardEl.innerHTML = `
            <div class="card-face card-back"><span class="card-back-icon">❓</span></div>
            <div class="card-face card-front">
                <span class="card-category ${card.category}">${card.category.toUpperCase()}</span>
                <span class="${textClass}">${escapeHTML(card.text)}</span>
            </div>
        `;
        cardEl.addEventListener('click', () => flipCard(cardEl, card));
        gameBoard.appendChild(cardEl);
        cardEl.style.opacity = '0';
        setTimeout(() => { cardEl.style.opacity = '1'; cardEl.classList.add('dealing'); }, 50 + index * 60);
    });
}

function flipCard(cardEl, cardData) {
    if (isProcessing) return;
    if (cardEl.classList.contains('flipped')) return;
    if (cardEl.classList.contains('matched')) return;
    cardEl.classList.add('flipped');
    flippedCards.push({ el: cardEl, data: cardData });
    playFlip();
    if (flippedCards.length === 2) { moves++; updateMovesCount(); isProcessing = true; checkMatch(); }
}

function checkMatch() {
    const [first, second] = flippedCards;
    const isMatch = first.data.pairId === second.data.pairId && first.data.id !== second.data.id;
    if (isMatch) handleMatch(first.el, second.el);
    else handleMismatch(first.el, second.el);
}

function handleMatch(firstCard, secondCard) {
    firstCard.classList.add('matched', 'pop');
    secondCard.classList.add('matched', 'pop');
    createConfetti(firstCard);
    createConfetti(secondCard);
    matchedPairs++; updatePairsCount(); playMatch();
    flippedCards = []; isProcessing = false;
    if (matchedPairs === totalPairs) {
        stopTimer(); stopBGM();
        const stars = calculateStars(moves, totalPairs, currentLevel);
        if (!isPracticeMode) markLevelCompleted(currentLevel);
        setTimeout(() => showWinModal(stars), 800);
    }
}

function handleMismatch(firstCard, secondCard) {
    firstCard.classList.add('shake'); secondCard.classList.add('shake');
    playMismatch();
    screenShake();
    setTimeout(() => {
        firstCard.classList.remove('flipped', 'shake');
        secondCard.classList.remove('flipped', 'shake');
        flippedCards = []; isProcessing = false;
    }, 800);
}

// Hint system
function useHint() {
    if (isProcessing) return;
    if (hintsRemaining <= 0) return;
    const unmatchedCards = document.querySelectorAll('.memory-card:not(.matched):not(.flipped)');
    if (unmatchedCards.length < 2) return;

    const unmatchedPairs = {};
    unmatchedCards.forEach(el => {
        const pid = el.dataset.pairId;
        if (!unmatchedPairs[pid]) unmatchedPairs[pid] = [];
        unmatchedPairs[pid].push(el);
    });

    const validPairs = Object.values(unmatchedPairs).filter(arr => arr.length === 2);
    if (validPairs.length === 0) return;

    hintsRemaining--; hintsUsed++;
    updateHintUI();

    const pair = validPairs[0];
    pair.forEach(el => { el.classList.add('flipped', 'hint-highlight'); });

    setTimeout(() => {
        pair.forEach(el => { el.classList.remove('hint-highlight', 'flipped'); });
    }, 1500);
}

function updateHintUI() {
    const btn = document.getElementById('btn-hint');
    const count = document.getElementById('hint-count');
    if (btn) btn.disabled = hintsRemaining <= 0;
    if (count) count.textContent = hintsRemaining;
}

// UI updates
function updateMovesCount() { if (movesCount) movesCount.textContent = moves; }
function updatePairsCount() { if (pairsCount) pairsCount.textContent = `${matchedPairs}/${totalPairs}`; }
function updateTimerBar() {
    const bar = document.getElementById('timer-bar-fill');
    if (!bar) return;
    const maxTime = 180;
    const pct = Math.max(0, 100 - (seconds / maxTime) * 100);
    bar.style.width = pct + '%';
    if (pct > 60) bar.style.background = 'var(--neon-success)';
    else if (pct > 30) bar.style.background = 'var(--neon-warning)';
    else bar.style.background = 'var(--neon-danger)';
}
function startTimer() {
    stopTimer();
    timerDisplay.textContent = formatTime(seconds);
    updateTimerBar();
    timerInterval = setInterval(() => { seconds++; timerDisplay.textContent = formatTime(seconds); updateTimerBar(); }, 1000);
}
function stopTimer() { clearInterval(timerInterval); timerInterval = null; }
function formatTime(s) { return `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`; }
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const newScreen = document.getElementById(`screen-${screenId}`);
    if (newScreen) newScreen.classList.add('active');
    if (screenId === 'levels') updateLevelUI();
    stopBGM();
}
function escapeHTML(str) { const p = document.createElement('p'); p.textContent = str; return p.innerHTML; }
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function startCountdown(callback) {
    const overlay = document.getElementById('countdown-overlay');
    const numEl = document.getElementById('countdown-number');
    if (!overlay || !numEl) { callback(); return; }
    let count = 3;
    overlay.classList.add('active');
    function tick() {
        numEl.textContent = count;
        numEl.style.animation = 'none';
        void numEl.offsetWidth;
        numEl.style.animation = 'countPop 0.6s ease';
        if (count === 0) {
            numEl.textContent = 'BẮT ĐẦU!';
            numEl.style.fontSize = '2.5rem';
            setTimeout(() => { overlay.classList.remove('active'); numEl.style.fontSize = '6rem'; callback(); }, 700);
            return;
        }
        count--; setTimeout(tick, 700);
    }
    tick();
}

// Win modal
function showWinModal(stars) {
    playWin();
    const levelLabel = isPracticeMode ? 'Luyện tập' : LEVEL_CONFIG[currentLevel].label;
    if (!isPracticeMode) saveScore(moves, seconds, currentLevel);

    // Update stats
    updateStats(moves, seconds, stars, isPracticeMode);

    // Check achievements
    const newAchievements = checkAchievements(stars, currentLevel, hintsUsed, isPracticeMode, seconds);

    modalMoves.textContent = moves;
    modalTime.textContent = formatTime(seconds);
    modalTitle.textContent = `Hoàn thành${isPracticeMode ? ' Luyện tập' : ` Level ${levelLabel}`}!`;

    const hintsMsg = document.getElementById('modal-hints-used');
    if (hintsMsg) hintsMsg.textContent = hintsUsed > 0 ? `Đã dùng ${hintsUsed} gợi ý` : '✨ Không dùng gợi ý nào!';

    // Stars
    const starEls = document.querySelectorAll('#star-rating .star');
    starEls.forEach((el, i) => {
        el.classList.remove('active');
        el.style.animation = 'none';
        void el.offsetWidth;
        if (i < stars) {
            el.classList.add('active');
            el.style.animation = `starPop 0.5s ease forwards ${i * 0.15}s`;
        }
    });

    const nextLevel = getNextLevel(currentLevel);
    if (!isPracticeMode && nextLevel && isLevelUnlocked(nextLevel)) {
        btnNextLevel.style.display = 'block';
        btnNextLevel.textContent = `Chơi Level ${LEVEL_CONFIG[nextLevel].label} →`;
        btnNextLevel.disabled = false;
    } else if (!isPracticeMode && !nextLevel) {
        btnNextLevel.style.display = 'block';
        btnNextLevel.textContent = '🎉 Bạn đã phá đảo game! 🎉';
        btnNextLevel.disabled = true;
    } else {
        btnNextLevel.style.display = isPracticeMode ? 'none' : 'none';
        btnNextLevel.textContent = isPracticeMode ? 'Luyện tập tiếp' : 'Chơi lại';
        btnNextLevel.style.display = 'block';
        btnNextLevel.disabled = false;
    }

    winModal.classList.add('active');
    createFireworks();

    // Show new achievements toast
    if (newAchievements.length > 0) {
        setTimeout(() => {
            const names = newAchievements.map(id => {
                const def = ACHIEVEMENT_DEFS.find(a => a.id === id);
                return def ? `${def.icon} ${def.name}` : id;
            }).join(', ');
            alert(`🏅 Thành tựu mới: ${names}`);
        }, 1000);
    }
}

function hideWinModal() { winModal.classList.remove('active'); }

function shareScore() {
    const levelLabel = isPracticeMode ? 'Luyện tập' : LEVEL_CONFIG[currentLevel].label;
    const text = `🧠 Memory Card Game\n📊 Level: ${levelLabel}\n🃏 ${matchedPairs}/${totalPairs} cặp\n👆 ${moves} lượt\n⏱ ${formatTime(seconds)}\n\nThử thách bạn bè tại đây! 🎮`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => alert('✅ Đã copy kết quả!')).catch(() => fallbackCopy(text));
    } else { fallbackCopy(text); }
}
function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); alert('✅ Đã copy kết quả!'); }
    catch { prompt('Copy đoạn này:', text); }
    document.body.removeChild(ta);
}

// DOM refs
const gameBoard = document.getElementById('game-board');
const movesCount = document.getElementById('moves-count');
const pairsCount = document.getElementById('pairs-count');
const timerDisplay = document.getElementById('timer-display');
const winModal = document.getElementById('modal-win');
const modalTitle = document.getElementById('modal-title');
const modalMoves = document.getElementById('modal-moves');
const modalTime = document.getElementById('modal-time');
const btnNextLevel = document.getElementById('btn-next-level');
const btnReplay = document.getElementById('btn-replay');
const btnMenu = document.getElementById('btn-menu');

// Init
function init() {
    createStars();
    loadMuteState();
    loadMusicState();

    document.querySelectorAll('button').forEach(btn => btn.addEventListener('click', playClick));

    // Welcome
    document.getElementById('btn-start-game').addEventListener('click', () => switchScreen('levels'));
    document.getElementById('btn-practice-mode').addEventListener('click', () => switchScreen('practice'));

    // Practice
    const practiceSlider = document.getElementById('practice-pairs');
    const practiceVal = document.getElementById('practice-pair-value');
    if (practiceSlider && practiceVal) {
        practiceSlider.addEventListener('input', () => { practiceVal.textContent = practiceSlider.value; });
    }
    document.getElementById('btn-start-practice').addEventListener('click', startPracticeMode);
    document.getElementById('btn-back-practice').addEventListener('click', () => switchScreen('welcome'));

    // Levels
    document.getElementById('btn-level-easy').addEventListener('click', () => startGame('easy'));
    document.getElementById('btn-level-medium').addEventListener('click', (e) => { if (!e.currentTarget.disabled) startGame('medium'); });
    document.getElementById('btn-level-hard').addEventListener('click', (e) => { if (!e.currentTarget.disabled) startGame('hard'); });

    // Game
    document.getElementById('btn-back').addEventListener('click', () => {
        stopTimer();
        document.getElementById('countdown-overlay').classList.remove('active');
        switchScreen('levels');
    });

    document.getElementById('btn-hint').addEventListener('click', () => { playClick(); useHint(); });

    // Achievements
    document.getElementById('btn-achievements').addEventListener('click', () => { playClick(); renderAchievements(); document.getElementById('modal-achievements').classList.add('active'); });
    document.getElementById('btn-close-achievements').addEventListener('click', () => document.getElementById('modal-achievements').classList.remove('active'));

    // High scores / Stats
    document.getElementById('btn-highscores').addEventListener('click', () => { playClick(); showHighScores(); });
    document.getElementById('btn-close-highscores').addEventListener('click', () => document.getElementById('modal-highscores').classList.remove('active'));

    document.getElementById('btn-tab-scores').addEventListener('click', () => {
        document.getElementById('highscore-list').style.display = 'flex';
        document.getElementById('stats-dashboard-modal').style.display = 'none';
    });
    document.getElementById('btn-tab-stats').addEventListener('click', () => {
        document.getElementById('highscore-list').style.display = 'none';
        renderStatsModal();
        document.getElementById('stats-dashboard-modal').style.display = 'grid';
    });
    document.getElementById('btn-reset-stats').addEventListener('click', () => {
        if (confirm('Xóa toàn bộ dữ liệu thống kê và điểm số?')) {
            resetAllProgress(); updateLevelUI(); showHighScores();
        }
    });

    // Mute / Music
    document.getElementById('btn-mute').addEventListener('click', () => { playClick(); toggleMute(); });
    document.getElementById('btn-music').addEventListener('click', () => { playClick(); toggleMusic(); });
    document.getElementById('btn-share').addEventListener('click', () => { playClick(); shareScore(); });

    // Reset
    document.getElementById('btn-reset-progress').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn xóa toàn bộ tiến trình và chơi lại từ đầu?')) {
            resetAllProgress(); updateLevelUI(); switchScreen('welcome');
        }
    });

    // Win modal
    btnNextLevel.addEventListener('click', () => {
        hideWinModal();
        if (isPracticeMode) { switchScreen('practice'); return; }
        const next = getNextLevel(currentLevel);
        if (next) startGame(next);
    });
    btnReplay.addEventListener('click', () => { hideWinModal(); if (isPracticeMode) startPracticeMode(); else startGame(currentLevel); });
    btnMenu.addEventListener('click', () => { hideWinModal(); switchScreen('levels'); });

    // Tutorial
    const tutorialModal = document.getElementById('modal-tutorial');
    const slides = document.querySelectorAll('.tutorial-slide');
    const dots = document.querySelectorAll('.tutorial-dot');
    const btnPrev = document.getElementById('btn-tutorial-prev');
    const btnNext = document.getElementById('btn-tutorial-next');
    let currentSlide = 0;
    function updateTutorialUI() {
        slides.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
        btnPrev.disabled = currentSlide === 0;
        btnNext.disabled = currentSlide === slides.length - 1;
    }
    function openTutorial() { currentSlide = 0; updateTutorialUI(); tutorialModal.classList.add('active'); }
    document.getElementById('btn-how-to-play').addEventListener('click', openTutorial);
    document.getElementById('btn-open-tutorial').addEventListener('click', openTutorial);
    document.getElementById('btn-close-tutorial').addEventListener('click', () => tutorialModal.classList.remove('active'));
    btnNext.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; updateTutorialUI(); } });
    btnPrev.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; updateTutorialUI(); } });
    dots.forEach(dot => dot.addEventListener('click', (e) => {
        const si = parseInt(e.target.dataset.dot, 10);
        if (!isNaN(si)) { currentSlide = si; updateTutorialUI(); }
    }));

    updateLevelUI();
}

// High scores display
function showHighScores() {
    const list = document.getElementById('highscore-list');
    const scores = getHighScores();
    if (scores.length === 0) {
        list.innerHTML = '<p style="color:var(--neon-text-muted);text-align:center;padding:20px;font-family:var(--font-game);">Chưa có điểm nào. Hãy chơi game!</p>';
    } else {
        list.innerHTML = scores.map((s, i) => `
            <div class="highscore-row ${i < 3 ? 'highscore-top' : ''}">
                <span class="hs-rank">#${i + 1}</span>
                <span class="hs-moves">${s.moves} lượt</span>
                <span class="hs-time">${formatTime(s.time)}</span>
                <span class="hs-date">${s.level || ''} ${s.date || ''}</span>
            </div>
        `).join('');
    }
    document.getElementById('highscore-list').style.display = 'flex';
    document.getElementById('stats-dashboard-modal').style.display = 'none';
    document.getElementById('modal-highscores').classList.add('active');
}

function renderStatsModal() {
    const s = getStats();
    const div = document.getElementById('stats-dashboard-modal');
    if (!div) return;
    div.innerHTML = `
        <div class="stat-card"><span class="stat-card-value">${s.gamesPlayed}</span><span class="stat-card-label">Đã chơi</span></div>
        <div class="stat-card"><span class="stat-card-value">${s.wins}</span><span class="stat-card-label">Thắng</span></div>
        <div class="stat-card"><span class="stat-card-value">${s.totalMoves}</span><span class="stat-card-label">Tổng lượt</span></div>
        <div class="stat-card"><span class="stat-card-value">${s.bestTime !== null ? formatTime(s.bestTime) : '--:--'}</span><span class="stat-card-label">Kỷ lục TG</span></div>
        <div class="stat-card"><span class="stat-card-value">${s.hintsUsed}</span><span class="stat-card-label">Đã gợi ý</span></div>
        <div class="stat-card"><span class="stat-card-value">${Object.values(s.starsCount).reduce((a,b)=>a+b,0)}</span><span class="stat-card-label">Sao</span></div>
        <div class="stat-card"><span class="stat-card-value">${s.totalMoves > 0 ? Math.round(s.totalMoves / s.gamesPlayed) : 0}</span><span class="stat-card-label">Lượt TB</span></div>
        <div class="stat-card"><span class="stat-card-value">${s.practiceGames}</span><span class="stat-card-label">Luyện tập</span></div>
    `;
}

// ===== INTRO & ATTRACT MODE =====
function playIntro() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) { init(); return; }

    const stages = {
        loading: document.getElementById('intro-stage-loading'),
        studio: document.getElementById('intro-stage-studio'),
        cards: document.getElementById('intro-stage-cards'),
        logo: document.getElementById('intro-stage-logo')
    };
    const skipHint = document.getElementById('intro-skip-hint');

    let aborted = false;
    let skipCallback = null;

    function skipIntro() {
        if (aborted) return;
        aborted = true;
        overlay.classList.add('fade-out');
        if (skipCallback) clearTimeout(skipCallback);
        setTimeout(() => {
            overlay.style.display = 'none';
            init();
            startAttractTimer();
        }, 500);
    }

    overlay.addEventListener('click', skipIntro);
    if (skipHint) skipHint.addEventListener('click', (e) => { e.stopPropagation(); skipIntro(); });

    const fill = document.getElementById('intro-loading-fill');
    const loadText = document.getElementById('intro-loading-text');

    const loadingSteps = [
        { text: 'INITIALIZING MEMORY...', pct: 5 },
        { text: 'LOADING CARDS...', pct: 30 },
        { text: 'SHUFFLING DECK...', pct: 55 },
        { text: 'CALIBRATING NEON...', pct: 80 },
        { text: 'READY!', pct: 100 }
    ];

    loadingSteps.forEach((step, i) => {
        setTimeout(() => {
            if (aborted) return;
            if (loadText) loadText.textContent = step.text;
            if (fill) fill.style.width = step.pct + '%';
        }, i * 500);
    });

    function stageTransition(from, to) {
        if (aborted) return;
        if (from) from.classList.remove('active');
        setTimeout(() => { if (to && !aborted) to.classList.add('active'); }, 80);
    }

    skipCallback = setTimeout(() => {
        if (aborted) return;
        stageTransition(stages.loading, stages.studio);

        setTimeout(() => {
            if (aborted) return;
            stageTransition(stages.studio, stages.cards);
            createIntroCards();
        }, 1600);

        setTimeout(() => {
            if (aborted) return;
            stageTransition(stages.cards, stages.logo);
        }, 3800);

        setTimeout(() => {
            skipIntro();
        }, 5600);
    }, 2800);

    skipCallback = null; // don't clear the main timeout
    const mainTimeout = setTimeout(() => {}, 0); // placeholder
    skipCallback = mainTimeout;
}

function createIntroCards() {
    const scene = document.getElementById('intro-cards-scene');
    if (!scene) return;
    scene.innerHTML = '';

    const categories = [
        { label: 'HTML', color: 'var(--neon-easy)', text: '<div>' },
        { label: 'CSS', color: 'var(--neon-medium)', text: 'flexbox' },
        { label: 'JS', color: 'var(--neon-hard)', text: '=> {}' }
    ];

    categories.forEach((cat, i) => {
        const card = document.createElement('div');
        card.className = 'intro-card-el';
        card.innerHTML = `
            <div class="card-face card-back"><span class="card-back-icon">❓</span></div>
            <div class="card-face card-front">
                <span class="card-category" style="border-color:${cat.color};color:${cat.color};background:rgba(0,0,0,0.3)">${cat.label}</span>
                <span class="card-text code" style="font-size:0.5rem;color:${cat.color}">${cat.text}</span>
            </div>
        `;
        scene.appendChild(card);

        const angles = [-18, 0, 18];
        const offsets = [20, 0, 20];
        setTimeout(() => {
            card.classList.add('fan-in');
            card.style.transform = `rotate(${angles[i]}deg) translateY(${offsets[i]}px)`;
            card.style.transitionDelay = '0s';
        }, 300 + i * 200);
    });

    setTimeout(() => {
        document.querySelectorAll('.intro-card-el').forEach(c => {
            c.classList.remove('fan-in');
            c.classList.add('merge');
        });
    }, 2200);
}

// Attract mode
let attractTimer = null;
let attractIntervals = [];

function startAttractTimer() {
    clearTimeout(attractTimer);
    attractTimer = setTimeout(showAttractMode, 15000);
}

function resetAttractTimer() {
    clearTimeout(attractTimer);
    hideAttractMode();
    startAttractTimer();
}

function showAttractMode() {
    const overlay = document.getElementById('attract-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    playAttractDemo();
}

function hideAttractMode() {
    const overlay = document.getElementById('attract-overlay');
    if (overlay) overlay.classList.remove('active');
    stopAttractDemo();
}

function stopAttractDemo() {
    attractIntervals.forEach(t => clearTimeout(t));
    attractIntervals = [];
    document.querySelectorAll('.attract-card').forEach(c => c.remove());
    const container = document.querySelector('.attract-container');
    if (container) container.remove();
}

function playAttractDemo() {
    stopAttractDemo();

    const pairs = [
        { concept: 'Thẻ khối', code: '<div>' },
        { concept: 'Liên kết', code: '<a>' },
        { concept: 'Hình ảnh', code: '<img>' },
        { concept: 'Màu chữ', code: 'color' }
    ];

    const cardData = [];
    pairs.forEach((p, i) => {
        cardData.push({ pairId: i, text: p.concept, type: 'concept' });
        cardData.push({ pairId: i, text: p.code, type: 'code' });
    });

    for (let i = cardData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardData[i], cardData[j]] = [cardData[j], cardData[i]];
    }

    const container = document.createElement('div');
    container.className = 'attract-container';
    container.style.cssText = 'position:fixed;inset:0;display:flex;align-items:center;justify-content:center;gap:8px;z-index:9998;pointer-events:none;flex-wrap:wrap;max-width:360px;margin:0 auto;padding:16px;';
    document.body.appendChild(container);

    const cards = [];
    cardData.forEach((d) => {
        const card = document.createElement('div');
        card.className = 'attract-card';
        card.style.width = '68px';
        card.style.height = '88px';
        card.dataset.pairId = d.pairId;
        card.innerHTML = `
            <div class="attract-card-inner">
                <div class="card-face card-back"><span class="card-back-icon">❓</span></div>
                <div class="card-face card-front">
                    <span class="card-category html" style="font-size:0.25rem">${d.type.toUpperCase()}</span>
                    <span class="card-text" style="font-size:0.4rem">${d.text}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
        cards.push(card);
    });

    let matched = 0;
    function aiStep() {
        if (matched >= pairs.length) {
            const t = setTimeout(() => {
                container.remove();
                const t2 = setTimeout(playAttractDemo, 2000);
                attractIntervals.push(t2);
            }, 1200);
            attractIntervals.push(t);
            return;
        }

        const pairCards = cards.filter(c => parseInt(c.dataset.pairId) === matched && !c.classList.contains('matched'));
        if (pairCards.length === 2) {
            const t1 = setTimeout(() => { pairCards[0].classList.add('flipped'); }, 400);
            const t2 = setTimeout(() => { pairCards[1].classList.add('flipped'); }, 1200);
            const t3 = setTimeout(() => {
                pairCards.forEach(c => c.classList.add('matched'));
                matched++;
                aiStep();
            }, 2000);
            attractIntervals.push(t1, t2, t3);
        } else {
            matched++;
            aiStep();
        }
    }

    const t0 = setTimeout(aiStep, 800);
    attractIntervals.push(t0);

    // Dismiss attract mode on any interaction
    function dismissAttract() {
        hideAttractMode();
        document.removeEventListener('click', dismissAttract);
        document.removeEventListener('keydown', dismissAttract);
        document.removeEventListener('touchstart', dismissAttract);
    }
    document.addEventListener('click', dismissAttract);
    document.addEventListener('keydown', dismissAttract);
    document.addEventListener('touchstart', dismissAttract);
}

// Override switchScreen to reset attract timer
const origSwitchScreen = switchScreen;
switchScreen = function(screenId) {
    origSwitchScreen(screenId);
    if (screenId === 'welcome') { startAttractTimer(); }
    else { clearTimeout(attractTimer); }
};

// Door-dash init: call init first, then set up intro
document.addEventListener('DOMContentLoaded', playIntro);
