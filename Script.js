// مصفوفة تخزين المواد في الذاكرة المؤقتة والمتصفح
let courses = JSON.parse(localStorage.getItem('courses')) || [];

// تشغيل الدالة فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    renderCourses();

    const form = document.getElementById('course-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const nameInput = document.getElementById('course-name');
            const name = nameInput.value.trim();

            if (name === '') return;

            const newCourse = {
                id: Date.now(),
                name: name,
                absent: 0
            };

            courses.push(newCourse);
            saveAndRender();
            nameInput.value = ''; // تفريغ الحقل
        });
    }
});

function saveAndRender() {
    try {
        localStorage.setItem('courses', JSON.stringify(courses));
    } catch (e) {
        console.log('Local storage error:', e);
    }
    renderCourses();
}

function renderCourses() {
    const coursesList = document.getElementById('courses-list');
    if (!coursesList) return;

    coursesList.innerHTML = '';
    
    if (courses.length === 0) {
        coursesList.innerHTML = '<p style="text-align: center; color: #888; padding: 10px;">لا توجد مقررات مضافة حالياً.</p>';
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
            <div class="actions" style="margin-top: 10px; display: flex; gap: 5px;">
                <button type="button" class="btn-success" onclick="updateAbsence(${course.id}, 1)">+ غياب</button>
                <button type="button" onclick="updateAbsence(${course.id}, -1)">- إزالة غياب</button>
                <button type="button" class="btn-danger" onclick="deleteCourse(${course.id})">حذف المادة</button>
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
