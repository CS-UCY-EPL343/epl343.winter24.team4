function getCurrentWeekDates() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Get current day (0 = Sunday, 1 = Monday, etc.)

    const startOfWeek = new Date(today);
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust for Sunday (diff = -6)
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0); // Set time to 00:00 for clean date

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Add 6 days to the start date
    endOfWeek.setHours(23, 59, 59, 999); // Set time to 23:59 for end of day

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
        const day = date.getDate().toString().padStart(2, '0'); // Add leading zero
        return `${year}-${month}-${day}`;
    };

    return {
        start: formatDate(startOfWeek),
        end: formatDate(endOfWeek)
    };
}

function thisWeekClasses(startDate, endDate){

}

