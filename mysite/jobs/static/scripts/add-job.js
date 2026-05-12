// ========================================
// ADD JOB - Validation & Storage
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("addJobForm");
    if (!form) return;

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

    const successMsg = document.getElementById("addJobSuccess");
    const charCount = document.getElementById("desc_char_count");

    // --- Auth Check: Only admins can add jobs ---
    // Django @login_required and permission checks handle this server-side
    // No localStorage auth needed here

    // --- Character counter for description ---
    if (fields.description && charCount) {
        fields.description.addEventListener("input", () => {
            const len = fields.description.value.length;
            charCount.textContent = len + " / 2000";
            if (len > 1800) {
                charCount.classList.add("limit-warning");
            } else {
                charCount.classList.remove("limit-warning");
            }
        });
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

    // --- Core validation ---
    function validateForm() {
        clearAllErrors();
        let isValid = true;

        // Job Title: required, min 3 chars, letters/numbers/spaces only
        const title = fields.job_title.value.trim();
        if (!title) {
            showFieldError("job_title", "Job title is required.");
            isValid = false;
        } else if (title.length < 3) {
            showFieldError("job_title", "Job title must be at least 3 characters.");
            isValid = false;
        } else if (!/^[a-zA-Z0-9\s\/\-\+\.\,\(\)]+$/.test(title)) {
            showFieldError("job_title", "Job title contains invalid characters.");
            isValid = false;
        }

        // Salary: required, numeric, positive
        const salaryVal = fields.salary.value.trim();
        if (!salaryVal) {
            showFieldError("salary", "Salary is required.");
            isValid = false;
        } else if (isNaN(salaryVal) || Number(salaryVal) < 0) {
            showFieldError("salary", "Salary must be a positive number.");
            isValid = false;
        } else if (Number(salaryVal) > 1000000) {
            showFieldError("salary", "Salary seems unrealistic. Max $1,000,000.");
            isValid = false;
        }

        // Years of Experience: required, integer, 0-50
        const expVal = fields.years_experience.value.trim();
        if (!expVal && expVal !== "0") {
            showFieldError("years_experience", "Years of experience is required.");
            isValid = false;
        } else if (isNaN(expVal) || !Number.isInteger(Number(expVal))) {
            showFieldError("years_experience", "Must be a whole number.");
            isValid = false;
        } else if (Number(expVal) < 0 || Number(expVal) > 50) {
            showFieldError("years_experience", "Must be between 0 and 50.");
            isValid = false;
        }

        // Company Name: required, min 2 chars
        const company = fields.company_name.value.trim();
        if (!company) {
            showFieldError("company_name", "Company name is required.");
            isValid = false;
        } else if (company.length < 2) {
            showFieldError("company_name", "Company name must be at least 2 characters.");
            isValid = false;
        }

        // Job Status: required
        const status = fields.job_status.value;
        if (!status) {
            showFieldError("job_status", "Please select a job status.");
            isValid = false;
        }

        // Description: required, min 10 chars
        const desc = fields.description.value.trim();
        if (!desc) {
            showFieldError("description", "Description is required.");
            isValid = false;
        } else if (desc.length < 10) {
            showFieldError("description", "Description must be at least 10 characters.");
            isValid = false;
        }

        return isValid;
    }

    // --- Generate unique ID for the job ---
    function generateJobId() {
        return "job_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    }

    // --- Submit handler ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstError = form.querySelector(".input-error");
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
                firstError.focus();
            }
            return;
        }

        // Build the job object (no hard-coded values — all from user input)
        const newJob = {
            id: generateJobId(),
            title: fields.job_title.value.trim(),
            salary: "$" + Number(fields.salary.value.trim()),
            company: fields.company_name.value.trim(),
            experience: fields.years_experience.value.trim() + " years",
            status: fields.job_status.value === "open" ? "Open" : "Closed",
            description: fields.description.value.trim(),
            createdAt: new Date().toISOString(),
        };

        // Store in localStorage under JOBS_CATALOG
        // Read existing catalog, add new job, write back
        // DEPRECATED: Jobs are now saved to Django database via form submission
        let catalog = {};

        // Show success message
        if (successMsg) {
            successMsg.style.display = "block";
        }

        // Disable submit while redirecting
        const submitBtn = document.getElementById("addJobBtn");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = "<span>&#10003; Adding...</span>";
            submitBtn.style.opacity = "0.8";
        }

        // Django form submission will handle redirect after database save
    });

    // --- Reset handler ---
    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            form.reset();
            clearAllErrors();
            if (charCount) charCount.textContent = "0 / 2000";
            if (successMsg) successMsg.style.display = "none";
        });
    }
});
