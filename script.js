// ============================================================================
// 01. FIREBASE GUESTBOOK CONFIGURATION
// Connection is configured in firebase-rsvp.js.

AOS.init({ duration: 1000, once: true });

// ============================================================================
// 02. SECTION APPEAR / DISAPPEAR ANIMATION
// Controls when page sections fade in and out during scrolling.
// ============================================================================
function initializeSectionReveals() {
    const sections = document.querySelectorAll('.section-container, .footer');
    if (!sections.length) return;

    document.documentElement.classList.add('reveal-ready');

    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        sections.forEach(section => section.classList.add('section-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('section-visible', entry.isIntersecting);
        });
    }, {
        threshold: 0.1,
        rootMargin: '-6% 0px -6% 0px'
    });

    sections.forEach((section, index) => {
        section.removeAttribute('data-aos');
        section.classList.remove('aos-init', 'aos-animate');
        section.style.setProperty('--reveal-order', index);
        observer.observe(section);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSectionReveals);
} else {
    initializeSectionReveals();
}

// ============================================================================
// 03. DECORATIVE FALLING PETAL CANVAS
// Change the number 35 in createPetals() to increase/decrease petal quantity.
// ============================================================================
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let petals = [];

function createPetals() {
    for (let i = 0; i < 35; i++) {
        petals.push({ 
            x: Math.random() * canvas.width, 
            y: Math.random() * canvas.height, 
            width: Math.random() * 5 + 5,
            height: Math.random() * 8 + 9,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.045,
            flutter: Math.random() * Math.PI * 2,
            flutterSpeed: Math.random() * 0.025 + 0.012,
            opacity: Math.random() * 0.35 + 0.35,
            speed: Math.random() * 0.7 + 0.65,
            colour: Math.random() > 0.45 ? '205, 113, 134' : '242, 185, 190'
        });
    }
}

function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.scale(Math.cos(p.flutter) * 0.35 + 0.65, 1);

        const petalGradient = ctx.createLinearGradient(0, -p.height / 2, 0, p.height / 2);
        petalGradient.addColorStop(0, `rgba(${p.colour}, ${p.opacity * 0.7})`);
        petalGradient.addColorStop(0.55, `rgba(${p.colour}, ${p.opacity})`);
        petalGradient.addColorStop(1, `rgba(112, 31, 57, ${p.opacity * 0.7})`);
        ctx.fillStyle = petalGradient;

        ctx.beginPath();
        ctx.moveTo(0, -p.height / 2);
        ctx.bezierCurveTo(
            p.width * 0.72, -p.height * 0.24,
            p.width * 0.58, p.height * 0.3,
            0, p.height / 2
        );
        ctx.bezierCurveTo(
            -p.width * 0.58, p.height * 0.3,
            -p.width * 0.72, -p.height * 0.24,
            0, -p.height / 2
        );
        ctx.fill();
        ctx.restore();
    });
    updatePetals();
}

function updatePetals() {
    petals.forEach(p => { 
        p.y += p.speed;
        p.flutter += p.flutterSpeed;
        p.x += Math.sin(p.flutter) * 0.65;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height + p.height) { 
            p.y = -p.height; 
            p.x = Math.random() * canvas.width; 
        } 
    });
}

setInterval(drawPetals, 35);
createPetals();

// Handle window resize for canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ============================================================================
// 04. BACKGROUND MUSIC CONTROLS
// Add the audio file path in index.html before enabling the music button.
// ============================================================================
const musicToggle = document.getElementById('musicToggle');
function updateMusicButton() {
    const audio = document.getElementById('myAudio');
    if (!musicToggle) return;
    musicToggle.textContent = audio && !audio.paused ? '🔊' : '🔈';
}

function toggleAudio() {
    const audio = document.getElementById('myAudio');
    if (!audio) return;
    if (audio.paused) {
        audio.play().catch(() => {});
    } else {
        audio.pause();
    }
    updateMusicButton();
}

if (musicToggle) musicToggle.addEventListener('click', toggleAudio);

