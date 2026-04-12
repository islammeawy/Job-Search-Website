
var jobsData = {
    "frontend": {
        title: "Frontend Developer",
        company: "Google",
        salary: 5000,
        experience: "2",
        type: "full-time",
        location: "remote",
        status: "Open"
    },
    "backend": {
        title: "Backend Developer",
        company: "Microsoft",
        salary: 10000,
        experience: "3",
        type: "full-time",
        location: "new york",
        status: "Closed"
    },
    "data-analyst": {
        title: "Data Analyst Developer",
        company: "Sprints",
        salary: 7000,
        experience: "1",
        type: "full-time",
        location: "remote",
        status: "Open"
    },
    "ui-ux": {
        title: "UI/UX Designer",
        company: "Google",
        salary: 15000,
        experience: "4",
        type: "full-time",
        location: "california",
        status: "Open"
    },
    "full-stack": {
        title: "Full Stack Developer",
        company: "Nvidia",
        salary: 15000,
        experience: "5",
        type: "full-time",
        location: "california",
        status: "Open"
    },
    "cyber-security": {
        title: "Cyber Security Engineer",
        company: "Cyshield",
        salary: 20000,
        experience: "6",
        type: "full-time",
        location: "remote",
        status: "Open"
    }
};


// ========================================
// READ SEARCH PARAMETERS FROM URL
// ========================================
function getSearchParams() {
    // This reads the ?job_title=...&location=... from the URL
    var params = new URLSearchParams(window.location.search);

    return {
        jobTitle: params.get("job_title") ? params.get("job_title").trim().toLowerCase() : "",
        location: params.get("location") ? params.get("location").trim().toLowerCase() : "",
        jobTypes: params.getAll("job_type"),   // array of checked values
        experience: params.get("experience") || "",
        salary: params.get("salary") ? parseInt(params.get("salary")) : 0
    };
}


// ========================================
// CHECK IF A JOB MATCHES THE SEARCH
// ========================================
function jobMatchesSearch(job, search) {

    // 1. Check job title - does the job title CONTAIN what the user typed?
    if (search.jobTitle !== "") {
        var titleMatch = job.title.toLowerCase().includes(search.jobTitle);
        if (!titleMatch) {
            return false; // title doesn't match, skip this job
        }
    }

    // 2. Check location
    if (search.location !== "") {
        var locationMatch = job.location.toLowerCase().includes(search.location);
        if (!locationMatch) {
            return false;
        }
    }

    // 3. Check job type (checkboxes - at least one must match)
    if (search.jobTypes.length > 0) {
        var typeMatch = false;
        for (var i = 0; i < search.jobTypes.length; i++) {
            if (search.jobTypes[i] === "remote" && job.location === "remote") {
                typeMatch = true;
            }
            if (search.jobTypes[i] === job.type) {
                typeMatch = true;
            }
        }
        if (!typeMatch) {
            return false;
        }
    }

    // 4. Check experience
    if (search.experience !== "") {
        var jobExp = parseInt(job.experience);

        if (search.experience === "0-1" && jobExp > 1) {
            return false;
        }
        if (search.experience === "2-4" && (jobExp < 2 || jobExp > 4)) {
            return false;
        }
        if (search.experience === "5+" && jobExp < 5) {
            return false;
        }
    }

    // 5. Check minimum salary
    if (search.salary > 0) {
        if (job.salary < search.salary) {
            return false;
        }
    }

    // If we got here, the job matches all filters!
    return true;
}


// ========================================
// FILTER AND SHOW/HIDE JOB CARDS
// ========================================
function filterJobs() {
    var search = getSearchParams();

    // Check if user came from search (has any search params)
    var hasSearchParams = search.jobTitle !== "" || search.location !== "" ||
        search.jobTypes.length > 0 || search.experience !== "" || search.salary > 0;

    // If no search params, show all jobs (normal visit to jobs.html)
    if (!hasSearchParams) {
        return;
    }

    // Get all job cards on the page
    var jobCards = document.querySelectorAll(".job-det");
    var matchCount = 0;

    for (var i = 0; i < jobCards.length; i++) {
        var card = jobCards[i];
        var jobId = card.id;
        var job = jobsData[jobId];

        // If we don't have data for this job, hide it
        if (!job) {
            card.style.display = "none";
            continue;
        }

        // Check if this job matches the search
        if (jobMatchesSearch(job, search)) {
            card.style.display = "";  // show it
            matchCount++;
        } else {
            card.style.display = "none";  // hide it
        }
    }

    // Update the heading to show search results info
    var heading = document.getElementById("Av-Jobs");
    if (heading) {
        if (matchCount === 0) {
            heading.textContent = "No jobs found matching your search";
        } else {
            heading.textContent = matchCount + " Job" + (matchCount > 1 ? "s" : "") + " Found";
        }
    }
}

