var allJobs = {
    "frontend": {
        title: "Frontend Developer",
        company: "Google",
        salary: "\$5000",
        experience: "2 years",
        status: "Open"
    },
    "backend": {
        title: "Backend Developer",
        company: "Microsoft",
        salary: "\$10000",
        experience: "3+ years",
        status: "Closed"
    },
    "data-analyst": {
        title: "Data Analyst Developer",
        company: "Sprints",
        salary: "\$7000",
        experience: "1 year",
        status: "Open"
    },
    "ui-ux": {
        title: "UI/UX Designer",
        company: "Google",
        salary: "\$15000",
        experience: "4 years",
        status: "Open"
    },
    "full-stack": {
        title: "Full Stack Developer",
        company: "Nvidia",
        salary: "\$15000",
        experience: "5 years",
        status: "Open"
    },
    "cyber-security": {
        title: "Cyber Security Engineer",
        company: "Cyshield",
        salary: "\$20000",
        experience: "6+ years",
        status: "Open"
    }
};

// Get container
let jobsList = document.getElementById("appliedJobsList");
let emptyState = document.getElementById("emptyState");

// Load jobs when page opens
function loadAppliedJobs() {
    // Get data from localStorage
    let appliedJobs = localStorage.getItem("appliedJobs");
    
    console.log("Applied Jobs Data:", appliedJobs);
    
    // Check if empty
    if (appliedJobs === null || appliedJobs === "[]") {
        jobsList.innerHTML = "";
        emptyState.style.display = "block";
        return;
    }

    // Convert to array
    let jobs = JSON.parse(appliedJobs);
    
    console.log("Parsed Jobs:", jobs);
    
    // Clear list
    jobsList.innerHTML = "";
    
    // Loop and add each job
    for (var i = 0; i < jobs.length; i++) {
        var jobId = jobs[i];           // this is just a string like "frontend"
        var job = allJobs[jobId];      // look up the actual job details

        if (!job) {
            continue;  // skip if job not found
        }

        var html = '<div class="job-card">';
        html += '<h3>' + job.title + '</h3>';
        html += '<p><strong>Company:</strong> ' + job.company + '</p>';
        html += '<p><strong>Salary:</strong> ' + job.salary + '</p>';
        html += '<p><strong>Experience:</strong> ' + job.experience + '</p>';
        html += '<p><strong>Status:</strong> ' + job.status + '</p>';
        html += '<button class="withdraw-btn" data-id="' + jobId + '">Withdraw</button>';
        html += '</div>';

        jobsList.innerHTML += html;
    }
    
    emptyState.style.display = "none";

    attachWithdrawListeners();
}

function attachWithdrawListeners() {
    var buttons = document.getElementsByClassName("withdraw-btn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            var jobId = this.getAttribute("data-id");
            withdrawJob(jobId);
        });
    }
}

// Withdraw job
function withdrawJob(jobId) {
    if (!confirm("Are you sure you want to withdraw this application?")) {
        return;
    }

    var appliedJobs = localStorage.getItem("appliedJobs");
    var jobs = JSON.parse(appliedJobs);

    // Remove the job ID from array
    var newJobs = [];
    for (var i = 0; i < jobs.length; i++) {
        if (jobs[i] !== jobId) {
            newJobs.push(jobs[i]);
        }
    }

    localStorage.setItem("appliedJobs", JSON.stringify(newJobs));
    loadAppliedJobs();
}

// Run when page loads
loadAppliedJobs();