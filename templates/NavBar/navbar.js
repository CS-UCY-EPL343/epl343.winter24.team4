function loadNavbar() {
    const navbarContainer = document.getElementById('navbar');
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navbarContainer.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the navbar:', error);
            navbarContainer.innerHTML = '<p>Error loading navbar.</p>';
        });
}