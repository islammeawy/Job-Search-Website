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