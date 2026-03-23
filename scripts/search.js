const form = document.querySelector("form");

form.addEventListener("submit", function (e) {
    const jobTitleEl = document.getElementById("job_title");
    const title = jobTitleEl.value.trim();

    if (!title) {
        e.preventDefault();
        alert("Please enter a job title");
    }
    else if (!/^[a-zA-Z\s]+$/.test(title)) {
        e.preventDefault();
        alert("Job title can only contain letters");
    }
});