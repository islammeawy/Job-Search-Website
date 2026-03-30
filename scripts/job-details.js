let selectedJob = localStorage.getItem("selectedJob");

let jobs = {
    "frontend": {
        title: "Frontend Developer",
        company: "Google",
        salary: "$5000",
        experience: "2 years",
        status: "Open",
        description: "We are looking for a frontend developer with strong HTML, CSS, and JavaScript skills."
    },

    "backend": {
        title: "Backend Developer",
        company: "Microsoft",
        salary: "$10000",
        experience: "3+ years",
        status: "Closed",
        description: "We are looking for a Backend Developer to build and maintain the server side of our website. The job includes working with databases, creating APIs, and making sure the website works fast and securely."
    },

    "data-analyst": {
        title: "Data Analyst Developer",
        company: "Sprints",
        salary: "$7000",
        experience: "1 year",
        status: "Open",
        description: "The Data Analyst collects and studies data to help the company make better decisions. They organize information, find patterns in the data, and create reports."
    },

    "ui-ux": {
        title: "UI/UX Designer",
        company: "Google",
        salary: "$15000",
        experience: "4 years",
        status: "Open",
        description: "The UI/UX Designer creates easy and attractive designs for websites and apps. They focus on making the interface simple, clear, and enjoyable for users."
    },

    "full-stack": {
        title: "Full Stack Developer",
        company: "Nvidia",
        salary: "$15000",
        experience: "5 years",
        status: "Open",
        description: "The Full Stack Developer works on both the front end and back end of a website. They build user interfaces, manage servers and databases, and make sure the whole application works correctly."
    },

    "cyber-security": {
        title: "Cyber Security Engineer",
        company: "Cyshield",
        salary: "$20000",
        experience: "6+ years",
        status: "Open",
        description: "The Cybersecurity Engineer protects the company's systems and data from cyber attacks. They monitor security, find vulnerabilities, and make sure the network and applications are safe."
    }
};

let job = jobs[selectedJob];

if (job) {
    document.getElementById("job-title").textContent = job.title;
    document.getElementById("job-company").textContent = "Company: " + job.company;
    document.getElementById("job-salary").textContent = "Salary: " + job.salary;
    document.getElementById("job-experience").textContent = "Experience: " + job.experience;
    document.getElementById("job-status").textContent = "Status: " + job.status;
    document.getElementById("job-description").textContent = job.description;
} else {
    document.getElementById("job-container").innerHTML = "<h2>Job not found</h2><a href='jobs.html'>Back to Jobs</a>";
}

let applyBtn = document.getElementById("apply-btn");

applyBtn.addEventListener("click", function () {
    if (!job) {
        alert("No job selected");
        return;
    }

    if (job.status === "Closed") {
        alert("This job is closed at the moment, try again later");
        return;
    }

    let appliedJobs = localStorage.getItem("appliedJobs");

    if (appliedJobs === null) {
        appliedJobs = [];
    } else {
        appliedJobs = JSON.parse(appliedJobs);
    }

    if (appliedJobs.includes(selectedJob)) {
        alert("You already applied for this job");
        return;
    }

    appliedJobs.push(selectedJob);
    localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

    alert("Applied successfully");
});