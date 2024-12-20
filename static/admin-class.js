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

function populateClasses(data) {
    document.querySelectorAll('.day .class-item').forEach(item => item.remove());
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    data.classes.forEach(classInfo => {
        const classDay = new Date(classInfo.Date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison

        const dayContainer = document.getElementById(`${days[classDay.getDay()]}-classes`);
        const addClassButton = document.querySelector(`.add-class[data-day="${days[classDay.getDay()]}"]`);

        const classItem = document.createElement('div');
        classItem.classList.add('class-item');

        classItem.innerHTML = `
            <p>Hours: ${classInfo.Time_start} - ${classInfo.Time_end}</p>
            <p>Class Type: ${classInfo.Exercise_Type}</p>
            <p>Capacity: ${classInfo.Remaining_Capacity}/${classInfo.Max_capacity}</p>
            <button class="remove-class" data-class-id="${classInfo.Class_ID}">Remove</button>
            <button class="view-students" id="${classInfo.Class_ID}">View Students</button>
        `;

        const removeButton = classItem.querySelector('.remove-class');
        if (classDay < today) {
            removeButton.style.display = 'none';
        } else {
            removeButton.addEventListener('click', async () => {
                const classId = removeButton.dataset.classId;
                try {
                    const response = await fetch(`/api/admin/class/removeClass`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ class_id: classId }),
                    });

                    if (response.ok) {
                        alert('Class removed successfully.');
                        classItem.remove();
                        adjustDropdownHeight(dayContainer.closest('.dropdown-content'));
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.error}`);
                    }
                } catch (error) {
                    console.error('Error removing class:', error);
                    alert('An unexpected error occurred.');
                }
            });
        }

        const viewEnrollments = classItem.querySelector('.view-students');

        viewEnrollments.addEventListener('click' , function () {
            const classId = viewEnrollments.id;
            const apiUrl = `/api/fetch-enrollments-for-class?class_id=${classId}`;
            return fetch(apiUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data received:', data);
                    showEnrollments(data,classId);
                })
                .catch(error => {
                    console.error('Error fetching week classes:', error);
                });
        });


        if (classDay < today) {
            addClassButton.style.display = 'none';
        }

        dayContainer.appendChild(classItem);
    });
}

function showEnrollments(data, classId) {
    // Get the modal or container for displaying enrollments
    const modal = document.getElementById('view-students-modal');
    const modalContent = modal.querySelector('.modal-content');

    // Clear any previous content
    modalContent.innerHTML = `
        <h2>Enrollments for Class ID: ${classId}</h2>
        <div class="enrollment-list"></div>
    `;

    const enrollmentList = modalContent.querySelector('.enrollment-list');

    // Populate enrollments
    if (data.length === 0) {
        enrollmentList.innerHTML = '<p>No enrollments found for this class.</p>';
    } else {
        data.forEach(enrollment => {
            const studentItem = document.createElement('div');
            studentItem.classList.add('enrollment-item');

            studentItem.innerHTML = `
                <p><strong>Name:</strong> ${enrollment.FName} ${enrollment.LName}</p>
                <p><strong>Email:</strong> ${enrollment.Email}</p>
                <button class="remove-enrollment" data-user-id="${enrollment.User_ID}" data-class-id="${classId}">Remove</button>
            `;

            const removeButton = studentItem.querySelector('.remove-enrollment');
            removeButton.addEventListener('click', async () => {
                const userId = removeButton.dataset.userId;

                try {
                    const response = await fetch('/api/remove-enrollment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            class_id: classId
                        }),
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        alert(responseData.message);
                        studentItem.remove();
                    } else {
                        const errorData = await response.json();
                        alert(`Error: ${errorData.error}`);
                    }
                } catch (error) {
                    console.error('Error removing enrollment:', error);
                    alert('An unexpected error occurred.');
                }
            });

            enrollmentList.appendChild(studentItem);
        });
    }

    // Show the modal
    modal.style.display = 'block';
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

        // Hide or show "Add Class" button based on the date
        const addClassButton = dayElement.querySelector('.add-class');
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to compare just the date
        if (dayDate < today) {
            addClassButton.style.display = 'none'; // Hide "Add Class" for past dates
        } else {
            addClassButton.style.display = 'block'; // Show for future dates
        }
    });
}


async function handleAddClass(day) {
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
            <option value="" disabled selected>Loading...</option>
        </select>
        
        <button type="submit">Add Class</button>
        <button type="button" class="cancel">Cancel</button>
    `;

    container.appendChild(form);

    const selectDropdown = form.querySelector('select[name="ex_id"]');
    
    // Fetch exercise types from the endpoint
    try {
        const response = await fetch('/api/getExerciseTypes');
        if (response.ok) {
            const jsonResponse = await response.json(); // Parse the outer JSON
            console.log('Exercise Types Raw Response:', jsonResponse);
    
            // Parse the `types` string into a JSON object
            const exerciseTypes = JSON.parse(jsonResponse.types);
    
            console.log('Parsed Exercise Types:', exerciseTypes);
    
            selectDropdown.innerHTML = ''; // Clear loading option
    
            // Iterate over the parsed array
            exerciseTypes.forEach((type) => {
                const option = document.createElement('option');
                option.value = type.Ex_ID;
                option.textContent = type.Name;
                selectDropdown.appendChild(option);
            });
        } else {
            throw new Error('Failed to load exercise types');
        }
    } catch (error) {
        console.error('Error fetching exercise types:', error);
        selectDropdown.innerHTML = '<option value="" disabled>Error loading types</option>';
    }

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