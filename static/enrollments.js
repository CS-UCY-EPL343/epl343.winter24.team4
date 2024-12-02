document.addEventListener("DOMContentLoaded", function() {
    fetchEnrollments();
});

function fetchEnrollments() {
    const enrollments = [
        {
            classId: 1,
            exerciseType: "Yoga",
            timeStart: "08:00 AM",
            timeEnd: "09:00 AM",
            date: "2024-12-05",
            price: 15,
            remainingCapacity: 5
        },
        {
            classId: 2,
            exerciseType: "Pilates",
            timeStart: "10:00 AM",
            timeEnd: "11:00 AM",
            date: "2024-12-06",
            price: 20,
            remainingCapacity: 2
        },
    ];

    const enrollmentsList = document.getElementById("enrollments-list");

    enrollments.forEach(enrollment => {
        const enrollmentCard = createEnrollmentCard(enrollment);
        enrollmentsList.appendChild(enrollmentCard);
    });
}

function createEnrollmentCard(enrollment) {
    const card = document.createElement("div");
    card.classList.add("enrollment-card");

    const classInfo = `
        <h3>${enrollment.exerciseType}</h3>
        <p><strong>Date:</strong> ${enrollment.date}</p>
        <p><strong>Time:</strong> ${enrollment.timeStart} - ${enrollment.timeEnd}</p>
        <p><strong>Price:</strong> €${enrollment.price}</p>
        <p><strong>Remaining Capacity:</strong> ${enrollment.remainingCapacity}</p>
    `;

    card.innerHTML = classInfo;

    const enrollButton = document.createElement("button");
    enrollButton.textContent = "Enroll Again";
    enrollButton.classList.add("enroll-btn");
    enrollButton.addEventListener("click", function() {
        alert(`You have enrolled again in ${enrollment.exerciseType}!`);
    });

    card.appendChild(enrollButton);

    return card;
}
