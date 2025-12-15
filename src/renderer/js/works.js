// Works page category switching

document.addEventListener('DOMContentLoaded', () => {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const worksSections = document.querySelectorAll('.works-section');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;

            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Hide all sections
            worksSections.forEach(section => section.classList.remove('active'));

            // Show selected section
            const targetSection = document.getElementById(`${category}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});
