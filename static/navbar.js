async function checkLoginStatus() {
    try {
        const response = await fetch('/api/logged_in', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        const loginContainer = document.getElementById('login-container');
        if (data.logged_in) {
            // If logged in, show Logout option
            loginContainer.innerHTML = `
                <a href="/logout" class="login-link">
                    <img src="../static/Pictures/Account-icon.png" alt="Account Icon" class="login-image">
                    <span class="login-text"><u>Logout</u></span>
                </a>
            `;
        } else {
            // If not logged in, show Login option
            loginContainer.innerHTML = `
                <a href="/login" class="login-link">
                    <img src="../static/Pictures/Account-icon.png" alt="Account Icon" class="login-image">
                    <span class="login-text"><u>Login</u></span>
                </a>
            `;
        }
    } catch (error) {
        console.error('Error fetching login status:', error);
    }

}

function checkIfAdmin(classItem) {
    const adminNav = document.getElementById('admin-nav');
    const memberNav = document.getElementById('member-nav');

fetch('/api/isAdmin')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.isAdmin) {
            console.log("User is  an admin");
            adminNav.style.display = 'block'; // Show admin navigation
            memberNav.style.display = 'none'; // Hide member navigation
        } else {
            console.log("User is  an admin");
            memberNav.style.display = 'block'; // Show member navigation
            adminNav.style.display = 'none'; // Hide admin navigation
        }
    })
    .catch(error => {
        console.error("Error checking admin status:", error);
    });
}
// Call this function on page load
document.addEventListener('DOMContentLoaded', checkIfAdmin);
  // Call this function on page load
  document.addEventListener('DOMContentLoaded', checkLoginStatus);
  // Recheck login status when going back in history (browser back button)
  window.addEventListener('popstate', checkLoginStatus);