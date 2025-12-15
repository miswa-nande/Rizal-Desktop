// Gallery page category switching

document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.category-tab');
    const gallerySections = document.querySelectorAll('.gallery-section');

    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;

            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all sections
            gallerySections.forEach(section => section.classList.remove('active'));

            // Show selected section
            const targetSection = document.getElementById(`${category}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
});
