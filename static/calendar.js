window.onload = function() {
    const date = getMondayThisWeek();
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    for (let i = 0; i < 7; i++) {
        document.getElementById(days[date.getDay()]+ "-day").innerHTML =
            days[date.getDay()].toUpperCase() + "<br/>" +
            date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
        date.setDate(date.getDate() + 1);
    }

    document.getElementById('left-arrow').addEventListener('click', function() {
        console.log('Left arrow clicked');
    });

    document.getElementById('right-arrow').addEventListener('click', function() {
        console.log('Right arrow clicked');
    });
};

document.addEventListener("DOMContentLoaded", () => {
    console.log("Calendar Data:", calendarData);

    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    calendarData.classes.forEach(classItem => {
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
            if(classItem.Remaining_Capacity === 0){
                classBox.style.backgroundColor = "#999999";
            }
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

    return classBox;
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




