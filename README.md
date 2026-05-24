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


Base URL: `http://localhost:8000`

---

## GET /api

Returns a welcome message and the configured GitHub username.

**Example Response:**
```json
{
    "message": "Welcome to the GitHub API Proxy Server!",
    "user": "Jossman68"
}
```

---

## GET /api/repos

Returns all repositories sorted by most recently updated.

**Example Response:**
```json
{
  "repos": [
    {
      "id": 27,
      "name": "CPD_Project",
      "description": "COMP4060 CPD Project displaying github activity",
      "language": "JavaScript",
      "stars": 0,
      "forks": 0,
      "updated_at": "2026-05-24T11:42:07Z",
      "url": "https://github.com/Jossman68/CPD_Project"
    },
    {
      "id": 26,
      "name": "calc_week9",
      "description": null,
      "language": null,
      "stars": 0,
      "forks": 0,
      "updated_at": "2026-05-07T03:22:08Z",
      "url": "https://github.com/Jossman68/calc_week9"
    },
    {
      "id": 25,
      "name": "AssignmentCOMP3010",
      "description": null,
      "language": "Python",
      "stars": 0,
      "forks": 0,
      "updated_at": "2026-04-18T17:01:49Z",
      "url": "https://github.com/Jossman68/AssignmentCOMP3010"
    }
  ]
}
```

---

## GET /api/repos/languages

Returns number of languages used across all repositories.

**Example Response:**
```json
{
  "languages": {
    "Python": 26266,
    "JavaScript": 13688,
    "CSS": 2040,
    "HTML": 850
  }
}
```

---

## GET /api/repos/activity

Returns the 10 most recent GitHub events.

**Example Response:**
```json
{
  "events": [
    {
      "id": 241,
      "type": "PushEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-24T11:42:04Z"
    },
    {
      "id": 242,
      "type": "PushEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T13:20:39Z"
    },
    {
      "id": 243,
      "type": "PushEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T13:19:24Z"
    },
    {
      "id": 244,
      "type": "PushEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T13:12:00Z"
    },
    {
      "id": 245,
      "type": "PullRequestEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T13:11:58Z"
    },
    {
      "id": 246,
      "type": "PullRequestEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T13:11:49Z"
    },
    {
      "id": 247,
      "type": "PushEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T13:11:16Z"
    },
    {
      "id": 248,
      "type": "PushEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T12:11:02Z"
    },
    {
      "id": 249,
      "type": "PullRequestEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T12:11:01Z"
    },
    {
      "id": 250,
      "type": "PullRequestEvent",
      "repo": "Jossman68/CPD_Project",
      "created_at": "2026-05-21T12:10:51Z"
    }
  ]
}
```


## Running Tests

```bash
npm test
```

