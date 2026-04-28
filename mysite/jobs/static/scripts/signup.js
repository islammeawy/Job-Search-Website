document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.querySelector('form');
    const userTypeRadios = document.querySelectorAll('input[name="user_type"]');
    const companyFields = document.getElementById('companyFields');
    // 1. Toggle Company Fields
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            companyFields.style.display = (radio.value === 'company') ? 'block' : 'none';
            // Reset company inputs if switched back to seeker
            if (radio.value === 'seeker') {
                document.getElementById('company_name').value = "";
            }
        });
    });
    // 2. Form Validation
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;
        const userType = document.querySelector('input[name="user_type"]:checked').value;
        const companyName = document.getElementById("company_name").value.trim();
        // Check if Passwords Match
        if (password !== confirmPassword) {
            alert("Error: Passwords do not match!");
            return;
        }
        // Check Company Name if User Type is Company
        if (userType === 'company' && !companyName) {
            alert("Error: Please enter your Company Name.");
            return;
        }
    // 3. Storing Values (Requirement: No hard-coded values)
    // We simulate a database by saving the user object to LocalStorage
    const userData = {
        fullname: document.getElementById("fullname").value.trim(),
        email: document.getElementById("email").value.trim(),
        username: document.getElementById("username").value.trim(),
        password: password,
        userType: userType === 'company' ? 'admin' : 'user', // Convert to 'admin' or 'user'
        company: companyName || "N/A"
    };
    localStorage.setItem("registeredUser", JSON.stringify(userData));
    alert("Registration Successful! Redirecting to login...");
    window.location.href = "login.html";
    });
});