// ============================================================================
// 05. OPEN INVITATION / REMOVE THE OPENING SEAL
// ============================================================================
function fitCoverToViewport() {
    const hero = document.querySelector('.hero');
    const cover = hero?.querySelector('.hero-text');
    if (!hero || !cover) return;

    const footerNav = document.querySelector('.fab-container');
    const footerHeight = footerNav?.getBoundingClientRect().height || 0;
    const availableHeight = Math.max(320, window.innerHeight - footerHeight);

    hero.style.height = `${availableHeight}px`;
    hero.style.minHeight = `${availableHeight}px`;
    cover.style.setProperty('--cover-fit-scale', '1');

    requestAnimationFrame(() => {
        const heroStyle = window.getComputedStyle(hero);
        const verticalPadding = parseFloat(heroStyle.paddingTop) + parseFloat(heroStyle.paddingBottom);
        const horizontalPadding = parseFloat(heroStyle.paddingLeft) + parseFloat(heroStyle.paddingRight);
        const separatorSpace = window.innerWidth <= 480 ? 52 : 32;
        const usableHeight = Math.max(260, availableHeight - verticalPadding - separatorSpace);
        const usableWidth = Math.max(260, hero.clientWidth - horizontalPadding);
        const naturalHeight = cover.getBoundingClientRect().height;
        const naturalWidth = Math.max(cover.getBoundingClientRect().width, cover.scrollWidth);
        const maximumScale = 1;
        const scale = Math.min(maximumScale, usableHeight / naturalHeight, usableWidth / naturalWidth);

        cover.style.setProperty('--cover-fit-scale', scale.toFixed(4));
    });
}

function mulaMajlis() {
    const overlay = document.getElementById("overlay");
    if (overlay.classList.contains('seal-opening')) return;
    const audio = document.getElementById("myAudio");
    audio.play().catch(e => console.log("Audio blocked"));
    const mainContent = document.getElementById("main-content");
    mainContent.classList.add('card-entering');
    mainContent.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'instant' });
    AOS.refresh();
    fitCoverToViewport();
    // Paint the card below the viewport, then move both layers upward together.
    requestAnimationFrame(() => requestAnimationFrame(() => {
        overlay.classList.add('seal-opening');
        mainContent.classList.add('card-rising');
        mainContent.style.opacity = "1";
        setTimeout(() => {
            overlay.style.display = "none";
            mainContent.classList.remove('card-entering', 'card-rising');
            document.body.classList.remove('modal-open');
            const music = document.getElementById('musicToggle');
            if (music) music.style.display = 'block';
            updateMusicButton();
            AOS.refresh();
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 950);
    }));
}

let coverFitResizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(coverFitResizeTimer);
    coverFitResizeTimer = setTimeout(fitCoverToViewport, 120);
});

if (document.fonts?.ready) {
    document.fonts.ready.then(fitCoverToViewport);
}

// ============================================================================
// 06. WEDDING COUNTDOWN
// IMPORTANT: Replace the demo target date below before publishing.
// ============================================================================
const targetDate = new Date('2027-01-23T11:00:00').getTime();
let lastValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };

function updateCountdown(){
    const now = Date.now();
    const gap = targetDate - now;
    
    if (gap > 0) {
        const days = Math.floor(gap / 86400000);
        const hours = Math.floor((gap % 86400000) / 3600000);
        const minutes = Math.floor((gap % 3600000) / 60000);
        const seconds = Math.floor((gap % 60000) / 1000);
        
        // Only update the values that have changed
        if (days !== lastValues.days) {
            updateFlipValue('[data-unit="days"] .flip-value', days);
            lastValues.days = days;
        }
        if (hours !== lastValues.hours) {
            updateFlipValue('[data-unit="hours"] .flip-value', String(hours).padStart(2, '0'));
            lastValues.hours = hours;
        }
        if (minutes !== lastValues.minutes) {
            updateFlipValue('[data-unit="minutes"] .flip-value', String(minutes).padStart(2, '0'));
            lastValues.minutes = minutes;
        }
        if (seconds !== lastValues.seconds) {
            updateFlipValue('[data-unit="seconds"] .flip-value', String(seconds).padStart(2, '0'));
            lastValues.seconds = seconds;
        }
    } else {
        // Wedding day reached
        const timerEl = document.getElementById('countdown-timer');
        if (timerEl) {
            timerEl.innerHTML = '<p class="countdown-pill" style="text-align: center; margin: 20px 0;">Selamat Pengantin Baru! 💍</p>';
        }
    }
}

