let detailsLinks = document.getElementsByClassName("view-details");

for (var i = 0; i < detailsLinks.length; i++) {
    detailsLinks[i].addEventListener("click", function(event) {

        // Stop normal link behavior
        event.preventDefault();

        // Get parent job card
        let jobCard = this.closest(".job-det");

        // Get job id
        let jobId = jobCard.id;

        // Save it in localStorage
        localStorage.setItem("selectedJob", jobId);

        //  Go to details page
        window.location.href = "job-details.html";
    });
}

let applybtn = document.getElementsByClassName("apply-btn");

for (var x = 0; x < applybtn.length; x++) {
    applybtn[x].addEventListener("click", function(event) {

        // CHECK IF USER IS LOGGED IN
        const isLoggedIn = localStorage.getItem("username");
        if (!isLoggedIn) {
            alert("Please log in to apply for jobs");
            window.location.href = "login.html";
            return;
        }

        let jobCard = this.closest(".job-det");

        let jobId = jobCard.id;

        // get status element inside the card
        let statusElement = jobCard.querySelector(".status");

        // get the text
        let statusText = statusElement.textContent;

        // check if closed
        if (statusText.includes("Closed")) {
            alert("This job is closed at the moment, try again later");
            return;
        }
        else if (statusText.includes("Open")){
            let appliedJobs = localStorage.getItem("appliedJobs");

            if (appliedJobs === null) {
                appliedJobs = [];
            } else {
                appliedJobs = JSON.parse(appliedJobs);
            }

            if (appliedJobs.includes(jobId)) {
                alert("You already applied for this job");
                return;
            }

            appliedJobs.push(jobId);

            localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));

            alert("Applied successfully");
        }
        

        
    });
}