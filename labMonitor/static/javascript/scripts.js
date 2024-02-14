// Function to update the clock
function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    clockElement.textContent = now.toLocaleTimeString();
    setTimeout(updateClock, 1000); // Schedule the next update
}

// Function to highlight the current lab
function highlightCurrentLab() {
    const now = new Date();
    const currentDayOfWeek = now.toLocaleString('en-us', { weekday: 'long' });
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = new Date();
    currentTime.setHours(currentHour, currentMinutes, 0);

    const courseEntries = document.querySelectorAll('.course-entry');
    courseEntries.forEach(course => {
        const dayElement = course.closest('.day-column').querySelector('h2').textContent;
        const [startTime, endTime] = course.textContent.match(/\d{2}:\d{2}/g).map(time => {
            const [hours, minutes] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(hours, minutes, 0);
            return date;
        });

        if (dayElement === currentDayOfWeek && startTime <= currentTime && endTime > currentTime) {
            course.classList.add('current-course');
        } else {
            course.classList.remove('current-course');
        }
    });
}

// Function to fetch the timetable from the server
function fetchTimetable() {
    fetch('/api/timetable')
        .then(response => response.json())
        .then(data => {
            const timetableElement = document.getElementById('timetable');
            timetableElement.innerHTML = ''; // Clear existing entries

            // Group the courses by day
            const daysData = data.reduce((acc, cur) => {
                (acc[cur.day] = acc[cur.day] || []).push(cur);
                return acc;
            }, {});

            // Loop through the days
            Object.keys(daysData).forEach(day => {
                const dayColumn = document.createElement('div');
                dayColumn.classList.add('day-column');
                const dayName = document.createElement('h2');
                dayName.textContent = day;
                dayColumn.appendChild(dayName);

                // Loop through the courses for each day
                daysData[day].forEach(course => {
                    const courseEntry = document.createElement('div');
                    courseEntry.classList.add('course-entry');

                    // Replace spaces and slashes with hyphens and lowercase everything
                    let yearClass = course.year_of_study.replace(/[\s\/]+/g, '-').toLowerCase();
                    // Handle special case for 'Fourth Year/MSc'
                    if (yearClass === 'fourth-year-msc') {
                        yearClass = 'fourth-year';
                    }
                    courseEntry.classList.add(yearClass); // Add class for year

                    courseEntry.textContent = `Course: ${course.course_name} - Time: ${course.time_start} to ${course.time_end}`;
                    dayColumn.appendChild(courseEntry);
                });

                timetableElement.appendChild(dayColumn);
                highlightCurrentLab(); // Highlight the current lab after adding the timetable
            });
        })
        .catch(error => {
            console.error('Error fetching timetable:', error);
        });
}

function filterByYear(year) {
    // If year is an empty string, remove the filter
    if (year === "") {
        // Show all course entries
        document.querySelectorAll('.course-entry').forEach(course => {
            course.style.display = '';
        });
    } else {
        // Hide all course entries
        document.querySelectorAll('.course-entry').forEach(course => {
            course.style.display = 'none';
        });

        // Show only the entries that match the selected year
        document.querySelectorAll(`.${year}`).forEach(course => {
            course.style.display = '';
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    fetchTimetable();
    updateClock();
    highlightCurrentLab();
    setInterval(highlightCurrentLab, 60000); // Update the current lab highlight every minute
});