function updateFlipValue(selector, newValue) {
    const element = document.querySelector(selector);
    if (!element) return;
    
    const oldValue = element.textContent;
    if (oldValue === newValue) return;
    
    // Trigger flip animation
    element.classList.remove('flip');
    void element.offsetWidth; // Trigger reflow
    element.classList.add('flip');
    
    // Update value after flip animation starts
    setTimeout(() => {
        element.textContent = newValue;
    }, 300);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ============================================================================
// 07. TOAST FEEDBACK
// ============================================================================
// Toast helper
function showToast(message, timeout = 2200){
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = message;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('visible'), 20);
    setTimeout(() => { t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, timeout);
}

// ============================================================================
// 08. SAVE-THE-DATE / CALENDAR FILE GENERATION
// Wedding date details are read from index.html and getEventData() below.
// ============================================================================
function generateICS(e) {
    console.log('generateICS called');
    // Guard against missing event (inline onclick may not always provide `event`)
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    } else if (window.event) {
        // Older IE-style event
        window.event.returnValue = false;
    }

    function formatDate(d){
        return d.toISOString().replace(/-|:|\.\d{3}/g,'');
    }

    // Month name to zero-based month index.
    const monthMap = {
        'january':0,'february':1,'march':2,'april':3,'may':4,'june':5,'july':6,'august':7,'september':8,'october':9,'november':10,'december':11
    };

    // helper: parse a date-block entry
    function parseDateBlock(block){
        const titleEl = block.querySelector('.date-title');
        const timeEl = block.querySelector('.date-time');
        if(!titleEl || !timeEl) return null;
        // Example title: "📅31 December 2027 (Friday)"; remove icons and weekday.
        const titleText = titleEl.textContent.replace(/[📅🕒]/g,'').replace(/\(.*\)/,'').trim();
        const parts = titleText.split(/\s+/).filter(Boolean);
        // Extract day (first numeric part), handle emoji prefix
        const dayStr = parts[0] ? parts[0].replace(/\D/g, '') : '';
        const day = dayStr ? parseInt(dayStr, 10) : NaN;
        const monthName = (parts[1] || '').toLowerCase();
        const year = parseInt(parts[2] || new Date().getFullYear(),10);
        const month = monthMap[monthName] !== undefined ? monthMap[monthName] : (new Date().getMonth());
        // Validate parsed values
        if(isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 0 || month > 11){
            console.warn('Invalid date parsed:', {day, monthName, month, year, titleText});
            return null;
        }

        // Example time: "8:00 PM — 12:00 AM".
        let timeText = timeEl.textContent.trim();
        timeText = timeText.replace(/–|—/g,'-');
        const [startStr, endStr] = timeText.split('-').map(s=>s.trim());

        function parseTimePart(tp){
            // Examples: "8:00 PM" or "11:00 AM".
            const tokens = tp.split(/\s+/);
            let timePart = tokens[0];
            let period = (tokens.slice(1).join(' ')||'').toLowerCase();
            const [hhStr, mmStr] = timePart.split(':');
            let hh = parseInt(hhStr,10)||0;
            const mm = parseInt(mmStr,10)||0;
            if(period.includes('pm')){
                if(hh < 12) hh += 12;
            }
            if(period.includes('am')){
                if(hh === 12) hh = 0;
            }
            return {hh, mm};
        }

        const startT = parseTimePart(startStr || '09:00');
        const endT = parseTimePart(endStr || '11:00');

        const startDate = new Date(year, month, day, startT.hh, startT.mm);
        const endDate = new Date(year, month, day, endT.hh, endT.mm);
        
        // Check for invalid dates
        if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
            console.warn('Invalid date created:', {startDate, endDate, year, month, day});
            return null;
        }
        
        // If the end time passes midnight, move it to the following day.
        if(endDate <= startDate) endDate.setDate(endDate.getDate() + 1);

        return {startDate, endDate, summary: titleText};
    }

    // collect date-blocks
    const blocks = Array.from(document.querySelectorAll('.butiran-grid .date-block'));
    const events = blocks.map(parseDateBlock).filter(Boolean);
    console.log('generateICS: found date-blocks=', blocks.length, 'parsed events=', events.length);
    if(events.length === 0){
        alert('No event date information was found.');
        return;
    }

    const icsLines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DigitalCardMoody//EN'];
    events.forEach(ev => {
        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@wanajahid`);
        icsLines.push(`DTSTAMP:${formatDate(new Date())}`);
        icsLines.push(`DTSTART:${formatDate(ev.startDate)}`);
        icsLines.push(`DTEND:${formatDate(ev.endDate)}`);
        icsLines.push(`SUMMARY:The Wedding of [NAME 1] & [NAME 2] - ${ev.summary}`);
        icsLines.push('LOCATION:Wisma Melayu Kuching, Jln Diplomatik, Petra Jaya, 93050 Kuching, Sarawak');
        icsLines.push('DESCRIPTION:We invite you to celebrate our wedding with us.');
        icsLines.push('END:VEVENT');
    });
    icsLines.push('END:VCALENDAR');

    const ics = icsLines.join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Adi-Putra-and-Mulia-Yasmina-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

// Ensure `generateICS` is available on the global scope for inline `onclick` handlers
if (typeof window !== 'undefined') window.generateICS = generateICS;

// Extract event data for calendar links
// Demo event details. Replace these values before launch.
function getEventData(){
    // Hardcoded event details to ensure consistency
    const startDate = new Date(2027, 0, 23, 19, 0);
    const endDate = new Date(2027, 0, 23, 22, 0);
    
    if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
        console.error('Invalid event date');
        return null;
    }
    
    return {
        title: 'The Wedding of Adi Putra Suyanto & Mulia Yasmina Harman',
        startDate,
        endDate,
        location: 'Wisma Melayu Kuching, Jln Diplomatik, Petra Jaya, 93050 Kuching, Sarawak',
        description: 'We invite you to celebrate our wedding with us.'
    };
}

// Calendar modal functions
function openCalendarModal(e){
    if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
    }
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeCalendarModal(){
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
}

// Add to Google Calendar
function addToGoogleCalendar(){
    const data = getEventData();
    if(!data){
        alert('Maklumat tarikh tidak dijumpai');
        return;
    }
    const startDate = data.startDate.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
    const endDate = data.endDate.toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(data.title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(data.description)}&location=${encodeURIComponent(data.location)}`;
    window.open(url, '_blank');
    closeCalendarModal();
}

// Add to Apple Calendar (downloads ICS)
function addToAppleCalendar(){
    downloadICS();
}

// Download ICS file
function downloadICS(){
    const data = getEventData();
    if(!data){
        alert('Maklumat tarikh tidak dijumpai');
        return;
    }
    
    function formatDate(d){
        return d.toISOString().replace(/-|:|\.\d{3}/g,'');
    }
    
    const icsLines = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//DigitalCardMoody//EN'];
    icsLines.push('BEGIN:VEVENT');
    icsLines.push(`UID:${Date.now()}-${Math.random().toString(36).slice(2)}@wanajahid`);
    icsLines.push(`DTSTAMP:${formatDate(new Date())}`);
    icsLines.push(`DTSTART:${formatDate(data.startDate)}`);
    icsLines.push(`DTEND:${formatDate(data.endDate)}`);
    icsLines.push(`SUMMARY:${data.title}`);
    icsLines.push(`LOCATION:${data.location}`);
    icsLines.push(`DESCRIPTION:${data.description}`);
    icsLines.push('END:VEVENT');
    icsLines.push('END:VCALENDAR');
    
    const ics = icsLines.join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Adi-Putra-and-Mulia-Yasmina-Wedding.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    closeCalendarModal();
}

// Close modal on ESC or outside click
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('calendarModal');
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.classList.contains('open')) {
            closeCalendarModal();
        }
    });
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeCalendarModal();
            }
        });
    }
});

