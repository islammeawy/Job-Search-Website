
function displayAppliedJobs() {
    const jobsList = document.getElementById("appliedJobsList");
    const emptyState = document.getElementById("emptyState");

    // Fetch applied jobs from backend
    fetch('/api/applied-jobs/')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.applications.length > 0) {
                jobsList.innerHTML = "";
                emptyState.style.display = "none";

                // Display each application
                data.applications.forEach(app => {
                    const card = document.createElement("div");
                    card.className = "job-card";
                    card.id = `app-${app.id}`;

                    card.innerHTML = `
                        <h3>${app.job.title}</h3>
                        <p><strong>Company:</strong> ${app.job.company_name}</p>
                        <p><strong>Salary:</strong> ${app.job.salary}</p>
                        <p><strong>Experience Required:</strong> ${app.job.years_of_experience} years</p>
                        <p><strong>Applied On:</strong> ${new Date(app.applied_at).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${app.job.status}</p>
                        <button class="withdraw-btn" data-app-id="${app.id}">Withdraw Application</button>
                    `;

                    jobsList.appendChild(card);
                });

                // Attach withdraw listeners
                attachWithdrawListeners();
            } else {
                // No applications
                jobsList.innerHTML = "";
                emptyState.style.display = "block";
            }
        })
        .catch(error => {
            console.error('Error loading applications:', error);
            emptyState.style.display = "block";
        });
}

// ATTACH WITHDRAW BUTTON LISTENERS

function attachWithdrawListeners() {
    const buttons = document.getElementsByClassName("withdraw-btn");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            const appId = this.getAttribute("data-app-id");
            withdrawApplication(appId);
        });
    }
}

// WITHDRAW AN APPLICATION

function withdrawApplication(appId) {
    if (!confirm("Are you sure you want to withdraw this application?")) {
        return;
    }

    fetch(`/api/applications/${appId}/withdraw/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Application withdrawn successfully");
            displayAppliedJobs();  // Refresh the list
        } else {
            alert(data.message || "Could not withdraw application");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again.");
    });
}


// GET CSRF TOKEN FROM COOKIES

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Load when page opens
document.addEventListener("DOMContentLoaded", function () {
    displayAppliedJobs();
});