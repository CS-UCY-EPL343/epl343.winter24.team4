window.onload = function() {
    const monday = getMondayThisWeek();
    console.log(monday);
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    console.log(sunday);

    formattedMonday = formatDate(monday);
    formattedSunday = formatDate(sunday);


    const data = thisWeekClasses(formattedMonday, formattedSunday);

    populateWeekDates(monday);
    populateClasses(data);

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

    data.forEach(classItem => {
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
    console.log(startDate + 'startDate');
    console.log(endDate + 'endDate');
    return fetch(`${apiUrl}?start_date=${startDate}&end_date=${endDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}

function getNextWeekFromCurrent(currentMonday) {
    const nextMonday = new Date(currentMonday);
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextSunday.getDate() + 6);

    populateWeekDates(new Date(nextMonday));
    data = thisWeekClasses(nextMonday.getFullYear() + "-" + (nextMonday.getMonth()+1) + "-" + nextMonday.getDate(), nextSunday.getFullYear() + "-" + (nextSunday.getMonth()+1) + "-" + nextSunday.getDate());
    console.log('Classes this week:', data);
    populateClasses(data);

}

function getLastWeekFromCurrent(currentMonday) {

    const lastMonday = new Date(currentMonday);
    lastMonday.setDate(lastMonday.getDate() - 7);

    const lastSunday = new Date(lastMonday);
    lastSunday.setDate(lastMonday.getDate() + 6);

    populateWeekDates(new Date(lastMonday));
    data = thisWeekClasses(lastMonday.getFullYear() + "-" + (lastMonday.getMonth()+1) + "-" + lastMonday.getDate(), lastSunday.getFullYear() + "-" + (lastSunday.getMonth()+1) + "-" + lastSunday.getDate());
    console.log('Classes this week:', data);
    populateClasses(data);

}





