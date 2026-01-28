// History array for storing generated numbers
let history = [];

// =====================
// Theme Management
// =====================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme === 'dark' ? '' : savedTheme);
        updateThemeIcon(savedTheme);
    } else if (!prefersDark) {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon('light');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme === 'dark' ? '' : newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    toggle.innerHTML = theme === 'light' ? '&#9728;' : '&#127769;';
    toggle.setAttribute('aria-label', theme === 'light' ? '다크 모드로 전환' : '라이트 모드로 전환');
}

// =====================
// Mobile Menu
// =====================
function toggleMobileMenu() {
    const navLinks = document.getElementById('navLinks');
    const btn = document.querySelector('.mobile-menu-btn');
    const isExpanded = navLinks.classList.toggle('active');
    btn.setAttribute('aria-expanded', isExpanded);
    btn.setAttribute('aria-label', isExpanded ? '메뉴 닫기' : '메뉴 열기');
}

// =====================
// Page Navigation
// =====================
function showPage(page) {
    const mainContent = document.getElementById('mainContent');
    const privacyPage = document.getElementById('privacyPage');
    const termsPage = document.getElementById('termsPage');

    mainContent.classList.add('page-hidden');
    privacyPage.classList.add('page-hidden');
    termsPage.classList.add('page-hidden');

    if (page === 'home') {
        mainContent.classList.remove('page-hidden');
    } else if (page === 'privacy') {
        privacyPage.classList.remove('page-hidden');
        window.scrollTo(0, 0);
        document.title = '개인정보처리방침 | LottoGen';
    } else if (page === 'terms') {
        termsPage.classList.remove('page-hidden');
        window.scrollTo(0, 0);
        document.title = '이용약관 | LottoGen';
    }

    if (page === 'home') {
        document.title = '로또 번호 생성기 | 무료 로또 645 번호 추첨 - 당첨 확률 통계';
    }

    // Close mobile menu
    document.getElementById('navLinks').classList.remove('active');
}

// =====================
// Number Generation
// =====================
function getColorClass(num, isBonus = false) {
    if (isBonus) return 'bonus';
    if (num <= 10) return 'range-1-10';
    if (num <= 20) return 'range-11-20';
    if (num <= 30) return 'range-21-30';
    if (num <= 40) return 'range-31-40';
    return 'range-41-45';
}

function generateNumbers() {
    const container = document.getElementById('numbersContainer');
    container.innerHTML = '';

    const numbers = [];
    while (numbers.length < 6) {
        const num = Math.floor(Math.random() * 45) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    numbers.sort((a, b) => a - b);

    let bonus;
    do {
        bonus = Math.floor(Math.random() * 45) + 1;
    } while (numbers.includes(bonus));

    numbers.forEach((num, index) => {
        const ball = document.createElement('div');
        ball.className = `number-ball ${getColorClass(num)}`;
        ball.textContent = num;
        ball.style.animationDelay = `${index * 0.1}s`;
        ball.setAttribute('role', 'listitem');
        ball.setAttribute('aria-label', `번호 ${num}`);
        container.appendChild(ball);
    });

    const divider = document.createElement('div');
    divider.className = 'divider';
    divider.style.animation = 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards';
    divider.style.animationDelay = '0.6s';
    divider.style.opacity = '0';
    divider.setAttribute('aria-hidden', 'true');
    container.appendChild(divider);

    const bonusWrapper = document.createElement('div');
    bonusWrapper.style.textAlign = 'center';

    const bonusBall = document.createElement('div');
    bonusBall.className = 'number-ball bonus';
    bonusBall.textContent = bonus;
    bonusBall.style.animationDelay = '0.7s';
    bonusBall.setAttribute('role', 'listitem');
    bonusBall.setAttribute('aria-label', `보너스 번호 ${bonus}`);
    bonusWrapper.appendChild(bonusBall);

    const bonusLabel = document.createElement('div');
    bonusLabel.className = 'bonus-label';
    bonusLabel.textContent = '보너스';
    bonusLabel.style.animation = 'popIn 0.5s ease forwards';
    bonusLabel.style.animationDelay = '0.8s';
    bonusLabel.style.opacity = '0';
    bonusWrapper.appendChild(bonusLabel);

    container.appendChild(bonusWrapper);
    addToHistory(numbers, bonus);

    // Announce to screen readers
    const announcement = `생성된 번호: ${numbers.join(', ')}, 보너스 번호: ${bonus}`;
    container.setAttribute('aria-label', announcement);
}

// =====================
// History Management
// =====================
function addToHistory(numbers, bonus) {
    history.unshift({ numbers, bonus });
    if (history.length > 5) history.pop();

    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');

    historySection.style.display = 'block';
    historyList.innerHTML = '';

    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.setAttribute('role', 'listitem');
        historyItem.setAttribute('aria-label', `기록 ${index + 1}: ${item.numbers.join(', ')}, 보너스 ${item.bonus}`);

        item.numbers.forEach(num => {
            const numEl = document.createElement('span');
            numEl.className = `history-number ${getColorClass(num)}`;
            numEl.textContent = num;
            historyItem.appendChild(numEl);
        });

        const divider = document.createElement('span');
        divider.className = 'history-divider';
        divider.textContent = '+';
        divider.setAttribute('aria-hidden', 'true');
        historyItem.appendChild(divider);

        const bonusEl = document.createElement('span');
        bonusEl.className = 'history-number bonus';
        bonusEl.textContent = item.bonus;
        historyItem.appendChild(bonusEl);

        historyList.appendChild(historyItem);
    });
}

// =====================
// FAQ Toggle
// =====================
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const isExpanded = faqItem.classList.toggle('active');
    button.setAttribute('aria-expanded', isExpanded);
}

// =====================
// Initialization
// =====================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    target.focus({ preventScroll: true });
                }
            }
        });
    });

    // Keyboard navigation for FAQ
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq(this);
            }
        });
    });
});
