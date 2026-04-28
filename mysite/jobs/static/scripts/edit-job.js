// ========================================
// EDIT JOB - Load, Validate & Update
// ========================================
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("editJobForm");
    if (!form) return;

    // --- Auth Guard: Only admins can edit jobs ---
    if (!localStorage.getItem("username")) {
        window.location.href = "login.html";
        return;
    }
    if (localStorage.getItem("userType") !== "admin") {
        const noPermBanner = document.createElement("div");
        noPermBanner.className = "error-banner";
        noPermBanner.style.display = "block";
        noPermBanner.innerHTML =
            "&#9888; You do not have permission to edit jobs. " +
            "<a href='jobs.html'>Browse Jobs</a> or " +
            "<a href='index.html'>Go Home</a>.";
        form.parentNode.insertBefore(noPermBanner, form);
        form.style.display = "none";
        return;
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

    const successMsg = document.getElementById("editJobSuccess");
    const notFoundMsg = document.getElementById("editJobNotFound");
    const charCount = document.getElementById("desc_char_count");

    // --- Get the job ID to edit from localStorage ---
    const editJobId = localStorage.getItem("editJobId");

    // --- Load job data into form ---
    function loadJobData() {
        if (!editJobId) {
            showNotFound();
            return false;
        }

        // Try the localStorage JOBS_CATALOG first
        let catalog = {};
        try {
            const raw = localStorage.getItem("JOBS_CATALOG");
            if (raw) catalog = JSON.parse(raw);
        } catch (err) {
            catalog = {};
        }

        let job = catalog[editJobId];

        // Fall back to the hard-coded JOBS_CATALOG on window (from main.js)
        if (!job && window.JOBS_CATALOG && window.JOBS_CATALOG[editJobId]) {
            job = window.JOBS_CATALOG[editJobId];
        }

        if (!job) {
            showNotFound();
            return false;
        }

        // Populate fields from stored data (no hard-coded values)
        fields.job_title.value = job.title || "";

        // Parse salary — remove $ and any commas
        const salaryNum = String(job.salary || "").replace(/[\$,]/g, "").trim();
        fields.salary.value = salaryNum || "";

        // Parse experience — extract number from "X years" or "X+ years"
        const expMatch = String(job.experience || "").match(/(\d+)/);
        fields.years_experience.value = expMatch ? expMatch[1] : "";

        fields.company_name.value = job.company || "";

        // Set status dropdown
        const statusLower = String(job.status || "").toLowerCase();
        if (statusLower === "open" || statusLower === "closed") {
            fields.job_status.value = statusLower;
        }

        fields.description.value = job.description || "";

        // Update char count
        if (charCount) {
            charCount.textContent = (job.description || "").length + " / 2000";
        }

        return true;
    }

    function showNotFound() {
        if (notFoundMsg) notFoundMsg.style.display = "block";
        form.style.display = "none";
    }

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

    // --- Core validation (same rules as add-job) ---
    function validateForm() {
        clearAllErrors();
        let isValid = true;

        // Job Title: required, min 3 chars
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

    // --- Submit handler ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!validateForm()) {
            const firstError = form.querySelector(".input-error");
            if (firstError) {
                firstError.scrollIntoView({ behavior: "smooth", block: "center" });
                firstError.focus();
            }
            return;
        }

        // Build updated job object (preserve original createdAt / postedBy if present)
        let existingEntry = {};
        try {
            const raw = localStorage.getItem("JOBS_CATALOG");
            if (raw) {
                const parsed = JSON.parse(raw);
                existingEntry = parsed[editJobId] || {};
            }
        } catch (_) {}

        const updatedJob = {
            title: fields.job_title.value.trim(),
            salary: "$" + Number(fields.salary.value.trim()),
            company: fields.company_name.value.trim(),
            experience: fields.years_experience.value.trim() + " years",
            status: fields.job_status.value === "open" ? "Open" : "Closed",
            description: fields.description.value.trim(),
            createdAt: existingEntry.createdAt || new Date().toISOString(),
            postedBy: existingEntry.postedBy || localStorage.getItem("username") || "admin",
            updatedAt: new Date().toISOString(),
        };

        // Update in localStorage JOBS_CATALOG
        let catalog = {};
        try {
            const raw = localStorage.getItem("JOBS_CATALOG");
            if (raw) catalog = JSON.parse(raw);
        } catch (err) {
            catalog = {};
        }

        catalog[editJobId] = updatedJob;
        localStorage.setItem("JOBS_CATALOG", JSON.stringify(catalog));

        // Also update window.JOBS_CATALOG if it exists (for in-session consistency)
        if (window.JOBS_CATALOG) {
            window.JOBS_CATALOG[editJobId] = updatedJob;
        }

        // Show success message
        if (successMsg) {
            successMsg.style.display = "block";
        }

        // Disable submit while redirecting
        const submitBtn = document.getElementById("updateJobBtn");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = "<span>&#10003; Saving...</span>";
            submitBtn.style.opacity = "0.8";
        }

        // Clean up and redirect
        setTimeout(() => {
            localStorage.removeItem("editJobId");
            window.location.href = "my-jobs.html";
        }, 1500);
    });

    // --- Initialize: load job data ---
    loadJobData();
});
