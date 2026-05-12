// ========================================
// EDIT JOB - Client-side validation only  
// ========================================
// Note: Form submission is handled by Django
// Django validates, checks ownership, and saves to database

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editJobForm");
    if (!form) return;

    // Set job ID from form data attribute (Django template provides this)
    const editJobId = form.getAttribute('data-job-id');
    if (!editJobId) {
        console.warn('Job ID not found in form data-job-id attribute');
    }

    // --- DOM References ---
    const fields = {
        job_title: document.getElementById("job_title"),
        salary: document.getElementById("salary"),
        years_experience: document.getElementById("years_experience"),
        company_name: document.getElementById("company_name"),
        job_status: document.getElementById("job_status"),
        description: document.getElementById("description"),
    };

    const errors = {
        job_title: document.getElementById("job_title_error"),
        salary: document.getElementById("salary_error"),
        years_experience: document.getElementById("years_experience_error"),
        company_name: document.getElementById("company_name_error"),
        job_status: document.getElementById("job_status_error"),
        description: document.getElementById("description_error"),
    };

    const charCount = document.getElementById("desc_char_count");

    // --- Character counter for description ---
    if (fields.description && charCount) {
        const updateCharCount = () => {
            const len = fields.description.value.length;
            charCount.textContent = len + " / 2000";
            if (len > 1800) {
                charCount.classList.add("limit-warning");
            } else {
                charCount.classList.remove("limit-warning");
            }
        };

        fields.description.addEventListener("input", updateCharCount);
        updateCharCount(); // Initialize
    }

    // --- Real-time validation: clear error on input ---
    Object.keys(fields).forEach((key) => {
        const el = fields[key];
        if (!el) return;
        const eventType = el.tagName === "SELECT" ? "change" : "input";
        el.addEventListener(eventType, () => {
            clearFieldError(key);
        });
    });

    // --- Validation helpers ---
    function showFieldError(fieldName, message) {
        if (errors[fieldName]) {
            errors[fieldName].textContent = message;
            errors[fieldName].style.display = "block";
        }
        if (fields[fieldName]) {
            fields[fieldName].classList.add("input-error");
        }
    }

    function clearFieldError(fieldName) {
        if (errors[fieldName]) {
            errors[fieldName].textContent = "";
            errors[fieldName].style.display = "none";
        }
        if (fields[fieldName]) {
            fields[fieldName].classList.remove("input-error");
        }
    }

    function clearAllErrors() {
        Object.keys(fields).forEach((key) => clearFieldError(key));
    }

    // --- Form submission: Django backend handles validation and persistence ---
    form.addEventListener("submit", (e) => {
        // Django will validate on the server side
        // Frontend validation is optional but nice for UX
        console.log('Edit job form submitted to Django endpoint');
    });

    // --- Reset handler ---
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            form.reset();
            clearAllErrors();
            if (charCount) charCount.textContent = "0 / 2000";
        });
    }
});
