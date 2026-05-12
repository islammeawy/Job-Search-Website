window.JOBS_CATALOG = {
    frontend: {
        title: "Frontend Developer",
        company: "Google",
        salary: "$5000",
        experience: "2 years",
        status: "Open",
        description:
            "We are looking for a frontend developer with strong HTML, CSS, and JavaScript skills.",
    },
    backend: {
        title: "Backend Developer",
        company: "Microsoft",
        salary: "$10000",
        experience: "3+ years",
        status: "Closed",
        description:
            "We are looking for a Backend Developer to build and maintain the server side of our website. The job includes working with databases, creating APIs, and making sure the website works fast and securely.",
    },
    "data-analyst": {
        title: "Data Analyst Developer",
        company: "Sprints",
        salary: "$7000",
        experience: "1 year",
        status: "Open",
        description:
            "The Data Analyst collects and studies data to help the company make better decisions. They organize information, find patterns in the data, and create reports.",
    },
    "ui-ux": {
        title: "UI/UX Designer",
        company: "Google",
        salary: "$15000",
        experience: "4 years",
        status: "Open",
        description:
            "The UI/UX Designer creates easy and attractive designs for websites and apps. They focus on making the interface simple, clear, and enjoyable for users.",
    },
    "full-stack": {
        title: "Full Stack Developer",
        company: "Nvidia",
        salary: "$15000",
        experience: "5 years",
        status: "Open",
        description:
            "The Full Stack Developer works on both the front end and back end of a website. They build user interfaces, manage servers and databases, and make sure the whole application works correctly.",
    },
    "cyber-security": {
        title: "Cyber Security Engineer",
        company: "Cyshield",
        salary: "$20000",
        experience: "6+ years",
        status: "Open",
        description:
            "The Cybersecurity Engineer protects the company's systems and data from cyber attacks. They monitor security, find vulnerabilities, and make sure the network and applications are safe.",
    },
};

// ========================================
// FEATURED JOBS (index.html)
// ========================================
function renderFeaturedJobs() {
    const grid = document.querySelector(".featured-jobs-grid");
    if (!grid) return;
    
    // Featured jobs are now rendered server-side in index.html template
    // This function is kept for reference but no longer needed
    return;
}

// ========================================
// BROWSE BY EXPERIENCE (Dynamic Job Counts)
// ========================================
function renderExperienceSection() {
    const experienceContainer = document.querySelector('.experience-categories');
    if (!experienceContainer) return;

    // Get all jobs from hardcoded JOBS_CATALOG (sample data only)
    // Database jobs are rendered server-side in templates
    let allJobs = Object.values(window.JOBS_CATALOG || {});

    // Define experience levels with their criteria
    const experienceLevels = [
        {
            title: 'Entry Level',
            subtitle: '0-2 years experience',
            image: 'images/enty-level-IT_1500x680.jfif',
            filter: (job) => {
                const exp = parseInt(job.experience) || 0;
                return exp >= 0 && exp <= 2;
            }
        },
        {
            title: 'Mid Level',
            subtitle: '2-5 years experience',
            image: 'images/mid level.jpg',
            filter: (job) => {
                const exp = parseInt(job.experience) || 0;
                return exp >= 2 && exp <= 5;
            }
        },
        {
            title: 'Senior Level',
            subtitle: '5+ years experience',
            image: 'images/senior.webp',
            filter: (job) => {
                const exp = parseInt(job.experience) || 0;
                return exp >= 5;
            }
        },
        {
            title: 'Executive',
            subtitle: '10+ years experience',
            image: 'images/excecutive.jpg',
            filter: (job) => {
                const exp = parseInt(job.experience) || 0;
                return exp >= 10;
            }
        }
    ];

    // Clear existing cards
    experienceContainer.innerHTML = '';

    // Create cards for each experience level
    experienceLevels.forEach(level => {
        // Count jobs for this level
        const count = allJobs.filter(level.filter).length;

        const card = document.createElement('div');
        card.className = 'experience-card';

        card.innerHTML = `
            <img src="${level.image}" alt="${level.title} Jobs">
            <h3>${level.title}</h3>
            <p>${level.subtitle}</p>
            <p class="job-count">${count}+ Jobs</p>
            <a href="${window.DJANGO_URLS.search}" class="btn">Browse Jobs</a>
        `;

        experienceContainer.appendChild(card);
    });
}

// ========================================
// DYNAMIC NAVBAR MANAGEMENT
// ========================================
// Note: Navbar is now rendered server-side by Django templates (base.html)
// Django template context provides user authentication state
// No localStorage user data needed - use window.DJANGO_USER from template instead

// 6. Initialize Page
document.addEventListener('DOMContentLoaded', function () {
    renderNavigation();
    renderFeaturedJobs();
    renderExperienceSection();
});

