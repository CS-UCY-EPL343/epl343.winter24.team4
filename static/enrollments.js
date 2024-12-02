document.addEventListener("DOMContentLoaded", function() {
    fetchEnrollments();
});

function fetchEnrollments() {
    const apiUrl = '/api/enrollments';
    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);
            const enrollments = JSON.parse(data.enrollments);
            createEnrollmentCards(enrollments);
        })
        .catch(error => {
            console.error('Error fetching your enrollments:', error);
        });
}

function createEnrollmentCards(enrollments) {
    const container = document.getElementById("enrollment-container");

    if (enrollments.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #999;">No enrollments found.</p>`;
        return;
    }

    enrollments.forEach(classItem => {
        console.log(classItem);

        const card = document.createElement("div");
        card.classList.add("enrollment-card");

        const classInfo = `
            <h3>${classItem.Name}</h3>
            <p><strong>Date:</strong> ${classItem.Date}</p>
            <p><strong>Time:</strong> ${classItem.Time_start} - ${classItem.Time_end}</p>
            <p><strong>Attendance:</strong> ${classItem.Attendance_Status ? "Attended" : "Not Attended"}</p>
        `;
        card.innerHTML = classInfo;
        const today = new Date();
        const classDate = new Date(classItem.Date);
        if(classDate > today) {
            console.log('IN BUTTON');
            const deleteEnrollmentButton = document.createElement("button");
            deleteEnrollmentButton.textContent = "Delete Enrollment";
            deleteEnrollmentButton.classList.add("enroll-btn");
            deleteEnrollmentButton.addEventListener("click", function () {
                alert(`You have deleted your enrollment for class "${classItem.Name}"!`);
                deleteEnrollment(classItem.Class_ID);
            });

            card.appendChild(deleteEnrollmentButton);
        }

        container.appendChild(card);
    });
}

function deleteEnrollment(classId){
    const data = { class_id: classId };
    const apiUrl = '/api/deleteEnrollment';
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

