document.addEventListener('DOMContentLoaded', loadCourses);

const form = document.getElementById('course-form');
const coursesList = document.getElementById('courses-list');

let courses = JSON.parse(localStorage.getItem('courses')) || [];

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('course-name').value;
    const max = parseInt(document.getElementById('max-absence').value);

    const newCourse = {
        id: Date.now(),
        name: name,
        max: max,
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
        const percentage = Math.round((course.absent / course.max) * 100) || 0;
        let color = '#2ecc71'; // أخضر
        if (percentage >= 50 && percentage < 75) color = '#f39c12'; // أصفر
        if (percentage >= 75) color = '#e74c3c'; // أحمر

        const div = document.createElement('div');
        div.className = 'course-item';
        div.innerHTML = `
            <div class="course-info">
                <strong>${course.name}</strong>
                <span>الغياب: ${course.absent} / ${course.max} (${percentage}%)</span>
            </div>
            <div style="background: #ddd; border-radius: 4px; height: 8px; margin-bottom: 10px; overflow: hidden;">
                <div style="background: ${color}; width: ${Math.min(percentage, 100)}%; height: 100%;"></div>
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

