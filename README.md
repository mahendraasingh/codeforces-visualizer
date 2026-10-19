# 📊 Codeforces Visualizer

A responsive, interactive web application built with **React** and **Parcel** to search, analyze, and visualize **Codeforces** competitive programming profiles.

![Codeforces Visualizer](https://codeforces.org/s/73673/images/codeforces-sponsored-by-ton.png)

---

## 🚀 Features

- **🔍 Handle Search**: Instantly look up any Codeforces user profile with search button or by pressing <kbd>Enter</kbd>.
- **👤 Profile Overview**: View user avatar, name, location (city/country), and organization.
- **📈 Rating & Rank**: Display current rating, current title/rank, maximum rating, and maximum rank achieved.
- **🏆 Best Contest Performance**: Identifies the user's highest contest rank and contest name across all rated rounds.
- **🧩 Solved Problem Analytics**:
  - Total number of unique accepted (`OK`) problems solved.
  - Quick link to the most recently solved problem with associated topic tags.
  - Tag-wise problem breakdown badges (Dynamic Programming, Math, Greedy, Graphs, Data Structures, etc.).
- **⚡ Skeleton Loading (Shimmer UI)**: Smooth animated shimmer state while fetching live data from Codeforces API.
- **🛡️ Error Handling**: Friendly error messages for invalid handles, rate limits, or unrated users.

---

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://react.dev/)
- **Bundler**: [Parcel](https://parceljs.org/)
- **API**: [Codeforces Public REST API](https://codeforces.com/apiHelp)
- **Styling**: Vanilla CSS3 (Flexbox, CSS Animations, Responsive Design)

---

## 📂 Project Structure

```text
codeforces-visualizer/
├── index.html        # Main HTML5 entry template
├── index.js          # React root mount and layout
├── header.js         # Header navigation and branding
├── Body.js           # Core visualizer component with Codeforces API logic
├── Footer.js         # Footer with links and copyright
├── CartShimmer.js    # Loading skeleton animation
├── style.css         # Responsive styling and shimmer animations
├── package.json      # Dependencies and scripts
└── README.md         # Documentation
```

---

## 💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mahendraasingh/codeforces-visualizer.git
   cd codeforces-visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   Open [http://localhost:1234](http://localhost:1234) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📡 API Endpoints Used

- `user.info`: Basic profile details, ratings, and avatars.
- `user.rating`: Rating changes and historical contest rankings.
- `user.status`: Submission history to compute unique solved problems and tag frequencies.

---

## 📝 License

This project is licensed under the MIT License.