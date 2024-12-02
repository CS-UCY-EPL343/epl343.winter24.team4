document.addEventListener('DOMContentLoaded', () => {
    // Select elements for week navigation and week display
    const weekDatesElement = document.getElementById('week-dates');
    const prevWeekButton = document.querySelector('.prev-week');
    const nextWeekButton = document.querySelector('.next-week');

    // Helper function to calculate the start of the current week
    function getStartOfWeek(date) {
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Monday as the first day
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() + diff);
        return startOfWeek;
    }

    // Helper function to format date range
    function formatDateRange(startDate) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Calculate the end of the week
        return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
    }

    // Determine the initial week start date (current week)
    let currentStartDate = getStartOfWeek(new Date()); // Use today's date to determine the week

    // Update the week display
    function updateWeekDisplay() {
        weekDatesElement.textContent = formatDateRange(currentStartDate);

        // Update each day's header dynamically
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const allDays = document.querySelectorAll('.day');
        allDays.forEach((dayElement, index) => {
            const dayDate = new Date(currentStartDate);
            dayDate.setDate(currentStartDate.getDate() + index); // Calculate each day's date

            // Format date without the year
            const formattedDate = dayDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const dayLabel = `${daysOfWeek[index]} ${formattedDate.split('/').slice(0, 2).join('/')}`; // Remove the year

            dayElement.querySelector('span').textContent = dayLabel; // Update day header
        });
    }

    // Event listeners for week navigation
    prevWeekButton.addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() - 7); // Move to previous week
        updateWeekDisplay();
    });

    nextWeekButton.addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() + 7); // Move to next week
        updateWeekDisplay();
    });

    // Initialize week display
    updateWeekDisplay();

    // Function to dynamically adjust dropdown height
    function adjustDropdownHeight(dropdown) {
        if (dropdown.classList.contains('show')) {
            dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
        } else {
            dropdown.style.maxHeight = "0"; // Reset height when hidden
        }
    }

    // Add dropdown functionality for each arrow
    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.addEventListener('click', function () {
            const day = this.parentElement; // Reference to the .day element
            const dropdown = day.querySelector('.dropdown-content');
            const allDropdowns = document.querySelectorAll('.dropdown-content');
            const allArrows = document.querySelectorAll('.arrow');

            // Close all dropdowns and reset all arrows
            allDropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('show');
                    d.style.maxHeight = "0"; // Reset height
                }
            });

            allArrows.forEach(a => {
                if (a !== this) a.classList.remove('rotate');
            });

            // Toggle the current dropdown, arrow, and active day
            dropdown.classList.toggle('show');
            this.classList.toggle('rotate');

            // Dynamically adjust the dropdown height
            adjustDropdownHeight(dropdown);
        });
    });

    // Add Class Functionality for Each Day
    const addClassButtons = document.querySelectorAll('.add-class');

    function handleAddClass(day) {
        // Create an inline form
        const form = document.createElement('form');
        form.classList.add('add-class-form');
        form.innerHTML = `
            <input type="text" placeholder="Class Hours (e.g., 10:00 - 11:00)" required class="class-hours">
            <input type="text" placeholder="Description" required class="class-description">
            <input type="text" placeholder="Class Type (e.g., Yoga)" required class="class-type">
            <button type="submit">Add</button>
            <button type="button" class="cancel">Cancel</button>
        `;

        // Append the form to the specific day's class container
        const container = document.getElementById(`${day}-classes`);
        container.appendChild(form);

        // Handle form submission
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent form from refreshing the page

            // Get the input values
            const hours = form.querySelector('.class-hours').value;
            const description = form.querySelector('.class-description').value;
            const type = form.querySelector('.class-type').value;

            // Create a new class element
            const classItem = document.createElement('div');
            classItem.classList.add('class-item');
            classItem.innerHTML = `
                <strong>${hours}</strong>
                <p>${description}</p>
                <span>${type}</span>
                <button class="remove-class">Remove</button>
            `;

            // Add a remove button handler
            classItem.querySelector('.remove-class').addEventListener('click', () => {
                classItem.remove();
                adjustDropdownHeight(container.closest('.dropdown-content')); // Adjust dropdown height
            });

            // Append the new class to the container
            container.appendChild(classItem);

            // Remove the form after submission
            form.remove();
            adjustDropdownHeight(container.closest('.dropdown-content')); // Adjust dropdown height
        });

        // Handle cancel button
        form.querySelector('.cancel').addEventListener('click', () => {
            form.remove();
            adjustDropdownHeight(container.closest('.dropdown-content')); // Adjust dropdown height
        });

        // Adjust dropdown height dynamically
        adjustDropdownHeight(container.closest('.dropdown-content'));
    }

    // Add event listeners to all "Add Class" buttons
    addClassButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const day = button.dataset.day; // Get the day from the data attribute
            handleAddClass(day);
        });
    });
});
