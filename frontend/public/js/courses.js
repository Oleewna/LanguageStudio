(function () {
  async function renderCourseCards() {
    const list = document.getElementById('courseList');
    if (!list) return;

    let index;
    try {
      index = await window.loadCourseIndex?.();
    } catch (error) {
      list.textContent = 'Could not load courses. Check your connection and try again.';
      console.error('Could not render course catalog:', error);
      return;
    }
    const courses = Array.isArray(index?.courses) ? index.courses : [];
    if (courses.length === 0) {
      list.textContent = 'No courses are available.';
      return;
    }
    const currentCourseId = window.getCourseId?.() || localStorage.getItem('ls_course') || 'it';
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);

    list.innerHTML = courses.map(course => {
      const active = currentCourseId === course.id;
      const status = course.status === 'active' ? 'Активний' : 'Незабаром';
      const name = escapeHtml(L(course.name || { uk: course.id, en: course.id }));
      const nativeName = course.native || course.id.toUpperCase();
      const disabled = course.status && course.status !== 'active';

      return `
        <article class="course-card ${active ? 'active' : ''} ${disabled ? 'locked' : ''}">
          <div class="course-card-head">
            <div class="course-flag">${getIconSvg(course.flag || 'globe')}</div>
            <div>
              <div class="course-status">${status}</div>
              <h2>${name}</h2>
            </div>
          </div>
          <p class="course-native">${escapeHtml(nativeName)}</p>
          <div class="course-card-meta">
            <span>${escapeHtml(course.id.toUpperCase())}</span>
            <span>${disabled ? 'Заблоковано' : 'Готово'}</span>
          </div>
          <button type="button" class="course-card-button" data-course-select="${escapeHtml(course.id)}" ${disabled ? 'disabled' : ''}>
            ${active ? 'Поточний курс' : disabled ? 'Незабаром' : 'Перейти на цей курс'}
          </button>
        </article>
      `;
    }).join('');

    list.querySelectorAll('[data-course-select]').forEach(button => {
      button.addEventListener('click', () => {
        if (button.disabled) return;
        const nextCourse = button.getAttribute('data-course-select');
        if (typeof window.setTargetCourse === 'function') {
          window.setTargetCourse(nextCourse);
          return;
        }
        if (typeof window.setCourseId === 'function') {
          window.setCourseId(nextCourse);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderCourseCards();
  });
})();
