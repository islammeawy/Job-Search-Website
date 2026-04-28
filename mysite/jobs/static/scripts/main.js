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
    if (!grid || !window.JOBS_CATALOG) return;

    const FEATURED_LIMIT = 4;
    const openJobs = Object.entries(window.JOBS_CATALOG).filter(
        ([, job]) => job.status === "Open"
    );
    const featured = openJobs.slice(0, FEATURED_LIMIT);

    grid.innerHTML = "";

    if (!featured.length) {
        grid.innerHTML =
            '<p class="featured-empty">No open jobs to feature right now. <a href="jobs.html">Browse all jobs</a>.</p>';
        return;
    }

    featured.forEach(([id, job]) => {
        const card = document.createElement("div");
        card.className = "job-card";

        const title = document.createElement("h3");
        title.textContent = job.title;

        const company = document.createElement("span");
        company.className = "company";
        company.textContent = "Company: " + job.company;

        const salary = document.createElement("span");
        salary.className = "salary";
        salary.textContent = job.salary;

        const experience = document.createElement("span");
        experience.className = "experience";
        experience.textContent = job.experience + " experience";

        const link = document.createElement("a");
        // For now, create a placeholder - we'll update this when jobs are fetched from Django
        link.href = "#";
        link.className = "btn";
        link.textContent = "View Details";
        link.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.setItem("selectedJob", id);
            // In a real Django integration, this would fetch the job ID from the database
            // For now, using localStorage-based ID
            window.location.href = window.DJANGO_URLS.job_details + id + '/';
        });

        card.appendChild(title);
        card.appendChild(company);
        card.appendChild(salary);
        card.appendChild(experience);
        card.appendChild(link);
        grid.appendChild(card);
    });
}

// ========================================
// BROWSE BY EXPERIENCE (Dynamic Job Counts)
// ========================================
function renderExperienceSection() {
    const experienceContainer = document.querySelector('.experience-categories');
    if (!experienceContainer) return;

    // Get all jobs (hardcoded + admin-added)
    let allJobs = [...Object.values(window.JOBS_CATALOG)];
    
    // Also load jobs from localStorage JOBS_CATALOG (admin-added jobs)
    let adminJobs = localStorage.getItem('JOBS_CATALOG');
    if (adminJobs) {
        try {
            const catalogData = JSON.parse(adminJobs);
            if (typeof catalogData === 'object' && !Array.isArray(catalogData)) {
                allJobs = allJobs.concat(Object.values(catalogData));
            } else if (Array.isArray(catalogData)) {
                allJobs = allJobs.concat(catalogData);
            }
        } catch (error) {
            console.error('Error loading admin jobs:', error);
        }
    }

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

// 1. User Data Management
const userData = {
    username: localStorage.getItem('username') || null,
    userType: localStorage.getItem('userType') || null, // 'user' or 'admin'
    isLoggedIn: !!localStorage.getItem('username')
};

// 2. Build Dynamic Navigation Links
function buildNavLinks() {
    if (!userData.isLoggedIn) {
        // NOT LOGGED IN: Show Home, Jobs, Search, Login, Sign Up
        return [
            { text: 'Home', href: window.DJANGO_URLS.home, isButton: false },
            { text: 'Jobs', href: window.DJANGO_URLS.jobs, isButton: false },
            { text: 'Search', href: window.DJANGO_URLS.search, isButton: false },
            { text: 'Login', href: window.DJANGO_URLS.login, isButton: true, buttonClass: 'btn-primary' },
            { text: 'Sign Up', href: window.DJANGO_URLS.signup, isButton: true, buttonClass: 'btn-secondary' }
        ];
    } else if (userData.userType === 'user') {
        // USER LOGGED IN: Show Home, Jobs, Search, Applied Jobs, Logout
        return [
            { text: 'Home', href: window.DJANGO_URLS.home, isButton: false },
            { text: 'Jobs', href: window.DJANGO_URLS.jobs, isButton: false },
            { text: 'Search', href: window.DJANGO_URLS.search, isButton: false },
            { text: 'Applied Jobs', href: window.DJANGO_URLS.applied, isButton: false },
            { text: 'Logout', href: '#', isButton: true, buttonClass: 'btn-primary', action: 'logout' }
        ];
    } else if (userData.userType === 'admin') {
        // ADMIN LOGGED IN: Show Home, My Jobs, Add Job, Logout
        return [
            { text: 'Home', href: window.DJANGO_URLS.home, isButton: false },
            { text: 'My Jobs', href: window.DJANGO_URLS.my_jobs, isButton: false },
            { text: 'Add Job', href: window.DJANGO_URLS.add_job, isButton: false },
            { text: 'Logout', href: '#', isButton: true, buttonClass: 'btn-primary', action: 'logout' }
        ];
    }
}

// 3. Render Dynamic Navigation
function renderNavigation() {
    const navLinksContainer = document.querySelector('.nav-links');
    const authContainer = document.querySelector('.nav-actions');
    
    if (!navLinksContainer || !authContainer) {
        console.warn('Navigation containers not found in DOM (.nav-links or .nav-actions missing)');
        return;
    }

    const links = buildNavLinks();
    
    // Clear existing nav links completely
    navLinksContainer.innerHTML = '';
    
    // Clear auth container
    authContainer.innerHTML = '';
    
    // Separate links and buttons
    const navItems = links.filter(link => !link.isButton);
    const authButtons = links.filter(link => link.isButton);
    
    // Add all nav items to navbar (Home, Jobs, Search, etc.)
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        li.appendChild(a);
        navLinksContainer.appendChild(li);
    });
    
    // Add auth buttons to right side
    authButtons.forEach(item => {
        const a = document.createElement('a');
        a.href = item.href;
        
        const button = document.createElement('button');
        button.textContent = item.text;
        
        if (item.action === 'logout') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        a.appendChild(button);
        authContainer.appendChild(a);
    });
    
    // Highlight current page
    highlightCurrentPage();
}

// 4. Highlight Current Page
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#007BFF';
            link.style.borderBottom = '2px solid #007BFF';
            link.style.paddingBottom = '5px';
        }
    });
}

// 5. Logout Function (clear session only — keep registeredUser / appliedJobs)
function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userType');
    userData.isLoggedIn = false;
    userData.username = null;
    userData.userType = null;
    alert('Logged out successfully!');
    window.location.href = window.DJANGO_URLS.home;
}

// 6. Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    renderNavigation();
    renderFeaturedJobs();
    renderExperienceSection();
});

