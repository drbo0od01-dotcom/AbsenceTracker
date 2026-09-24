document.addEventListener('DOMContentLoaded', loadCourses);

const form = document.getElementById('course-form');
const coursesList = document.getElementById('courses-list');

let courses = JSON.parse(localStorage.getItem('courses')) || [];

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('course-name').value;

    const newCourse = {
        id: Date.now(),
        name: name,
        absent: 0
    };

    courses.push(newCourse);
    saveAndRender();
    form.reset();
});

function saveAndRender() {
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses();
}

function renderCourses() {
    coursesList.innerHTML = '';
    if (courses.length === 0) {
        coursesList.innerHTML = '<p style="text-align: center; color: #888;">لا توجد مقررات مضافة حالياً.</p>';
        return;
    }

    courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-item';
        div.innerHTML = `
            <div class="course-info">
                <strong>${course.name}</strong>
                <span>إجمالي الغيابات: <strong>${course.absent}</strong></span>
            </div>
            <div class="actions">
                <button class="btn-success" onclick="updateAbsence(${course.id}, 1)">+ غياب</button>
                <button onclick="updateAbsence(${course.id}, -1)">- إزالة غياب</button>
                <button class="btn-danger" onclick="deleteCourse(${course.id})">حذف المادة</button>
            </div>
        `;
        coursesList.appendChild(div);
    });
}

function updateAbsence(id, val) {
    courses = courses.map(course => {
        if (course.id === id) {
            course.absent = Math.max(0, course.absent + val);
        }
        return course;
    });
    saveAndRender();
}

function deleteCourse(id) {
    courses = courses.filter(course => course.id !== id);
    saveAndRender();
}