// ========================================
// LOAD JOBS FROM LOCALSTORAGE INTO THE PAGE
// ========================================
function renderJobsFromCatalog() {
    let catalog = {};
    try {
        const raw = localStorage.getItem("JOBS_CATALOG");
        if (raw) catalog = JSON.parse(raw);
    } catch (err) {
        catalog = {};
    }

    const jobsContainer = document.querySelector(".Job-List");
    if (!jobsContainer) return;

    Object.entries(catalog).forEach(([id, job]) => {
        // Avoid duplicates if card already exists in HTML
        if (document.getElementById(id)) return;

                // Add to jobsData so search filtering works for this job too
        jobsData[id] = {
            title: job.title || "",
            company: job.company || "",
            salary: parseInt(job.salary) || 0,
            experience: job.experience ? job.experience.replace(/[^0-9]/g, "") : "0",
            type: job.type || "full-time",
            location: job.location || "",
            status: job.status || "Open"
        };7410

        const card = document.createElement("article");
        card.className = "job-det";
        card.id = id;

        card.innerHTML = `
            <h2>${job.title}</h2>
            <p>Company: ${job.company}</p>
            <p>Salary: ${job.salary}</p>
            <p>Experience: ${job.experience}</p>
            <p class="status">Status: ${job.status}</p>
            <a href="job-details.html" class="view-details">View Details</a>
            <button class="apply-btn">Apply</button>
        `;

        jobsContainer.appendChild(card);
    });

    // Re-attach listeners so new cards are interactive
    attachJobListeners();

    // Filter jobs if user came from search page
    filterJobs();
}


// ========================================
// VIEW DETAILS & APPLY LISTENERS
// ========================================
function attachJobListeners() {

    // --- View Details ---
    let detailsLinks = document.getElementsByClassName("view-details");

    for (var i = 0; i < detailsLinks.length; i++) {
        // Remove old listener by cloning the element
        let oldLink = detailsLinks[i];
        let newLink = oldLink.cloneNode(true);
        oldLink.parentNode.replaceChild(newLink, oldLink);
    }

    // Re-fetch after cloning
    detailsLinks = document.getElementsByClassName("view-details");
    for (var i = 0; i < detailsLinks.length; i++) {
        detailsLinks[i].addEventListener("click", function (event) {
            event.preventDefault();

            let jobCard = this.closest(".job-det");
            let jobId = jobCard.id;

            localStorage.setItem("selectedJob", jobId);
            window.location.href = "job-details.html";
        });
    }

    // --- Apply Button ---
    let applyBtns = document.getElementsByClassName("apply-btn");

    for (var x = 0; x < applyBtns.length; x++) {
        let oldBtn = applyBtns[x];
        let newBtn = oldBtn.cloneNode(true);
        oldBtn.parentNode.replaceChild(newBtn, oldBtn);
    }

    // Re-fetch after cloning
    applyBtns = document.getElementsByClassName("apply-btn");
    for (var x = 0; x < applyBtns.length; x++) {
        applyBtns[x].addEventListener("click", function (event) {
            
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem("username");
            if (!isLoggedIn) {
                alert("Please log in to apply for jobs");
                window.location.href = "login.html";
                return;
            }

            // Check if user is admin
            const userType = localStorage.getItem("userType");
            if (userType === "admin") {
                alert("Admins cannot apply for jobs");
                return;
            }

            let jobCard = this.closest(".job-det");
            let jobId = jobCard.id;
            let statusElement = jobCard.querySelector(".status");
            let statusText = statusElement.textContent;

            if (statusText.includes("Closed")) {
                alert("This job is closed at the moment, try again later");
                return;
            } else if (statusText.includes("Open")) {
                let appliedJobs = localStorage.getItem("appliedJobs");

                if (appliedJobs === null) {
                    appliedJobs = [];
                } else {
                    appliedJobs = JSON.parse(appliedJobs);
                }

                if (appliedJobs.includes(jobId)) {
                    alert("You already applied for this job");
                    return;
                }

                appliedJobs.push(jobId);
                localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
                alert("Applied successfully");
            }
        });
    }
}


// ========================================
// INIT
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    renderJobsFromCatalog(); // Loads saved jobs + attaches all listeners
});