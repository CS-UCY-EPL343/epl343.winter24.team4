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
    // Clear existing classes before populating
    document.querySelectorAll('.day .class-item').forEach(item => item.remove());
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

        // Add each class to the corresponding day
        data.classes.forEach(classInfo => {
            const classDay = new Date(classInfo.Date);
            console.log(days[classDay.getDay()]);
            const dayContainer = document.getElementById(`${days[classDay.getDay()]}-classes`);

            const classItem = document.createElement('div');
            classItem.classList.add('class-item');
            
            // Create unique ID for student list
            const studentListId = `student-list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

            classItem.innerHTML = `
                <p>Hours: ${classInfo.Time_start} - ${classInfo.Time_end}</p>
                <p>Class Type: ${classInfo.Exercise_Type}</p>
                <p>Capacity: ${classInfo.Remaining_Capacity}/${classInfo.Max_capacity}</p>
                <p>Price: ${classInfo.Price}/${classInfo.Price}</p>
                ${
                    classInfo.Date >= today
                    ? `<button class="remove-class" id="${classInfo.Class_ID}">Remove</button>`
                    : ""
                }
                <button class="view-students" data-student-list="${studentListId}">View Students</button>
                <div id="${studentListId}" class="student-list" style="display: none;"></div>
            `;

           
            const button1 = classItem.querySelector('.remove-class');
            if(button1){
                button1.addEventListener('click', () => {
                    const Class_ID = button1.id;
                    const data = { class_id: Class_ID };
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
                        console.error('Error removing the class:', error);

                    });
                });
            }

            classItem.querySelector('.view-students').addEventListener('click', (event) => {
                const studentList = document.getElementById(event.target.getAttribute('data-student-list'));
                const modal = document.getElementById('view-students-modal');
                modal.style.display = 'block';

                const modalStudentList = document.getElementById('student-list');
                modalStudentList.innerHTML = studentList.innerHTML;

                // Attach event for removing students
                modalStudentList.querySelectorAll('.remove-student').forEach(button => {
                    button.addEventListener('click', () => {
                        const studentElement = button.parentElement;
                        studentElement.remove();
                        const matchingStudent = [...studentList.children].find(child => child.textContent.trim() === studentElement.textContent.trim());
                        if (matchingStudent) matchingStudent.remove();
                    });
                });
            });

            // Append class item to the container
            dayContainer.appendChild(classItem);
        });

        // // Adjust dropdown height for proper UI display
        // adjustDropdownHeight(dayContainer.closest('.dropdown-content'));

    const addClassButtons = classItem.querySelector('.add-class-form button');

    addClassButtons.addEventListener('click', () => {
        const apiUrl = '/api/admin/class/insertClass';
        const Class_ID = addClassButtons.id;
        const data = { class_id: Class_ID };
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
            console.error('Error removing the class:', error);

        });
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
    const form = document.createElement('form');
    form.classList.add('add-class-form');
    form.innerHTML = `
        <div>
            <label for="class-start-time">Start Time:</label>
            <input type="time" id="class-start-time" class="class-start-time" required>
        </div>
        <div>
            <label for="class-end-time">End Time:</label>
            <input type="time" id="class-end-time" class="class-end-time" required>
        </div>
        <select class="class-type">
            <option value="" disabled selected>Select Class Type</option>
            <option value="Yoga">Yoga</option>
            <option value="Dance">Dance</option>
            <option value="Pilates">Pilates</option>
            <option value="Zumba">Zumba</option>
        </select>
        <input type="number" placeholder="Capacity (e.g., 20)" required class="class-capacity">
        <input type="number" placeholder="Price (e.g., 10.00)" required class="class-price">
        <button type="submit">Add</button>
        <button type="button" class="cancel">Cancel</button>
    `;

    const container = document.getElementById(`${day}-classes`);
    container.appendChild(form);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const startTime = form.querySelector('.class-start-time').value;
        const endTime = form.querySelector('.class-end-time').value;
        const type = form.querySelector('.class-type').value;
        const capacity = form.querySelector('.class-capacity').value;
        const price = form.querySelector('.class-price').value;

        const classItem = document.createElement('div');
        classItem.classList.add('class-item');
        const studentListId = `student-list-${Date.now()}`;
        classItem.innerHTML = `
            <p>Hours: ${startTime} - ${endTime}</p>
            <p>Class Type: ${type}</p>
            <p>Capacity: ${capacity}</p>
            <p>Price: ${price}</p>
            <button class="remove-class">Remove</button>
            <button class="view-students" data-student-list="${studentListId}">View Students</button>
            <div id="${studentListId}" class="student-list" style="display: none;"></div>
        `;

        classItem.querySelector('.view-students').addEventListener('click', (event) => {
            const studentListId = event.target.getAttribute('data-student-list');
            const studentList = document.getElementById(studentListId);
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

            const studentForm = document.getElementById('student-form');
            const studentNameInput = document.getElementById('student-name');

            studentForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const studentName = studentNameInput.value.trim();
                if (studentName) {
                    const studentItem = document.createElement('p');
                    studentItem.innerHTML = `${studentName} <button class="remove-student">X</button>`;
                    studentList.appendChild(studentItem);
                    const modalStudentItem = studentItem.cloneNode(true);
                    modalStudentList.appendChild(modalStudentItem);
                    attachRemoveLogic(studentItem);
                    attachRemoveLogic(modalStudentItem);
                    studentNameInput.value = '';
                }
            });
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

function attachRemoveLogic(studentItem) {
    const removeButton = studentItem.querySelector('.remove-student');
    removeButton.addEventListener('click', () => {
        studentItem.remove();
    });
}