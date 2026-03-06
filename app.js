/**
 * app.js - Main Application Logic
 * Initializes the application, handles routing between algorithms,
 * and manages global state like theme.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupNavigation();
    setupTabs();

    // Initialize components
    if (window.Visualizer && window.PseudocodeManager && window.AnimationController) {
        window.appVisualizer = new window.Visualizer();
        window.appPseudocode = new window.PseudocodeManager();
        window.appControls = new window.AnimationController(window.appVisualizer, window.appPseudocode);
    } else {
        // Fallback if loaded via script tags without modules
        // Provided instances are created at bottom of component files
        window.appControls = new AnimationController(window.appVisualizer, window.appPseudocode);
    }

    setupDataInput();

    // Default load Linear Search
    // Since we don't have algorithms yet built completely, this gets the first one.
    loadAlgorithm('linearSearch');
});

/**
 * Theme Toggle Functionality
 */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check local storage for preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.remove('dark-theme');
        updateThemeIcon(false);
    } else {
        body.classList.add('dark-theme');
        updateThemeIcon(true);
    }

    themeToggleBtn.addEventListener('click', () => {
        const isDark = body.classList.toggle('dark-theme');
        updateThemeIcon(isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function updateThemeIcon(isDark) {
    const icon = document.querySelector('#theme-toggle i');
    if (isDark) {
        icon.className = 'fa-solid fa-moon';
    } else {
        icon.className = 'fa-solid fa-sun';
    }
}

/**
 * Sidebar Navigation
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    const algoTitle = document.getElementById('current-algo-name');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all
            navItems.forEach(nav => nav.classList.remove('active'));

            // Add active class to clicked
            const target = e.currentTarget;
            target.classList.add('active');

            // Update title
            algoTitle.textContent = target.textContent.trim();

            // Get algorithm ID
            const algoId = target.getAttribute('data-algo');

            // Load the corresponding algorithm
            loadAlgorithm(algoId);
        });
    });
}

/**
 * Tab Switching (Pseudocode / Java Code)
 */
function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.target.getAttribute('data-target');

            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Update containers
            document.querySelectorAll('.code-container').forEach(c => {
                c.classList.remove('active');
            });
            document.getElementById(`${targetId}-container`).classList.add('active');
        });
    });
}

/**
 * Data Input Handling
 */
function setupDataInput() {
    const randomBtn = document.getElementById('random-data-btn');
    const setBtn = document.getElementById('set-data-btn');
    const inputField = document.getElementById('array-input');

    randomBtn.addEventListener('click', () => {
        // Generate array of 10-15 random numbers
        const size = Math.floor(Math.random() * 6) + 10;
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 1);
        inputField.value = arr.join(', ');
        triggerAlgorithmCurrent();
    });

    setBtn.addEventListener('click', () => {
        triggerAlgorithmCurrent();
    });
}

function triggerAlgorithmCurrent() {
    const activeNav = document.querySelector('.sidebar-nav li.active');
    if (activeNav) {
        const algoId = activeNav.getAttribute('data-algo');
        loadAlgorithm(algoId);
    }
}

/**
 * Algorithm Loading Mechanism
 */
function loadAlgorithm(algoId) {
    console.log(`Loading algorithm: ${algoId}`);

    // Reset visualization and controls state
    if (window.appVisualizer) {
        window.appVisualizer.clear();
    }
    if (window.appControls) {
        window.appControls.reset();
    }

    // Parse Input Array
    const inputVal = document.getElementById('array-input').value;
    let arr = [];
    if (inputVal) {
        arr = inputVal.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
    }
    if (arr.length === 0) {
        // Default array if empty
        arr = [34, 12, 45, 9, 23, 78, 56, 19, 8, 91];
        document.getElementById('array-input').value = arr.join(', ');
    }

    // Dispatch an event so specific script files can hook in
    const event = new CustomEvent('algorithmChanged', { detail: { algoId, array: arr } });
    window.dispatchEvent(event);
}

function updateExplanationPlaceholder(algoId) {
    document.getElementById('current-operation').textContent = 'Waiting to start...';
    // Placeholder - will be overwritten by specific algorithms
}
