window.onload = function() {
    const date = getMondayThisWeek();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    for (let i = 0; i < 7; i++) {
        document.getElementById(days[date.getDay()]+ "-day").innerHTML =
            days[date.getDay()].toUpperCase() + "<br/>" +
            date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        date.setDate(date.getDate() + 1);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Calendar Data:", calendarData);

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    calendarData.classes.forEach(classItem => {
        const classDate = new Date(classItem.Date);
        const dayColumnId = days[classDate.getDay()];
        console.log(dayColumnId);

        if (dayColumnId) {
            addClassBox(dayColumnId)
            const classBox = document.querySelector(`#${dayColumnId} .class-box`);
            classBox.id = classItem.Class_ID;
            classBox.innerHTML = `
                <p>${classItem.Time_start} - ${classItem.Time_end}</p>
                <p>Price: $${classItem.Price}</p>
                <p>Capacity: ${classItem.Max_capacity}</p>
            `;
            classBox.addEventListener('click', function() {
                console.log(`Class-box with id "${classBox.id}" clicked!`);
    });
        } else {
            console.error(`Column not found for day: ${dayColumnId}`);
        }
    });
});

function addClassBox(day) {
    const parentDiv = document.getElementById(day);

    const classBox = document.createElement('div');

    classBox.classList.add('class-box');

    parentDiv.appendChild(classBox);
}

function getMondayThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay();

    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

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
        });
}


