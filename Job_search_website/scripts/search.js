const form = document.querySelector("form");
const errorEl = document.getElementById("job-error");
const jobTitleEl = document.getElementById("job_title");


function resetError() {
    errorEl.textContent = "";
    errorEl.style.display = "none";
    jobTitleEl.classList.remove("input-error");
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
    jobTitleEl.classList.add("input-error");
}

form.addEventListener("submit", function (e) {
    
    const title = jobTitleEl.value.trim();

    resetError();
    
    if (!title) {
        e.preventDefault();
        showError("Please enter a job title");
    }
    else if (!/^[a-zA-Z\s]+$/.test(title)) {
        e.preventDefault();
        showError("Job title can only contain letters");
    }
});


jobTitleEl.addEventListener("input", function () {
    resetError();
});

window.addEventListener("pageshow", function () {
    form.reset();
    resetError();
});