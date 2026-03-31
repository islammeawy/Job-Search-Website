document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById("username").value.trim();
            const passwordInput = document.getElementById("password").value;
            
            // Basic Validation
            if (!usernameInput || !passwordInput) {
                alert("Please fill in all fields.");
                return;
            }
            
            // Retrieve the stored user from signup
            const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
            
            if (!storedUser) {
                alert("No registered users found. Please sign up first.");
                return;
            }
            
            // Check if credentials match
            if (usernameInput === storedUser.username && passwordInput === storedUser.password) {
                // Save login info to localStorage
                localStorage.setItem("username", storedUser.username);
                localStorage.setItem("userType", storedUser.userType || "user"); // Default to 'user'
                
                alert(`Welcome back, ${storedUser.fullname}!`);
                window.location.href = "index.html";
            } else {
                alert("Invalid username or password.");
            }
        });
    }
});