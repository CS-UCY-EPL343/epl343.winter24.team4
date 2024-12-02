document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.menu ul li');
    const contentBoxes = document.querySelectorAll('.content-box');
  
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
  
        // Hide all content boxes
        contentBoxes.forEach(box => box.classList.add('hidden'));
  
        // Add active class to the clicked tab
        tab.classList.add('active');
  
        // Show the corresponding content box
        const targetId = tab.id.replace('-tab', '');
        document.getElementById(targetId).classList.remove('hidden');
      });
    });
  });

  
  document.addEventListener("DOMContentLoaded", () => {
    const passwordForm = document.querySelector("#change-password form");
    const newPassword = document.querySelector("#new-password");
    const confirmPassword = document.querySelector("#confirm-password");
    const errorMessage = document.createElement("p");
  
    // Style the error message
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "14px";
    errorMessage.style.marginTop = "10px";
    errorMessage.classList.add("error-message");
  
    // Add event listener to the form
    passwordForm.addEventListener("submit", (event) => {
      // Remove any existing error messages
      const existingError = document.querySelector(".error-message");
      if (existingError) {
        existingError.remove();
      }
  
      // Check if passwords match
      if (newPassword.value !== confirmPassword.value) {
        event.preventDefault(); // Prevent form submission
        errorMessage.textContent = "Passwords do not match. Please try again.";
        passwordForm.appendChild(errorMessage); // Add the error message to the form
      }
    });
  });
  