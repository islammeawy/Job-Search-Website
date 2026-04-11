// ========================================
// MY JOBS DASHBOARD - Admin Job Management
// ========================================

// Get current logged-in admin username
const currentAdmin = localStorage.getItem('username');

// Check if user is logged in and is admin
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    loadMyJobs();
});

// 1. Check if user is admin
function checkAdminAccess() {
    const userType = localStorage.getItem('userType');
    
    if (!currentAdmin || userType !== 'admin') {
        alert('Access Denied: Admin only');
        window.location.href = 'index.html';
        return;
    }
}

// 2. Load admin's jobs from localStorage
function loadMyJobs() {
    let jobsCatalog = localStorage.getItem('JOBS_CATALOG');
    let adminJobs = [];
    
    if (jobsCatalog) {
        try {
            const catalogData = JSON.parse(jobsCatalog);
            
            // Convert object format to array and filter by current admin
            if (typeof catalogData === 'object' && !Array.isArray(catalogData)) {
                // Object format: { jobId: {...job data...} }
                adminJobs = Object.entries(catalogData)
                    .map(([id, job]) => ({ id, ...job }))
                    .filter(job => job.postedBy === currentAdmin);
            } else if (Array.isArray(catalogData)) {
                // Array format: [...jobs...]
                adminJobs = catalogData.filter(job => job.postedBy === currentAdmin);
            }
        } catch (error) {
            console.error('Error parsing JOBS_CATALOG:', error);
            adminJobs = [];
        }
    }
    
    // Render jobs
    renderMyJobs(adminJobs);
}

// 3. Render admin's jobs dynamically
function renderMyJobs(jobs) {
    const jobsList = document.querySelector('.my-jobs-list');
    const emptyState = document.querySelector('.empty-state');
    const summaryCards = document.querySelectorAll('.summary-card .count');
    
    if (!jobsList) return;
    
    // Clear existing static jobs
    jobsList.innerHTML = '';
    
    if (jobs.length === 0) {
        // Show empty state
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    // Hide empty state
    if (emptyState) emptyState.style.display = 'none';
    
    // Count open and closed jobs
    const openJobs = jobs.filter(job => job.status === 'Open').length;
    const closedJobs = jobs.filter(job => job.status === 'Closed').length;
    
    // Update summary cards
    if (summaryCards.length >= 3) {
        summaryCards[0].textContent = jobs.length; // Total
        summaryCards[1].textContent = openJobs;    // Open
        summaryCards[2].textContent = closedJobs;  // Closed
    }
    
    // Render each job card
    jobs.forEach(job => {
        const jobCard = createJobCard(job);
        jobsList.appendChild(jobCard);
    });
}

// 4. Create a job card element
function createJobCard(job) {
    const statusClass = job.status === 'Open' ? 'open' : 'closed';
    
    const card = document.createElement('div');
    card.className = 'job-card admin-card';
    card.id = job.id;
    
    card.innerHTML = `
        <div class="job-header">
            <h2>${job.title}</h2>
            <span class="status-badge ${statusClass}">${job.status}</span>
        </div>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Salary:</strong> ${job.salary}</p>
        <p><strong>Experience Required:</strong> ${job.experience}</p>
        <p class="job-description">${job.description}</p>
        <div class="job-actions">
            <button class="btn btn-edit" data-id="${job.id}">Edit</button>
            <button class="btn btn-danger btn-delete" data-id="${job.id}">Delete</button>
        </div>
    `;
    
    // Add event listeners
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    editBtn.addEventListener('click', function() {
        editJob(job.id);
    });
    
    deleteBtn.addEventListener('click', function() {
        deleteJob(job.id);
    });
    
    return card;
}

// 5. Edit Job
function editJob(jobId) {
    // Save job ID to localStorage so edit-job.html can load it
    localStorage.setItem('editJobId', jobId);
    window.location.href = 'edit-job.html';
}

// 6. Delete Job
function deleteJob(jobId) {
    const confirmed = confirm('Are you sure you want to delete this job?');
    if (!confirmed) return;
    
    let jobsCatalog = localStorage.getItem('JOBS_CATALOG');
    if (!jobsCatalog) return;
    
    try {
        let catalogData = JSON.parse(jobsCatalog);
        
        // Handle object format
        if (typeof catalogData === 'object' && !Array.isArray(catalogData)) {
            if (catalogData[jobId]) {
                delete catalogData[jobId];
            }
        } else if (Array.isArray(catalogData)) {
            // Handle array format
            catalogData = catalogData.filter(job => job.id !== jobId);
        }
        
        // Save updated jobs
        localStorage.setItem('JOBS_CATALOG', JSON.stringify(catalogData));
        
        alert('Job deleted successfully');
        
        // Reload jobs
        loadMyJobs();
    } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job');
    }
}
