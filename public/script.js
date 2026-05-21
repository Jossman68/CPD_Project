// Fetch user data from the server
async function loadRepo() {
    console.log("Loading repositories...");
    const repoSection = document.getElementById("repos");

    try {
        const response = await fetch("/api/repos");
        const data = await response.json();

        let repoHTML = '<h2>Repositories</h2>';

        data.repos.forEach(repo => {
            repoHTML += `
                <div class="repo-card">
                    <a class="repo-name" href="${repo.url}" target="_blank">${repo.name}</a>
                    <p class="repo-description">${repo.description || "No description"}</p>
                    <span class="repo-meta">
                        Language: ${repo.language || "N/A"}
                        Updated ${repo.updated_at}
                    </span>
                </div>
            `;
        });

        repoSection.innerHTML = repoHTML;

        // Process the fetched data
        console.log("Fetched repositories:", data.repos);
    } catch (error) {
        repoSection.innerHTML = '<h2>Repositories</h2><p>Failed to load repositories</p>';
        console.error("Error fetching repository data:", error);
    }
}

loadRepo();

async function loadContributions() {
    const activitySection = document.getElementById('contributions');

    try {
        const response = await fetch('/api/repos/activity');
        const data = await response.json();

        let activityHTML = '<h2>Recent Contributions</h2>';

        data.events.forEach(event => {
            // Clean up event type: "PushEvent" becomes "Push"
            const type = event.type.replace('Event', '');

            activityHTML += `
                <div class="event-item">
                    <span class="event-type">${type}</span>
                    on <span class="event-repo">${event.repo}</span>
                </div>
            `;
        });

        activitySection.innerHTML = activityHTML;

    } catch (error) {
        activitySection.innerHTML = '<h2>Recent Contributions</h2><p>Failed to load contributions</p>';
        console.error('Error:', error);
    }
}

loadContributions();

