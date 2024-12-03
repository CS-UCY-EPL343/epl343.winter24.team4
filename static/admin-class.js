document.addEventListener('DOMContentLoaded', () => {
    const prevWeekButton = document.querySelector('.prev-week');
    const nextWeekButton = document.querySelector('.next-week');

    const monday = getStartOfWeek();
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate()+6);

    const formattedMonday = formatDate(monday);
    const formattedSunday = formatDate(sunday);

    thisWeekClasses(formattedMonday, formattedSunday)
            .then(data => {
                console.log('Classes this week:', data);


            })
            .catch(error => {
                console.error('Error fetching classes:', error);
            });

    updateWeekDisplay(monday);

    prevWeekButton.addEventListener('click', () => {
        clearClassBoxes();
        getLastWeekFromCurrent(monday);
        monday.setDate(monday.getDate()-7);
    });

    nextWeekButton.addEventListener('click', () => {
        clearClassBoxes();
        getNextWeekFromCurrent(monday);
        monday.setDate(monday.getDate()+7);
    });

    document.querySelectorAll('.arrow').forEach(arrow => {
        arrow.addEventListener('click', function () {
            const day = this.parentElement;
            const dropdown = day.querySelector('.dropdown-content');

            dropdown.classList.toggle('show');
            this.classList.toggle('rotate');
            day.classList.toggle('active');

            adjustDropdownHeight(dropdown);
        });
    });

    const addClassButtons = document.querySelectorAll('.add-class');

    addClassButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const day = button.dataset.day;
            handleAddClass(day);
        });
    });

    const modal = document.getElementById('view-students-modal');
    const closeModal = modal.querySelector('.close');

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function clearClassBoxes() {
    const classBoxes = document.querySelectorAll('.class-item');
    classBoxes.forEach(box => box.remove());
}

function thisWeekClasses(startDate, endDate) {
    const apiUrl = '/admin/admin-class';

    console.log(startDate);
    console.log(endDate);

    return fetch(`${apiUrl}?start_date=${startDate}&end_date=${endDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            populateClasses(data);
        })
        .catch(error => {
            console.error('Error fetching week classes:', error);
        });
}

function removeClass(classId){
    const data = { class_id: classId };
    const apiUrl = '/api/admin/class/removeClass';
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        else
        {
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error deleting enrollment in class:', error);

    });
}

function populateClasses(data) {
    document.querySelectorAll('.day .class-item').forEach(item => item.remove());
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    data.classes.forEach(classInfo => {
        const classDay = new Date(classInfo.Date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        const dayContainer = document.getElementById(`${days[classDay.getDay()]}-classes`);

        const classItem = document.createElement('div');
        classItem.classList.add('class-item');

        const studentListId = `student-list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        classItem.innerHTML = `
            <p>Hours: ${classInfo.Time_start} - ${classInfo.Time_end}</p>
            <p>Class Type: ${classInfo.Exercise_Type}</p>
            <p>Capacity: ${classInfo.Remaining_Capacity}/${classInfo.Max_capacity}</p>
            <button class="remove-class">Remove</button>
            <button class="view-students" data-student-list="${studentListId}">View Students</button>
            <div id="${studentListId}" class="student-list" style="display: none;"></div>
        `;

        // Hide the remove button if the class date has passed
        const removeButton = classItem.querySelector('.remove-class');
        if (classDay < today) {
            removeButton.style.display = 'none';
        } else {
            removeButton.addEventListener('click', () => {
                classItem.remove();
                adjustDropdownHeight(dayContainer.closest('.dropdown-content'));
            });
        }

        removeButton.addEventListener("click", function () {
            alert(`You have successfully removed the class "${classItem.Name}"!`);
            removeClass(classItem.Class_ID);
        });


        classItem.querySelector('.view-students').addEventListener('click', (event) => {
            const studentList = document.getElementById(event.target.getAttribute('data-student-list'));
            const modal = document.getElementById('view-students-modal');
            modal.style.display = 'block';

            const modalStudentList = document.getElementById('student-list');
            modalStudentList.innerHTML = studentList.innerHTML;

            modalStudentList.querySelectorAll('.remove-student').forEach(button => {
                button.addEventListener('click', () => {
                    const studentElement = button.parentElement;
                    studentElement.remove();
                    const matchingStudent = [...studentList.children].find(child => child.textContent.trim() === studentElement.textContent.trim());
                    if (matchingStudent) matchingStudent.remove();
                });
            });
        });

        dayContainer.appendChild(classItem);
    });
}


function getStartOfWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    return startOfWeek;
}

function formatDateRange(startDate) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-GB', options)} - ${end.toLocaleDateString('en-GB', options)}`;
}

function formatDate(date){
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
}