if (typeof window !== 'undefined') {
    window.openCalendarModal = openCalendarModal;
    window.closeCalendarModal = closeCalendarModal;
    window.addToGoogleCalendar = addToGoogleCalendar;
    window.addToAppleCalendar = addToAppleCalendar;
    window.downloadICS = downloadICS;
}

// Keyboard accessibility: toggle audio with Enter/Space when focused; 'm' shortcut when not typing
if (musicToggle) {
    musicToggle.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleAudio(); }
    });
}
document.addEventListener('keydown', e => {
    const active = document.activeElement;
    const typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT');
    if (typing) return;
    if (e.key.toLowerCase() === 'm') toggleAudio();
});

// ============================================================================
// 09. OPTIONAL WHATSAPP SHARING
// The first-section share button is currently removed from index.html.
// ============================================================================
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const text = encodeURIComponent('I am invited to the wedding of [NAME 1] & [NAME 2]! 💍 [WEDDING DATE] at Wisma Melayu Kuching, Jln Diplomatik, Petra Jaya, 93050 Kuching, Sarawak');
        const url = window.location.href;
        const waURL = `https://wa.me/?text=${text}${encodeURIComponent(url)}`;
        window.open(waURL, '_blank');
    });
}

// ============================================================================
// 10. DARK MODE (CONTROL CURRENTLY HIDDEN BY moody-layout.css)
// ============================================================================
const darkModeToggle = document.getElementById('darkModeToggle');
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function applyDarkMode() {
    if (isDarkMode) {
        document.documentElement.style.setProperty('--cream', '#1a1a1a');
        document.documentElement.style.setProperty('--ivory', '#242424');
        document.documentElement.style.setProperty('--dark', '#e0e0e0');
        document.documentElement.style.setProperty('--light-accent', '#444');
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    } else {
        document.documentElement.style.setProperty('--cream', '#FBF8F3');
        document.documentElement.style.setProperty('--ivory', '#F5F1EB');
        document.documentElement.style.setProperty('--dark', '#2C2C2C');
        document.documentElement.style.setProperty('--light-accent', '#E8DCC8');
        document.body.classList.remove('dark-mode');
        darkModeToggle.textContent = '🌙';
    }
}

