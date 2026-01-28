document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            document.body.classList.toggle('dark-theme');
            
            const icon = this.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
                this.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                this.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
                localStorage.setItem('theme', 'light');
            }
        });
    }
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', function() {
            navList.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const currentPage = window.location.pathname.split('/').pop();
                
                if (href !== currentPage && !href.startsWith('#')) {
                    e.preventDefault();
                    navList.classList.remove('active');
                    const mainContent = document.querySelector('main');
                    if (mainContent) {
                        mainContent.classList.add('fade-out');
                    }
                    setTimeout(() => {
                        window.location.href = href;
                    }, 500);
                } else {
                    navList.classList.remove('active');
                }
            });
        });
        const mainContent = document.querySelector('main');
        if (mainContent) {
            mainContent.classList.add('fade-in');
            
            setTimeout(() => {
                mainContent.classList.remove('fade-in');
            }, 400);
        }
    }
    if (document.getElementById('results-body')) {
    loadStatsPage();
    setupStatsControls();
}

function loadStatsPage() {
    const results = JSON.parse(localStorage.getItem('typingGameResults') || '[]');

    const noResults = document.getElementById('no-results');
    const table = document.getElementById('results-table');
    const tbody = document.getElementById('results-body');

    if (results.length === 0) {
        noResults.style.display = 'block';
        table.style.display = 'none';
        return;
    }

    noResults.style.display = 'none';
    table.style.display = 'table';

    tbody.innerHTML = '';

    results.reverse().forEach(result => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${new Date(result.date).toLocaleString()}</td>
            <td>${result.name}</td>
            <td>${result.wpm}</td>
            <td>${result.accuracy}%</td>
            <td>${result.words}</td>
            <td>${result.time}s</td>
            <td>${capitalize(result.difficulty)}</td>
        `;

        tbody.appendChild(tr);
    });

    updateSummary(results);
}

function updateSummary(results) {
    document.getElementById('total-games').textContent = results.length;

    const avgWpm = Math.round(
        results.reduce((sum, r) => sum + r.wpm, 0) / results.length
    );

    const avgAccuracy = Math.round(
        results.reduce((sum, r) => sum + r.accuracy, 0) / results.length
    );

    const bestWpm = Math.max(...results.map(r => r.wpm));

    document.getElementById('avg-wpm').textContent = avgWpm;
    document.getElementById('avg-accuracy').textContent = avgAccuracy + '%';
    document.getElementById('best-wpm').textContent = bestWpm;
}

function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

});
function setupStatsControls() {
    const clearStatsBtn = document.getElementById('clear-stats');
    if (clearStatsBtn) {
        clearStatsBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete all game statistics? This cannot be undone.')) {
                localStorage.removeItem('typingGameResults');
                loadStatsPage();
                alert('All statistics have been cleared successfully!');
            }
        });
    }
    const exportStatsBtn = document.getElementById('export-stats');
    if (exportStatsBtn) {
        exportStatsBtn.addEventListener('click', function() {
            const results = JSON.parse(localStorage.getItem('typingGameResults') || '[]');
            if (results.length === 0) {
                alert('No game data to export. Play some games first!');
                return;
            }
            const jsonString = JSON.stringify(results, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = 'typing-game-statistics.json';
        
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            URL.revokeObjectURL(url);
            
            alert('Statistics exported successfully! File: typing-game-statistics.json');
        });
    }
}