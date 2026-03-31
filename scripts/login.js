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
            
            const raw = localStorage.getItem("registeredUser");
            if (!raw) {
                alert("No registered users found. Please sign up first.");
                return;
            }

            let storedUser;
            try {
                storedUser = JSON.parse(raw);
            } catch {
                alert("Saved account data is damaged. Please sign up again.");
                return;
            }

            if (!storedUser || !storedUser.username) {
                alert("No registered users found. Please sign up first.");
                return;
            }

            const storedUserNorm = String(storedUser.username).trim();
            const storedPass = String(storedUser.password ?? "");
            if (usernameInput === storedUserNorm && passwordInput === storedPass) {
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