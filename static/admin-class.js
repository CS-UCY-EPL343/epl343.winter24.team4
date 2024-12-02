document.addEventListener('DOMContentLoaded', () => {
    const weekDatesElement = document.getElementById('week-dates');
    const prevWeekButton = document.querySelector('.prev-week');
    const nextWeekButton = document.querySelector('.next-week');

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

    const monday = getStartOfWeek();
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    function formatDate(date){
        return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    }

    formattedMonday = formatDate(monday);
    formattedSunday = formatDate(sunday);

    thisWeekClasses(formattedMonday, formattedSunday)
            .then(data => {
                console.log('Classes this week:', data);
            })
            .catch(error => {
                console.error('Error fetching classes:', error);
            });

            function getNextWeekFromCurrent(currentMonday) {
                const nextMonday = new Date(currentMonday);
                nextMonday.setDate(nextMonday.getDate() + 7);
            
                const nextSunday = new Date(nextMonday);
                nextSunday.setDate(nextSunday.getDate() + 6);
            
                populateWeekDates(new Date(nextMonday));
            
                formattedMonday = formatDate(nextMonday);
                formattedSunday = formatDate(nextSunday);
            
                clearClassBoxes();
                data = thisWeekClasses(formattedMonday, formattedSunday);
            }
            
            function getLastWeekFromCurrent(currentMonday) {
            
                const lastMonday = new Date(currentMonday);
                lastMonday.setDate(lastMonday.getDate() - 7);
            
                const lastSunday = new Date(lastMonday);
                lastSunday.setDate(lastMonday.getDate() + 6);
            
                populateWeekDates(new Date(lastMonday));
            
                formattedMonday = formatDate(lastMonday);
                formattedSunday = formatDate(lastSunday);
            
                clearClassBoxes();
                thisWeekClasses(formattedMonday, formattedSunday);
            } 
            
            prevWeekButton.addEventListener('click', () => {
                monday.setDate(monday.getDate() - 7);
                clearClassBoxes();
                updateWeekDisplay();
            });
            
            nextWeekButton.addEventListener('click', () => {
                monday.setDate(monday.getDate() + 7);
                clearClassBoxes();
                updateWeekDisplay();
            });
            
    
    function updateWeekDisplay() {
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

    prevWeekButton.addEventListener('click', () => {
        monday.setDate(monday.getDate() - 7);
        clearClassBoxes();
        updateWeekDisplay();
    });

    nextWeekButton.addEventListener('click', () => {
        monday.setDate(monday.getDate() + 7);
        clearClassBoxes();
        updateWeekDisplay();
    });

    updateWeekDisplay();

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

    function handleAddClass(day) {
        const form = document.createElement('form');
        form.classList.add('add-class-form');
        form.innerHTML = `
            <input type="text" placeholder="Class Hours (e.g., 10:00 - 11:00)" required class="class-hours">
            <input type="text" placeholder="Description" required class="class-description">
            <select class="class-type">
                <option value="" disabled selected>Select Class Type</option>
                <option value="Yoga">Yoga</option>
                <option value="Dance">Dance</option>
                <option value="Pilates">Pilates</option>
                <option value="Zumba">Zumba</option>
            </select>
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
            const studentListId = `student-list-${Date.now()}`;
            classItem.innerHTML = `
                <p>Hours: ${hours}</p>
                <p>Description: ${description}</p>
                <p>Class Type: ${type}</p>
                <p>Capacity: ${capacity}</p>
                <button class="remove-class">Remove</button>
                <button class="view-students" data-student-list="${studentListId}">View Students</button>
                <div id="${studentListId}" class="student-list" style="display: none;"></div>
            `;

            classItem.querySelector('.remove-class').addEventListener('click', () => {
                classItem.classList.add('removing'); // Add transition class
                setTimeout(() => {
                    classItem.remove(); // Remove after the transition
                    adjustDropdownHeight(container.closest('.dropdown-content'));
                }, 300); // Match CSS transition duration
            });

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
    const apiUrl = '/admin/class';

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

    // Iterate through the days in the data
    data.forEach(dayData => {
        const dayContainer = document.getElementById(`${dayData.day}-classes`);
        
        // Add each class to the corresponding day
        dayData.classes.forEach(classInfo => {
            const classItem = document.createElement('div');
            classItem.classList.add('class-item');
            
            // Create unique ID for student list
            const studentListId = `student-list-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            
            classItem.innerHTML = `
                <p>Hours: ${classInfo.hours}</p>
                <p>Description: ${classInfo.description}</p>
                <p>Class Type: ${classInfo.type}</p>
                <p>Capacity: ${classInfo.capacity}</p>
                <button class="remove-class">Remove</button>
                <button class="view-students" data-student-list="${studentListId}">View Students</button>
                <div id="${studentListId}" class="student-list" style="display: none;"></div>
            `;

            // Add logic for removing classes
            classItem.querySelector('.remove-class').addEventListener('click', () => {
                classItem.remove();
                adjustDropdownHeight(dayContainer.closest('.dropdown-content'));
            });

            // Add logic for viewing students
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

        // Adjust dropdown height for proper UI display
        adjustDropdownHeight(dayContainer.closest('.dropdown-content'));
    });
}
