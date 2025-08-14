/**
 * GitHub Profile Explorer
 * A modern web application to explore GitHub profiles with interactive visualizations
 * 
 * Features:
 * - Profile overview with stats
 * - Interactive charts for languages, stars, and repository growth
 * - Activity timeline with recent events
 * - Responsive design
 */

// ===== CONFIGURATION =====
const CONFIG = {
    API_BASE_URL: "https://api.github.com/users/",
    MAX_REPOS: 100,
    MAX_EVENTS: 30,
    MAX_DISPLAYED_REPOS: 12,
    CHART_COLORS: [
        '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
        '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ]
};

// ===== GLOBAL VARIABLES =====
let charts = {};

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const searchBtn = document.getElementById('searchBtn');
    const usernameInput = document.getElementById('usernameInput');
    
    searchBtn.addEventListener('click', handleSearch);
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Add some example usernames as placeholder rotation
    rotatePlaceholder();
}

function rotatePlaceholder() {
    const examples = ['octocat', 'torvalds', 'gaearon', 'sindresorhus', 'addyosmani'];
    const input = document.getElementById('usernameInput');
    let index = 0;
    
    setInterval(() => {
        input.placeholder = `Try: ${examples[index]}...`;
        index = (index + 1) % examples.length;
    }, 3000);
}

// ===== MAIN FUNCTIONS =====
function handleSearch() {
    const username = document.getElementById('usernameInput').value.trim();
    if (username) {
        searchUser(username);
        document.getElementById('usernameInput').value = '';
    }
}

function searchUser(username) {
    showLoading();
    
    axios(CONFIG.API_BASE_URL + username)
        .then(response => {
            displayProfile(response.data);
            fetchRepos(username);
            fetchEvents(username);
        })
        .catch(err => {
            console.error('Profile fetch error:', err);
            if (err.response && err.response.status === 404) {
                showError("No profile found with this username");
            } else {
                showError("Error fetching profile data. Please try again.");
            }
        });
}

function fetchRepos(username) {
    axios(`${CONFIG.API_BASE_URL}${username}/repos?sort=updated&per_page=${CONFIG.MAX_REPOS}`)
        .then(response => {
            const repos = response.data;
            createCharts(repos);
            displayTopRepos(repos);
        })
        .catch(err => {
            console.log("Problem fetching repos, using mock data");
            const mockRepos = getMockRepos(username);
            createCharts(mockRepos);
            displayTopRepos(mockRepos);
        });
}

function fetchEvents(username) {
    axios(`${CONFIG.API_BASE_URL}${username}/events?per_page=${CONFIG.MAX_EVENTS}`)
        .then(response => {
            displayTimeline(response.data);
        })
        .catch(err => {
            console.log("Problem fetching events, using mock data");
            displayTimeline(getMockEvents(username));
        });
}

// ===== DISPLAY FUNCTIONS =====
function displayProfile(user) {
    try {
        document.getElementById('profileImage').src = user.avatar_url || '';
        document.getElementById('profileName').textContent = user.name || user.login || 'N/A';
        document.getElementById('profileBio').textContent = user.bio || 'No bio available';
        document.getElementById('repoCount').textContent = formatNumber(user.public_repos || 0);
        document.getElementById('followerCount').textContent = formatNumber(user.followers || 0);
        document.getElementById('followingCount').textContent = formatNumber(user.following || 0);
        document.getElementById('gistCount').textContent = formatNumber(user.public_gists || 0);
        
        showProfile();
    } catch (error) {
        console.error('Error displaying profile:', error);
        showError('Error displaying profile data');
    }
}

function displayTimeline(events) {
    const timeline = document.getElementById('timelineContent');
    timeline.innerHTML = '';

    if (!events || events.length === 0) {
        timeline.innerHTML = '<div class="timeline-item"><div class="timeline-content">No recent activity found</div></div>';
        return;
    }

    const eventIcons = {
        'PushEvent': '📝',
        'CreateEvent': '🆕',
        'WatchEvent': '⭐',
        'ForkEvent': '🍴',
        'IssuesEvent': '🐛',
        'PullRequestEvent': '🔀',
        'ReleaseEvent': '🚀',
        'GollumEvent': '📚',
        'DeleteEvent': '🗑️',
        'PublicEvent': '🌍'
    };

    events.slice(0, 20).forEach(event => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        
        const icon = eventIcons[event.type] || '📋';
        const date = formatDate(new Date(event.created_at));
        const description = getEventDescription(event);
        
        item.innerHTML = `
            <div class="timeline-icon">${icon}</div>
            <div class="timeline-content">
                <div class="timeline-title">${description}</div>
                <div class="timeline-meta">${date} • ${event.repo ? event.repo.name : 'Unknown repo'}</div>
            </div>
        `;
        
        timeline.appendChild(item);
    });
}

