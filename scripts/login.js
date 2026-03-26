document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener("submit", (e) => {
        const usernameInput = document.getElementById("username").value.trim();
        const passwordInput = document.getElementById("password").value;
        // Basic Validation
        if (!usernameInput || !passwordInput) {
            e.preventDefault();
            alert("Please fill in all fields.");
            return;
        }
        // Requirement: System should store/check values
        // We retrieve the "stored" user from signup to verify
        const storedUser = JSON.parse(localStorage.getItem("registeredUser"));
        if (!storedUser) {
            e.preventDefault();
            alert("No registered users found. Please sign up first.");
            return;
        }
        if (usernameInput === storedUser.username && passwordInput === storedUser.password) {
            alert(`Welcome back, ${storedUser.fullname}!`);
            // In a real app, you'd redirect: window.location.href = "index.html";
        } else {
            e.preventDefault();
            alert("Invalid username or password.");
        }
    });
});