function getNextWeekFromCurrent(currentMonday) {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    updateWeekDisplay(nextMonday);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextSunday.getDate() + 6);

    populateWeekDates(new Date(nextMonday));

    formattedMonday = formatDate(nextMonday);
    formattedSunday = formatDate(nextSunday);
    console.log(formattedMonday);
    console.log(formattedSunday);

    clearClassBoxes();
    data = thisWeekClasses(formattedMonday, formattedSunday);
}

function getLastWeekFromCurrent(currentMonday) {

    const lastMonday = new Date(currentMonday);
    lastMonday.setDate(lastMonday.getDate() - 7);

    updateWeekDisplay(lastMonday);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    populateWeekDates(new Date(lastMonday));

    formattedMonday = formatDate(lastMonday);
    formattedSunday = formatDate(lastSunday);

    clearClassBoxes();
    thisWeekClasses(formattedMonday, formattedSunday);
}

function updateWeekDisplay(monday) {
    const weekDatesElement = document.getElementById('week-dates');
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    weekDatesElement.textContent = formatDateRange(monday);
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const allDays = document.querySelectorAll('.day');
    populateWeekDates(monday);
    allDays.forEach((dayElement, index) => {
        const dayDate = new Date(monday);
        dayDate.setDate(monday.getDate() + index);
        const formattedDate = dayDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const dayLabel = `${daysOfWeek[index]} ${formattedDate.split('/').slice(0, 2).join('/')}`;
        dayElement.querySelector('span').textContent = dayLabel;
    });
}

function populateWeekDates(startOfWeek) {
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const allDays = document.querySelectorAll('.day');

    allDays.forEach((dayElement, index) => {
        const dayDate = new Date(startOfWeek);
        dayDate.setDate(startOfWeek.getDate() + index);

        // Format the date for display (e.g., DD/MM/YYYY)
        const formattedDate = dayDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        // Update the day's text content
        const dayLabel = `${daysOfWeek[index]} ${formattedDate.split('/').slice(0, 2).join('/')}`;
        dayElement.querySelector('span').textContent = dayLabel;

        // Assign the date to the day's dataset for easy tracking
        dayElement.dataset.date = dayDate.toISOString().split('T')[0];
    });
}

function handleAddClass(day) {
    const container = document.getElementById(`${day}-classes`);
    const addClassButton = document.querySelector(`.add-class[data-day="${day}"]`);

    // Hide the "Add Class" button
    addClassButton.style.display = 'none';

    // Get the date from the day's dataset
    const selectedDate = container.closest('.day').dataset.date;

    const form = document.createElement('form');
    form.classList.add('add-class-form');
    form.innerHTML = `
        <label for="date">Date:</label>
        <input type="date" name="date" value="${selectedDate}" required readonly>
        
        <label for="time_start">Start Time:</label>
        <input type="time" name="time_start" required>
        
        <label for="time_end">End Time:</label>
        <input type="time" name="time_end" required>
        
        <label for="max_capacity">Max Capacity:</label>
        <input type="number" name="max_capacity" placeholder="Max Capacity" min="1" required>
        
        <label for="price">Price:</label>
        <input type="number" name="price" placeholder="Price" step="0.01" min="0" required>
        
        <label for="ex_id">Exercise Type:</label>
        <select name="ex_id" required>
            <option value="1">Yoga</option>
            <option value="2">Dance</option>
            <option value="3">Pilates</option>
            <option value="4">Zumba</option>
        </select>
        
        <button type="submit">Add Class</button>
        <button type="button" class="cancel">Cancel</button>
    `;

    container.appendChild(form);

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const jsonData = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/admin/class/insertClass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonData),
            });

            if (response.ok) {
                const responseData = await response.json();
                alert(responseData.message);
                form.remove(); // Remove the form upon success
                addClassButton.style.display = 'block'; // Show the "Add Class" button again
                clearClassBoxes();
                const monday = getStartOfWeek();
                thisWeekClasses(formatDate(monday), formatDate(new Date(monday.getTime() + 6 * 86400000)));
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error submitting class:', error);
            alert('An unexpected error occurred.');
        }
    });

    form.querySelector('.cancel').addEventListener('click', () => {
        form.remove();
        addClassButton.style.display = 'block'; // Show the "Add Class" button again
    });
}


function adjustDropdownHeight(dropdown) {
    if (dropdown.classList.contains('show')) {
        dropdown.style.maxHeight = `${dropdown.scrollHeight}px`;
    } else {
        dropdown.style.maxHeight = "0";
    }
}

function attachRemoveLogic(studentItem) {
    const removeButton = studentItem.querySelector('.remove-student');
    removeButton.addEventListener('click', () => {
        studentItem.remove();
    });
}