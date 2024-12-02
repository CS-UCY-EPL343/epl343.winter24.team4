document.addEventListener('DOMContentLoaded', () => {
    const passwordField = document.getElementById('Password');
    const confirmPasswordField = document.getElementById('ConfirmPassword');
    const passwordErrorBox = document.getElementById('passwordErrorBox');
    const passwordErrorList = document.getElementById('passwordErrorList');
    const passwordMatchError = document.getElementById('passwordMatchError');
    const submitButton = document.getElementById('submitButton');

    // Function to validate password criteria
    function validatePassword() {
        const password = passwordField.value;
        const confirmPassword = confirmPasswordField.value;

        // Reset error list
        passwordErrorList.innerHTML = "";

        // Criteria
        const criteria = [
            { regex: /[a-z]/, message: "At least one lowercase letter" },
            { regex: /[A-Z]/, message: "At least one uppercase letter" },
            { regex: /\W/, message: "At least one special character" },
            { regex: /.{8,}/, message: "At least 8 characters long" }
        ];

        let validCriteria = true;

        criteria.forEach(({ regex, message }) => {
            if (!regex.test(password)) {
                validCriteria = false;
                const li = document.createElement("li");
                li.textContent = message;
                passwordErrorList.appendChild(li);
            }
        });

        // Check if passwords match
        if (password !== confirmPassword) {
            passwordMatchError.textContent = "Passwords must match.";
            submitButton.disabled = true;
        } else {
            passwordMatchError.textContent = ""; // Clear match error
        }

        // Show or hide the error box for criteria
        if (!validCriteria) {
            passwordErrorBox.style.display = "block";
            submitButton.disabled = true;
        } else {
            passwordErrorBox.style.display = "none";
        }

        // Enable submit button if all conditions are met
        if (validCriteria && password === confirmPassword) {
            submitButton.disabled = false;
        }
    }

    // Add event listeners to validate passwords in real-time
    passwordField.addEventListener('input', validatePassword);
    confirmPasswordField.addEventListener('input', validatePassword);
});
