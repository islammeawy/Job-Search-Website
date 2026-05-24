const form = document.querySelector("#jobSearchForm");
const errorEl = document.getElementById("job-error");
const jobTitleEl = document.getElementById("job_title");
const charCountEl = document.getElementById("char-count");
const successEl = document.getElementById("form-success");
const locationEl = document.getElementById("location");
const salaryEl = document.getElementById("salary");
const experienceEl = document.getElementById("experience");

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
    // Updated regex to allow slashes for UI/UX
    if (!/^[a-zA-Z0-9\s\-'/]+$/.test(title)) {
        return "Job title can only contain letters, numbers, hyphens, apostrophes, and slashes";
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

// ========================================
// AJAX SEARCH FUNCTION
// ========================================
function handleSearch(event) {
    event.preventDefault();
    
    // Validate first
    if (!validateForm()) {
        jobTitleEl.focus();
        return false;
    }

    // Get form values
    const jobTitle = jobTitleEl.value.trim();
    const location = locationEl.value.trim();
    const experience = experienceEl.value;
    const salary = salaryEl.value;

    // Show loading message
    successEl.textContent = "Searching for jobs...";
    successEl.style.display = "block";

    // Build query string
    const params = new URLSearchParams();
    if (jobTitle) params.append('job_title', jobTitle);
    if (location) params.append('location', location);
    if (experience) params.append('experience', experience);
    if (salary) params.append('salary', salary);
  
    // Call backend API with AJAX
    fetch(`/search/?${params.toString()}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'  // tells backend this is AJAX
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store results in sessionStorage
            sessionStorage.setItem('searchResults', JSON.stringify(data.jobs));
            
            // Redirect to jobs page
            successEl.textContent = `Found ${data.count} job(s)! Redirecting...`;
            setTimeout(() => {
                window.location.href = '/jobs/';
            }, 500);
        } else {
            showError("Search failed. Please try again.");
        }
    })
    .catch(error => {
        console.error('Search error:', error);
        showError("Connection error. Please try again.");
    });

    return false;
}

// Character counter
jobTitleEl.addEventListener("input", debounce(function () {
    updateCharCount();
    resetError();
}, 200));

// Form submission
form.addEventListener("submit", handleSearch);

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