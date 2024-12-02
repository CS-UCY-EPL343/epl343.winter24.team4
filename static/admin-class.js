document.addEventListener('DOMContentLoaded', () => {
    const weekDatesElement = document.getElementById('week-dates');
    const prevWeekButton = document.querySelector('.prev-week');
    const nextWeekButton = document.querySelector('.next-week');

    function getStartOfWeek(date) {
        const dayOfWeek = date.getDay();
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() + diff);
        return startOfWeek;
    }

    function formatDateRange(startDate) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const start = new Date(startDate);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
    }

    let currentStartDate = getStartOfWeek(new Date());

    function updateWeekDisplay() {
        weekDatesElement.textContent = formatDateRange(currentStartDate);
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const allDays = document.querySelectorAll('.day');
        allDays.forEach((dayElement, index) => {
            const dayDate = new Date(currentStartDate);
            dayDate.setDate(currentStartDate.getDate() + index);
            const formattedDate = dayDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const dayLabel = `${daysOfWeek[index]} ${formattedDate.split('/').slice(0, 2).join('/')}`;
            dayElement.querySelector('span').textContent = dayLabel;
        });
    }

    prevWeekButton.addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() - 7);
        updateWeekDisplay();
    });

    nextWeekButton.addEventListener('click', () => {
        currentStartDate.setDate(currentStartDate.getDate() + 7);
        updateWeekDisplay();
    });

    updateWeekDisplay();

    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.addEventListener('click', function () {
            const day = this.parentElement;
            const dropdown = day.querySelector('.dropdown-content');

            // Toggle the current dropdown independently
            dropdown.classList.toggle('show');
            this.classList.toggle('rotate');
            day.classList.toggle('active');

            adjustDropdownHeight(dropdown);
        });
    });

    const addClassButtons = document.querySelectorAll('.add-class');

    function handleAddClass(day) {
        const form = document.createElement('form');
        form.classList.add('add-class-form');
        form.innerHTML = `
            <input type="text" placeholder="Class Hours (e.g., 10:00 - 11:00)" required class="class-hours">
            <input type="text" placeholder="Description" required class="class-description">
            <input type="text" placeholder="Class Type (e.g., Yoga)" required class="class-type">
            <input type="number" placeholder="Capacity (e.g., 20)" required class="class-capacity">
            <button type="submit">Add</button>
            <button type="button" class="cancel">Cancel</button>
        `;

        const container = document.getElementById(`${day}-classes`);
        container.appendChild(form);

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const hours = form.querySelector('.class-hours').value;
            const description = form.querySelector('.class-description').value;
            const type = form.querySelector('.class-type').value;
            const capacity = form.querySelector('.class-capacity').value;

            const classItem = document.createElement('div');
            classItem.classList.add('class-item');
            const studentListId = `student-list-${Date.now()}`; // Unique ID for the student list
            classItem.innerHTML = `
                <p>Hours: ${hours}</p>
                <p>Description: ${description}</p>
                <p>Class Type: ${type}</p>
                <p>Capacity: ${capacity}</p>
                <button class="remove-class">Remove</button>
                <button class="view-students" data-student-list="${studentListId}">View Students</button>
                <div id="${studentListId}" class="student-list" style="display: none;">
                    <!-- Student list specific to this class -->
                </div>
            `;

            // Remove button logic
            classItem.querySelector('.remove-class').addEventListener('click', () => {
                classItem.remove();
                adjustDropdownHeight(container.closest('.dropdown-content'));
            });

            // View Students button logic
            classItem.querySelector('.view-students').addEventListener('click', (event) => {
                const studentListId = event.target.getAttribute('data-student-list');
                const studentList = document.getElementById(studentListId);

                // Show modal
                const modal = document.getElementById('view-students-modal');
                modal.style.display = 'block';

                // Attach current student list to modal
                const modalStudentList = document.getElementById('student-list');
                modalStudentList.innerHTML = studentList.innerHTML;

                // Add student button logic in modal
                const addStudentButton = document.getElementById('add-student');
                addStudentButton.onclick = () => {
                    const studentName = prompt("Enter the student's name:");
                    if (studentName) {
                        const studentItem = document.createElement('p');
                        studentItem.textContent = studentName;
                        studentList.appendChild(studentItem); // Add to the specific student list
                        modalStudentList.appendChild(studentItem.cloneNode(true)); // Sync with modal
                    }
                };
            });

            container.appendChild(classItem);
            form.remove();
            adjustDropdownHeight(container.closest('.dropdown-content'));
        });

        form.querySelector('.cancel').addEventListener('click', () => {
            form.remove();
            adjustDropdownHeight(container.closest('.dropdown-content'));
        });

        adjustDropdownHeight(container.closest('.dropdown-content'));
    }

    function adjustDropdownHeight(dropdown) {
        if (dropdown.classList.contains('show')) {
            dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
        } else {
            dropdown.style.maxHeight = "0";
        }
    }

    addClassButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const day = button.dataset.day;
            handleAddClass(day);
        });
    });

    // Modal close logic
    const modal = document.getElementById('view-students-modal');
    const closeModal = modal.querySelector('.close');

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none'; // Hide the modal
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    });
});
