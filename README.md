# CPD_Project
For my CPD project in COMP4060 at MQ university I decided to try build a full stack web application thaat would display my Github account activity. This dashboard displays for now three categories, current repos, languages used and recent activity.

# Elements Used
- Backened:Node.js, Express
- Database: SQLite
- Frontend: HTML, CSS, JavaScript
- Testing: Vitest, Supertest
- CI/CD: GitHub Actions
- API used: GitHub REST API

## Setup

1. Clone the repository
```bash
   git clone https://github.com/Jossman68/CPD_Project.git
   cd CPD_Project
```

2. Install dependencies
```bash
   npm install
```

3. Create a `.env` file in the project root
   Add these variables
```bash
  - GITHUB_TOKEN=your_github_personal_access_token
  - GITHUB_USERNAME=your_github_username
```

5. Start the server
```bash
   node server.js
```

5. Open `http://localhost:8000` in your browser

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Welcome message and username |
| `/api/repos` | GET | List of repositories with details |
| `/api/repos/languages` | GET | Aggregated language byte counts |
| `/api/repos/activity` | GET | 10 most recent GitHub events |

## Running Tests

```bash
npm test
```