if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('darkMode', isDarkMode);
        applyDarkMode();
    });
}

applyDarkMode();

// ============================================================================
// 11. RSVP CONFETTI AND PAGE NAVIGATION CONTROLS
// ============================================================================
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiPieces = 50;
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#D4AF8E', '#C9A876', '#FFE8D6', '#fff'][Math.floor(Math.random() * 4)];
        confetti.style.animationDelay = Math.random() * 0.3 + 's';
        container.appendChild(confetti);
    }
    setTimeout(() => container.innerHTML = '', 3000);
}

// Back to Top button behavior (footer)
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Floating Action Buttons: RSVP, Contact, Location

const fabRSVP = document.getElementById('fabRSVP');
const fabContact = document.getElementById('fabContact');
const fabLocation = document.getElementById('fabLocation');

if (fabRSVP) {
    fabRSVP.addEventListener('click', () => {
        openRSVPModal();
    });
}

// RSVP popup opened by the fixed footer/navigation button.
function openRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstField = modal.querySelector('input, select, textarea');
    if (firstField) setTimeout(() => firstField.focus(), 80);
}

function closeRSVPModal() {
    const modal = document.getElementById('rsvpModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (fabRSVP) fabRSVP.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('rsvpModal');
    if (!modal) return;

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeRSVPModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeRSVPModal();
        }
    });
});

if (fabContact) {
    fabContact.addEventListener('click', () => {
        openContactModal();
    });
}

// Contacts popup opened by the fixed footer/navigation button.
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstContact = modal.querySelector('.contact-card');
    if (firstContact) setTimeout(() => firstContact.focus(), 80);
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (fabContact) fabContact.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('contactModal');
    if (!modal) return;

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeContactModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeContactModal();
        }
    });
});

if (fabLocation) {
    fabLocation.addEventListener('click', () => {
        openLocationModal();
    });
}

// Venue popup opened by the fixed footer/navigation Location button.
function openLocationModal() {
    const modal = document.getElementById('locationModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const firstLink = modal.querySelector('a');
    if (firstLink) setTimeout(() => firstLink.focus(), 80);
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (fabLocation) fabLocation.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('locationModal');
    if (!modal) return;

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeLocationModal();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('open')) {
            closeLocationModal();
        }
    });
});

// 'Arah' (directions) FAB removed — use Location (Google Maps) or Waze links in the location section.

