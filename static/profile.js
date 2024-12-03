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
    const passwordErrorBox = document.querySelector("#passwordErrorBox");
    const passwordErrorList = document.querySelector("#passwordErrorList");

    // Function to validate password criteria
    function validatePassword(password) {
        const errors = [];

        if (password.length < 8) {
            errors.push("Password must be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Password must contain at least one special character.");
        }

        return errors;
    }

    // Add event listener to the form
    passwordForm.addEventListener("submit", (event) => {
        passwordErrorBox.style.display = "none"; // Hide error box initially
        passwordErrorList.innerHTML = ""; // Clear any existing errors

        const passwordErrors = validatePassword(newPassword.value);

        // If there are validation errors
        if (passwordErrors.length > 0) {
            event.preventDefault(); // Prevent form submission
            passwordErrorBox.style.display = "block"; // Show error box

            // Add each error to the error list
            passwordErrors.forEach((error) => {
                const listItem = document.createElement("li");
                listItem.textContent = error;
                passwordErrorList.appendChild(listItem);
            });

            return; // Exit early
        }

        // Check if passwords match
        if (newPassword.value !== confirmPassword.value) {
            event.preventDefault(); // Prevent form submission
            const mismatchError = document.createElement("li");
            mismatchError.textContent = "Passwords do not match. Please try again.";
            passwordErrorList.appendChild(mismatchError);
            passwordErrorBox.style.display = "block"; // Show error box
        }
    });
});


  
function profileInfo() {
    const apiUrl = '/getProfile';

    return fetch(`${apiUrl}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            getInfo(data);
        })
        .catch(error => {
            console.error('Error fetching week classes:', error);
        });
}


function getInfo(data) {
    // Ensure the data structure matches your API response
    document.getElementById('fname').innerHTML = `<strong>First Name:</strong> ${data[0].FName }`;
    document.getElementById('lname').innerHTML = `<strong>Last Name:</strong> ${data[0].Lname}`;
    document.getElementById('email').innerHTML = `<strong>Email:</strong> ${data[0].Email}`;
    document.getElementById('birthday').innerHTML = `<strong>Birthday:</strong> ${data[0].Birthday }`;
    document.getElementById('phone').innerHTML = `<strong>Phone:</strong> ${data[0].Phone}`;
}