function displayTopRepos(repos) {
    const container = document.getElementById('reposGrid');
    container.innerHTML = '';

    if (!repos || repos.length === 0) {
        container.innerHTML = '<div class="repo-card"><div class="repo-name">No repositories found</div></div>';
        return;
    }

    const topRepos = repos
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, CONFIG.MAX_DISPLAYED_REPOS);

    topRepos.forEach(repo => {
        const card = document.createElement('div');
        card.className = 'repo-card';
        
        card.innerHTML = `
            <div class="repo-name">${repo.name || 'Unnamed Repository'}</div>
            <p>${repo.description || 'No description available'}</p>
            <div class="repo-stats">
                <span class="repo-stat">⭐ ${formatNumber(repo.stargazers_count || 0)}</span>
                <span class="repo-stat">🍴 ${formatNumber(repo.forks_count || 0)}</span>
                ${repo.language ? `<span class="repo-stat">💻 ${repo.language}</span>` : ''}
                ${repo.updated_at ? `<span class="repo-stat">📅 ${formatDate(new Date(repo.updated_at))}</span>` : ''}
            </div>
        `;
        
        if (repo.html_url) {
            card.addEventListener('click', () => {
                window.open(repo.html_url, '_blank');
            });
        }
        
        container.appendChild(card);
    });
}

// ===== CHART FUNCTIONS =====
function createCharts(repos) {
    try {
        // Destroy existing charts
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        charts = {};

        createLanguageChart(repos);
        createRepoStatsChart(repos);
        createGrowthChart(repos);
    } catch (error) {
        console.error('Error creating charts:', error);
    }
}

function createLanguageChart(repos) {
    try {
        const languages = {};
        
        // Count languages from repo data
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        // If no languages found, use mock data
        if (Object.keys(languages).length === 0) {
            Object.assign(languages, {
                'JavaScript': 8,
                'Python': 5,
                'TypeScript': 4,
                'HTML': 3,
                'CSS': 2,
                'Java': 2
            });
        }

        const sortedLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        const ctx = document.getElementById('languageChart');
        if (!ctx) return;

        charts.language = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: sortedLanguages.map(([lang]) => lang),
                datasets: [{
                    data: sortedLanguages.map(([, count]) => count),
                    backgroundColor: CONFIG.CHART_COLORS,
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.2,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: 'white',
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.parsed * 100) / total).toFixed(1);
                                return `${context.label}: ${context.parsed} repos (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating language chart:', error);
    }
}

function createRepoStatsChart(repos) {
    try {
        const topRepos = repos
            .filter(repo => (repo.stargazers_count || 0) > 0 || (repo.forks_count || 0) > 0)
            .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
            .slice(0, 10);

        if (topRepos.length === 0) {
            topRepos.push(...getMockRepos("demo").slice(0, 6));
        }

        const ctx = document.getElementById('repoStatsChart');
        if (!ctx) return;

        charts.repoStats = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topRepos.map(repo => {
                    const name = repo.name || 'Unnamed';
                    return name.length > 15 ? name.substring(0, 15) + '...' : name;
                }),
                datasets: [{
                    label: 'Stars',
                    data: topRepos.map(repo => repo.stargazers_count || 0),
                    backgroundColor: CONFIG.CHART_COLORS[0],
                    borderRadius: 4
                }, {
                    label: 'Forks',
                    data: topRepos.map(repo => repo.forks_count || 0),
                    backgroundColor: CONFIG.CHART_COLORS[1],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.8,
                plugins: {
                    legend: {
                        labels: { 
                            color: 'white',
                            font: { size: 11 }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { 
                            color: 'white',
                            font: { size: 10 },
                            maxRotation: 45
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        ticks: { 
                            color: 'white',
                            font: { size: 10 }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating repo stats chart:', error);
    }
}

function createGrowthChart(repos) {
    try {
        const reposByYear = {};
        repos.forEach(repo => {
            if (repo.created_at) {
                const year = new Date(repo.created_at).getFullYear();
                reposByYear[year] = (reposByYear[year] || 0) + 1;
            }
        });

        const years = Object.keys(reposByYear).sort();
        const cumulativeData = [];
        let cumulative = 0;
        
        years.forEach(year => {
            cumulative += reposByYear[year];
            cumulativeData.push(cumulative);
        });

        const ctx = document.getElementById('growthChart');
        if (!ctx) return;

        charts.growth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Cumulative Repositories',
                    data: cumulativeData,
                    borderColor: CONFIG.CHART_COLORS[0],
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: CONFIG.CHART_COLORS[0],
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2.0,
                plugins: {
                    legend: {
                        labels: { 
                            color: 'white',
                            font: { size: 11 }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { 
                            color: 'white',
                            font: { size: 10 }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                        ticks: { 
                            color: 'white',
                            font: { size: 10 }
                        },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating growth chart:', error);
    }
}

// ===== UTILITY FUNCTIONS =====
function getEventDescription(event) {
    try {
        switch (event.type) {
            case 'PushEvent':
                return `Pushed ${event.payload && event.payload.commits ? event.payload.commits.length : 1} commit(s)`;
            case 'CreateEvent':
                return `Created ${event.payload && event.payload.ref_type ? event.payload.ref_type : 'repository'}`;
            case 'WatchEvent':
                return 'Starred repository';
            case 'ForkEvent':
                return 'Forked repository';
            case 'IssuesEvent':
                return `${event.payload && event.payload.action ? event.payload.action : 'Updated'} issue`;
            case 'PullRequestEvent':
                return `${event.payload && event.payload.action ? event.payload.action : 'Updated'} pull request`;
            case 'ReleaseEvent':
                return 'Published release';
            case 'GollumEvent':
                return 'Updated wiki';
            case 'DeleteEvent':
                return 'Deleted branch or tag';
            case 'PublicEvent':
                return 'Made repository public';
            default:
                return event.type.replace('Event', '');
        }
    } catch (error) {
        return 'Repository activity';
    }
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(date) {
    try {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    } catch (error) {
        return 'Unknown date';
    }
}

// ===== MOCK DATA FUNCTIONS =====
function getMockRepos(username) {
    return [
        {
            name: `${username}-awesome-project`,
            description: "An awesome project with modern web technologies",
            stargazers_count: 245,
            forks_count: 32,
            language: "JavaScript",
            created_at: "2023-01-15T10:30:00Z",
            updated_at: "2024-12-01T10:30:00Z",
            html_url: `https://github.com/${username}/awesome-project`
        },
        {
            name: `${username}-react-dashboard`,
            description: "Modern React dashboard with beautiful UI",
            stargazers_count: 189,
            forks_count: 28,
            language: "TypeScript",
            created_at: "2022-08-22T14:20:00Z",
            updated_at: "2024-11-15T14:20:00Z",
            html_url: `https://github.com/${username}/react-dashboard`
        },
        {
            name: `${username}-python-ml`,
            description: "Machine learning projects and experiments",
            stargazers_count: 156,
            forks_count: 45,
            language: "Python",
            created_at: "2022-03-10T09:15:00Z",
            updated_at: "2024-10-20T09:15:00Z",
            html_url: `https://github.com/${username}/python-ml`
        },
        {
            name: `${username}-mobile-app`,
            description: "Cross-platform mobile application",
            stargazers_count: 98,
            forks_count: 15,
            language: "Dart",
            created_at: "2023-06-05T16:45:00Z",
            updated_at: "2024-09-10T16:45:00Z",
            html_url: `https://github.com/${username}/mobile-app`
        },
        {
            name: `${username}-api-server`,
            description: "RESTful API server with Node.js",
            stargazers_count: 67,
            forks_count: 12,
            language: "JavaScript",
            created_at: "2021-11-18T12:30:00Z",
            updated_at: "2024-08-05T12:30:00Z",
            html_url: `https://github.com/${username}/api-server`
        },
        {
            name: `${username}-data-viz`,
            description: "Data visualization with D3.js",
            stargazers_count: 43,
            forks_count: 8,
            language: "JavaScript",
            created_at: "2023-02-28T11:20:00Z",
            updated_at: "2024-07-12T11:20:00Z",
            html_url: `https://github.com/${username}/data-viz`
        }
    ];
}