// ============================================================================
// 12. RSVP FORM SUBMISSION
// Saves to Firebase; success is shown only after the database confirms the write.
// ============================================================================
document.querySelectorAll('#rsvp-form, #inline-rsvp-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button[type="submit"]');
        const originalLabel = btn.innerHTML;
        const success = form.parentElement.querySelector('.rsvp-success');
        btn.innerHTML = "Menghantar...";
        btn.disabled = true;
        success.style.display = 'none';

        try {
            // Get form data
            const formData = {
                nama: form.querySelector('input[name="nama"]').value,
                kehadiran: new FormData(form).get('kehadiran'),
                jumlah: new FormData(form).get('jumlah') || '0',
                ucapan: form.querySelector('textarea[name="ucapan"]').value
            };

            // Validate
            if (!formData.nama || !formData.kehadiran) {
                showToast('Please enter your name and attendance status');
                btn.innerHTML = originalLabel;
                btn.disabled = false;
                return;
            }

            if (!window.moodyRSVP) throw new Error('RSVP service could not load. Please refresh and try again.');
            await window.moodyRSVP.submit(formData);
            showToast('Thank you! Your RSVP has been received');
            success.textContent = 'Thank you! Your RSVP has been received. 🎉';
            success.style.display = 'block';
            createConfetti();
            form.reset();
        } catch (error) {
            console.error('Error:', error);
            showToast('Error: ' + error.message);
        } finally {
            btn.innerHTML = originalLabel;
            btn.disabled = false;
        }
    });
});

// ============================================================================
// 13. ATTENDANCE COUNTS AND GUEST WISHES SLIDER
// ============================================================================
function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

// Update attendance counts
function updateAttendanceStats(){
    const items = window.guestbookData || [];
    const countHadir = items.filter(item => item.kehadiran === 'Attending').length;
    const countTidakHadir = items.filter(item => item.kehadiran === 'Not Attending').length;
    
    const hEl = document.getElementById('countHadir');
    const tEl = document.getElementById('countTidakHadir');
    if(hEl) hEl.textContent = countHadir;
    if(tEl) tEl.textContent = countTidakHadir;
}

function renderGuestbook(){
    const sliderEl = document.getElementById('guestbook-slider');
    const emptyEl = document.getElementById('guestbook-empty');
    if (!sliderEl) return;
    
    // Get data from window variable set by JSONP, or empty array
    const items = (window.guestbookData || []).slice().reverse(); // newest first
    sliderEl.innerHTML = '';
    
    if (items.length === 0) {
        emptyEl.style.display = 'block';
        document.getElementById('guestbook-slider-container').style.display = 'none';
        updateAttendanceStats();
        return;
    }
    
    document.getElementById('guestbook-slider-container').style.display = 'block';
    emptyEl.style.display = 'none';
    
    // Create one vertical entry for every wish.
    items.forEach((item) => {
        const entry = document.createElement('article');
        entry.className = 'guestbook-scroll-entry';
        
        const nama = escapeHtml(item.nama || '—');
        const ucapan = escapeHtml(item.ucapan || '');
        
        entry.innerHTML = `
            <div class="guestbook-slide-content">
                <div class="guestbook-message">"${ucapan || 'No message'}"</div>
                <div class="guestbook-name">${nama}</div>
            </div>`;
        sliderEl.appendChild(entry);
    });

    // Keep the newest wish visible first whenever the list is refreshed.
    const viewport = sliderEl.closest('.guestbook-scroll-viewport');
    if (viewport) viewport.scrollTop = 0;

    updateAttendanceStats();
}

// Initial render on load
document.addEventListener('DOMContentLoaded', () => {
    renderGuestbook();
});

// 14. FIREBASE LIVE GUESTBOOK
window.addEventListener('load', () => {
    window.guestbookData = [];
    renderGuestbook();
    if (window.moodyRSVP) {
        window.moodyRSVP.listen((items) => {
            window.guestbookData = items;
            renderGuestbook();
        }, () => {
            const empty = document.getElementById('guestbook-empty');
            if (empty) empty.textContent = 'Guest wishes are unavailable. Please try again later.';
        });
    }
});

// ============================================================================
// 15. CONTACT CARD PHONE AND KEYBOARD BEHAVIOR
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.contact-card').forEach(card => {
        // Click on card initiates call
        card.addEventListener('click', (e) => {
            // If clicked element is a link (e.g., WhatsApp), let that handle it
            const target = e.target.closest('a');
            if (target) return;
            const tel = card.dataset.tel;
            if (tel) window.location.href = 'tel:' + tel;
        });

        // Keyboard accessibility
        card.addEventListener('keydown', (e) => {
            if (e.target.closest('a')) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const tel = card.dataset.tel;
                if (tel) window.location.href = 'tel:' + tel;
            }
        });

        // Prevent WA link clicks from bubbling to the card
        card.querySelectorAll('a').forEach(a => a.addEventListener('click', (ev) => ev.stopPropagation()));
    });
});

