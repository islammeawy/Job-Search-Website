// ========================================
// DYNAMIC NAVBAR MANAGEMENT
// ========================================

// 1. User Data Management
const userData = {
    username: localStorage.getItem('username') || null,
    userType: localStorage.getItem('userType') || null, // 'user' or 'admin'
    isLoggedIn: !!localStorage.getItem('username')
};

// 2. Build Dynamic Navigation Links
function buildNavLinks() {
    if (!userData.isLoggedIn) {
        // NOT LOGGED IN: Show Home, Jobs, Search, Login, Sign Up
        return [
            { text: 'Home', href: 'index.html', isButton: false },
            { text: 'Jobs', href: 'jobs.html', isButton: false },
            { text: 'Search', href: 'search.html', isButton: false },
            { text: 'Login', href: 'login.html', isButton: true, buttonClass: 'btn-primary' },
            { text: 'Sign Up', href: 'signup.html', isButton: true, buttonClass: 'btn-secondary' }
        ];
    } else if (userData.userType === 'user') {
        // USER LOGGED IN: Show Home, Jobs, Search, Applied Jobs, Logout
        return [
            { text: 'Home', href: 'index.html', isButton: false },
            { text: 'Jobs', href: 'jobs.html', isButton: false },
            { text: 'Search', href: 'search.html', isButton: false },
            { text: 'Applied Jobs', href: 'applied.html', isButton: false },
            { text: 'Logout', href: '#', isButton: true, buttonClass: 'btn-primary', action: 'logout' }
        ];
    } else if (userData.userType === 'admin') {
        // ADMIN LOGGED IN: Show Home, My Jobs, Add Job, Logout
        return [
            { text: 'Home', href: 'index.html', isButton: false },
            { text: 'My Jobs', href: 'my-jobs.html', isButton: false },
            { text: 'Add Job', href: 'add-job.html', isButton: false },
            { text: 'Logout', href: '#', isButton: true, buttonClass: 'btn-primary', action: 'logout' }
        ];
    }
}

// 3. Render Dynamic Navigation
function renderNavigation() {
    const navLinksContainer = document.querySelector('.nav-links');
    const authContainer = document.querySelector('.nav-actions');
    
    if (!navLinksContainer || !authContainer) {
        console.warn('Navigation containers not found in DOM (.nav-links or .nav-actions missing)');
        return;
    }

    const links = buildNavLinks();
    
    // Clear existing nav links completely
    navLinksContainer.innerHTML = '';
    
    // Clear auth container
    authContainer.innerHTML = '';
    
    // Separate links and buttons
    const navItems = links.filter(link => !link.isButton);
    const authButtons = links.filter(link => link.isButton);
    
    // Add all nav items to navbar (Home, Jobs, Search, etc.)
    navItems.forEach(item => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.href;
        a.textContent = item.text;
        li.appendChild(a);
        navLinksContainer.appendChild(li);
    });
    
    // Add auth buttons to right side
    authButtons.forEach(item => {
        const a = document.createElement('a');
        a.href = item.href;
        
        const button = document.createElement('button');
        button.textContent = item.text;
        
        if (item.action === 'logout') {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
        
        a.appendChild(button);
        authContainer.appendChild(a);
    });
    
    // Highlight current page
    highlightCurrentPage();
}

// 4. Highlight Current Page
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#007BFF';
            link.style.borderBottom = '2px solid #007BFF';
            link.style.paddingBottom = '5px';
        }
    });
}

// 5. Logout Function
function logout() {
    localStorage.clear();
    userData.isLoggedIn = false;
    userData.username = null;
    userData.userType = null;
    alert('Logged out successfully!');
    window.location.href = 'index.html';
}

// 6. Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Rendering Navigation');
    console.log('User Data:', userData);
    renderNavigation();
    console.log('Navigation rendered');
});

