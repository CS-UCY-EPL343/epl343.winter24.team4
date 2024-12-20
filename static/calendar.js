window.onload = function() {
    const monday = getMondayThisWeek();
    console.log(monday);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    console.log(sunday);

    formattedMonday = formatDate(monday);
    formattedSunday = formatDate(sunday);


    thisWeekClasses(formattedMonday, formattedSunday)
            .then(data => {
                console.log('Classes this week:', data);
            })
            .catch(error => {
                console.error('Error fetching classes:', error);
            });

    populateWeekDates(monday);

    document.getElementById('left-arrow').addEventListener('click', function() {
        console.log('Left arrow clicked');
        const dayElement = document.querySelector('#monday .day');
        console.log(dayElement.id);

        getLastWeekFromCurrent(dayElement.id)
    });

    document.getElementById('right-arrow').addEventListener('click', function() {
        console.log('Right arrow clicked');
        const dayElement = document.querySelector('#monday .day');
        console.log(dayElement.id);

        getNextWeekFromCurrent(dayElement.id)
    });
};

function formatDate(date){
    return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
}

function populateWeekDates(date){
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    for (let i = 0; i < 7; i++) {
        const column = document.getElementById(days[date.getDay()])
        const day = column.querySelector('.day');
        day.id = date;
        day.innerHTML=days[date.getDay()].toUpperCase() + "<br/>" + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        date.setDate(date.getDate() + 1);
    }
}

function populateClasses(data){
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    data.classes.forEach(classItem => {
        const classDate = new Date(classItem.Date);
        const dayColumnId = days[classDate.getDay()];
        console.log(dayColumnId);

        if (dayColumnId) {
            const classBox = addClassBox(dayColumnId)
            classBox.id = classItem.Class_ID;
            classBox.innerHTML = `
                <p><strong>${classItem.Exercise_Type}</strong></p>
                <p>${classItem.Time_start} - ${classItem.Time_end}</p>
                <p>Price: €${classItem.Price}</p>
                <p>Capacity: ${classItem.Remaining_Capacity}</p>
            `;
            const today = new Date();
            const classDate = new Date(classItem.Date);
            if(classItem.Remaining_Capacity === 0){
                classBox.style.backgroundColor = "#999999";
                classBox.addEventListener('click', function() {
                    console.log(`Class-box with id "${classBox.id}" clicked!`);
                    checkIfAdmin(classItem);
                });
            }
            if(classDate < today){
                classBox.style.backgroundColor = "#999999";
                classBox.style.pointerEvents = "none";
            }
            else{
                classBox.addEventListener('click', function() {
                    console.log(`Class-box with id "${classBox.id}" clicked!`);
                    checkIfAdmin(classItem);
                });
            }
            classBox.addEventListener('click', function() {
            console.log(`Class-box with id "${classBox.id}" clicked!`);
    });
        } else {
            console.error(`Column not found for day: ${dayColumnId}`);
        }
    });
}

function addClassBox(day) {
    const parentDiv = document.getElementById(day);

    const classBox = document.createElement('div');

    classBox.classList.add('class-box');

    parentDiv.appendChild(classBox);

    return classBox;
}

function getMondayThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);

    return startOfWeek;
}


function thisWeekClasses(startDate, endDate) {
    const apiUrl = '/calendar';

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

function clearClassBoxes() {
    const classBoxes = document.querySelectorAll('.class-box');
    classBoxes.forEach(box => box.remove());
}

async function isEnrolled(classId) {
    try {
        // Send the GET request
        const response = await fetch(`/isenrolled?class_id=${classId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        // Ensure response status is OK
        if (!response.ok) {
            console.error("Server Error:", response.status, response.statusText);
            return false;
        }

        // Parse the JSON response
        const data = await response.json();

        // Return the isEnrolled value as a boolean
        return Boolean(data.isEnrolled);
    } catch (error) {
        console.error("Fetch Error:", error);
        return false;
    }
}

function checkIfAdmin(classItem) {
    fetch('/api/isAdmin')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.isAdmin) {
                console.log("User is an admin");
                window.location.href = "/admin/class";
            } else {
                console.log("User is not an admin");
                showModal(classItem);
            }
        })
        .catch(error => {
            console.error("Error checking admin status:", error);
        });
}

function showModal(classItem) {
    const modal = document.getElementById("enrollModal");
    const classDetails = document.getElementById("classDetails");
    const enrollBtn = document.getElementById("enrollBtn");
    const closeBtn = document.getElementById("closeModal");  

    classDetails.innerHTML = `
        <strong>${classItem.Exercise_Type}</strong><br>
        Time: ${classItem.Time_start} - ${classItem.Time_end}<br>
        Price: €${classItem.Price}<br>
        Remaining Capacity: ${classItem.Remaining_Capacity}
    `;
    
    (async () => {
        const enrolled = await isEnrolled(classItem.Class_ID);
    
        if (enrolled) {
            enrollBtn.style.display = "none";
        } else {
            enrollBtn.style.display = "block";
        }
    })();

    modal.style.display = "block";

    closeBtn.onclick = function() {
        closeModal();
    };

    enrollBtn.onclick = function() {
        const apiUrl = '/enroll';
        const classId = classItem.Class_ID;
        
        const data = { class_id: classId };
    
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
            closeModal();
            enrollBtn.style.display = "none";
            return response.json();    
        })
        .catch(error => {
            console.error('Error enrolling in class:', error);
        });
    };
};

function closeModal() {
    const modal = document.getElementById("enrollModal");
    modal.style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("enrollModal");
    if (event.target === modal) {
        closeModal();
    }
};








