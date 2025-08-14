# 🚀 GitHub Profile Explorer

A modern, interactive web application to explore GitHub profiles with beautiful visualizations and comprehensive analytics.

![GitHub Profile Explorer](https://img.shields.io/badge/GitHub-Profile%20Explorer-blue?style=for-the-badge&logo=github)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white)

## ✨ Features

### 🌟 Core Features
- **GitHub Timeline View (Activity Tracker)** - Scrollable timeline showing recent PRs, issues, commits, and more
- **Interactive Repo Stats Dashboard** - Visual charts for languages, stars, forks, and repository growth
- **Profile Overview** - Complete user information with follower stats
- **Top Repositories** - Grid view of user's most popular repositories

### 📊 Interactive Charts
- **🎨 Languages Used** - Doughnut chart showing programming language distribution
- **⭐ Stars & Forks** - Bar chart comparing repository popularity
- **📈 Repository Growth** - Line chart tracking repository creation over time

### 🎨 Design Features
- **Modern Glass Morphism** - Beautiful backdrop blur effects
- **Dark Theme** - Elegant dark theme with gradient backgrounds
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Smooth Animations** - Engaging hover effects and transitions

## 🚀 Live Demo

[🌐 Try it Live](https://Astrother26.github.io/GitHub-Profile-Dashboard-Project)

## 📸 Screenshots

### Dashboard Overview
![Dashboard](<img width="1901" height="918" alt="image" src="https://github.com/user-attachments/assets/3427df96-3445-4ba1-b8d4-f8755357c767" />
)

### Profile Statistics
![Profile Stats](<img width="1819" height="702" alt="image" src="https://github.com/user-attachments/assets/cef8a842-0e0c-4e7f-ac96-bb52dc1ca58b" />
)

### Interactive Charts
![Charts](<img width="1791" height="806" alt="image" src="https://github.com/user-attachments/assets/28a46314-f392-4ec1-8715-c8a6fc47458f" />
)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/github-profile-explorer.git
   cd github-profile-explorer
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server (recommended)
   python -m http.server 8000
   # Navigate to http://localhost:8000
   ```

## 📁 Project Structure

```
github-profile-explorer/
├── index.html              # Main HTML file
├── css/
│   └── style.css           # Stylesheet with modern design
├── js/
│   └── script.js           # Main JavaScript functionality
├── screenshots/            # Project screenshots
├── README.md              # Project documentation
├── LICENSE                # MIT License
└── .gitignore            # Git ignore file
```

## 🎯 Usage

1. **Enter a GitHub username** in the search box
2. **Click "Explore"** or press Enter
3. **View the interactive dashboard** with:
   - Profile information and statistics
   - Recent activity timeline
   - Programming language distribution
   - Repository stats and growth charts
   - Top repositories grid

### 💡 Example Usernames to Try:
- `octocat` - GitHub's mascot
- `torvalds` - Linus Torvalds
- `gaearon` - Dan Abramov (React team)
- `sindresorhus` - Popular open source contributor
- `addyosmani` - Google Chrome team

## 🛡️ API Usage

This project uses the **GitHub REST API v3**:
- **No authentication required** for basic profile data
- **Rate limit:** 60 requests per hour for unauthenticated requests
- **Fallback system:** Mock data when API limits are reached

### API Endpoints Used:
- `GET /users/{username}` - User profile information
- `GET /users/{username}/repos` - User repositories
- `GET /users/{username}/events` - User activity events

## 🎨 Customization

### Colors
Modify the color scheme in `css/style.css`:
```css
:root {
  --primary-gradient: linear-gradient(45deg, #4facfe, #00f2fe);
  --background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
}
```

### Chart Configuration
Update chart settings in `js/script.js`:
```javascript
const CONFIG = {
    MAX_REPOS: 100,
    MAX_EVENTS: 30,
    CHART_COLORS: ['#4facfe', '#00f2fe', '#43e97b', '#38f9d7']
};
```

## 🔧 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No framework dependencies
- **Chart.js** - Interactive charts and graphs
- **Axios** - HTTP client for API requests
- **GitHub API** - Real-time data fetching

## 📱 Browser Support

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ⚠️ IE11+ (limited support)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Setup:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Feature Ideas:
- [ ] GitHub Pages deployment integration
- [ ] Export profile data as PDF
- [ ] Compare multiple users
- [ ] Repository language details API integration
- [ ] User search with autocomplete
- [ ] Dark/Light theme toggle

## 🙏 Acknowledgments

- **GitHub API** for providing comprehensive developer data
- **Chart.js** for beautiful and interactive charts
- **Google Fonts (Inter)** for clean typography
- **GitHub Community** for inspiration and feedback

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/your-username/github-profile-explorer?style=social)
![GitHub Forks](https://img.shields.io/github/forks/your-username/github-profile-explorer?style=social)
![GitHub Issues](https://img.shields.io/github/issues/your-username/github-profile-explorer)
![GitHub License](https://img.shields.io/github/license/your-username/github-profile-explorer)

## 🔗 Connect

- **GitHub:** [@your-username](https://github.com/Astrother26)
- **LinkedIn:** [Your Name](https://www.linkedin.com/in/shrija-yadav-bb1980257)

---

⭐ **If you found this project helpful, please give it a star!** ⭐
