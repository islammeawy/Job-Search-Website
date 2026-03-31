const form = document.querySelector("#jobSearchForm");
const errorEl = document.getElementById("job-error");
const jobTitleEl = document.getElementById("job_title");
const charCountEl = document.getElementById("char-count");
const successEl = document.getElementById("form-success");
const locationEl = document.getElementById("location");
const salaryEl = document.getElementById("salary");

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

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

function updateCharCount() {
    const length = jobTitleEl.value.length;
    charCountEl.textContent = `${length}/100`;
    charCountEl.classList.toggle("limit-warning", length > 80);
}

function validateJobTitle(title) {
    if (!title) {
        return "Please enter a job title";
    }
    if (title.length < 2) {
        return "Job title must be at least 2 characters";
    }
    if (title.length > 100) {
        return "Job title cannot exceed 100 characters";
    }
    // Regex validation
    if (!/^[a-zA-Z0-9\s\-']+$/.test(title)) {
        return "Job title can only contain letters, numbers, hyphens, and apostrophes";
    }
    return null;
}

function validateForm() {
    resetError();
    
    const title = jobTitleEl.value.trim();
    const error = validateJobTitle(title);
    
    if (error) {
        showError(error);
        return false;
    }

    if (salaryEl.value && parseInt(salaryEl.value) < 0) {
        salaryEl.classList.add("input-error");
        return false;
    }

    return true;
}

// Character counter
jobTitleEl.addEventListener("input", debounce(function () {
    updateCharCount();
    resetError();
}, 200));

// Form submission
form.addEventListener("submit", function (e) {
    if (!validateForm()) {
        e.preventDefault();
        jobTitleEl.focus();
    } else {
        // Show success feedback
        successEl.textContent = "Searching for jobs...";
        successEl.style.display = "block";
    }
});

// Reset form
form.addEventListener("reset", function () {
    resetError();
    updateCharCount();
    successEl.textContent = "";
    successEl.style.display = "none";
    salaryEl.classList.remove("input-error");
});

// Page restoration
window.addEventListener("pageshow", function () {
    if (form.dataset.resetOnPageshow !== "false") {
        form.reset();
        resetError();
        updateCharCount();
    }
});