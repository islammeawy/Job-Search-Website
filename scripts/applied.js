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
    for (let i = 0; i < jobs.length; i++) {
        let job = jobs[i];
        
        let html = '<div class="job-card">';
        html += '<h3>' + job.title + '</h3>';
        html += '<p><strong>Company:</strong> ' + job.company + '</p>';
        html += '<p><strong>Salary:</strong> ' + job.salary + '</p>';
        html += '<p><strong>Experience:</strong> ' + job.experience + '</p>';
        html += '<p><strong>Applied Date:</strong> ' + job.appliedDate + '</p>';
        html += '<button onclick="withdrawJob(\'' + job.id + '\')">Withdraw</button>';
        html += '</div>';
        
        jobsList.innerHTML += html;
    }
    
    emptyState.style.display = "none";
}

// Withdraw job
function withdrawJob(jobId) {
    if (confirm("Remove this application?")) {
        let appliedJobs = localStorage.getItem("appliedJobs");
        let jobs = JSON.parse(appliedJobs);
        
        // Remove job
        let newJobs = jobs.filter(job => job.id !== jobId);
        
        // Save
        localStorage.setItem("appliedJobs", JSON.stringify(newJobs));
        
        // Reload
        loadAppliedJobs();
    }
}

// Run when page loads
loadAppliedJobs();