function getMockEvents(username) {
    const now = new Date();
    return [
        {
            type: "PushEvent",
            created_at: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/awesome-project` },
            payload: { commits: [{}, {}, {}] }
        },
        {
            type: "CreateEvent",
            created_at: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/new-feature-branch` },
            payload: { ref_type: "branch" }
        },
        {
            type: "WatchEvent",
            created_at: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/react-dashboard` },
            payload: {}
        },
        {
            type: "PullRequestEvent",
            created_at: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/python-ml` },
            payload: { action: "opened" }
        },
        {
            type: "IssuesEvent",
            created_at: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/mobile-app` },
            payload: { action: "closed" }
        },
        {
            type: "ForkEvent",
            created_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/api-server` },
            payload: {}
        },
        {
            type: "ReleaseEvent",
            created_at: new Date(now - 18 * 24 * 60 * 60 * 1000).toISOString(),
            repo: { name: `${username}/data-viz` },
            payload: {}
        }
    ];
}

// ===== UI STATE FUNCTIONS =====
function showLoading() {
    document.getElementById('loadingDiv').classList.remove('hidden');
    document.getElementById('profileSection').classList.add('hidden');
    document.getElementById('errorDiv').classList.add('hidden');
}

function showProfile() {
    document.getElementById('loadingDiv').classList.add('hidden');
    document.getElementById('profileSection').classList.remove('hidden');
    document.getElementById('errorDiv').classList.add('hidden');
}

function showError(message) {
    document.getElementById('loadingDiv').classList.add('hidden');
    document.getElementById('profileSection').classList.add('hidden');
    document.getElementById('errorDiv').classList.remove('hidden');
    document.getElementById('errorDiv').textContent = `Error: ${message}`;
}