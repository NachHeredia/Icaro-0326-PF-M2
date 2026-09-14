export class FilterUi {
    constructor() {
        this.pills = document.querySelectorAll('.filter-pill');
        this.section = document.querySelectorAll('.category-section[data-category]');
        this.init();
    }

    init() {
        const currentHash = window.location.hash.replace('#', '').trim();

        if (currentHash) {
            this.filterByCategory(currentHash);
        } else {
            const firstCategory =
                this.pills[0]?.getAttribute('data-filter') || 'limpieza';

            this.filterByCategory(firstCategory);
        }

        this.pills.forEach(pill => {
            const targetCategory = pill.getAttribute('data-filter');

            if (targetCategory) {
                pill.addEventListener('click', event => {
                    event.preventDefault();

                    this.filterByCategory(targetCategory);
                    history.pushState(null, '', `#${targetCategory}`);
                });
            }
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '').trim();

            if (hash) {
                this.filterByCategory(hash);
            }
        });
    }

    filterByCategory(categoryName) {
        this.section.forEach(section => {
            const sectionCat = section.getAttribute('data-category');

            section.style.display =
                sectionCat === categoryName ? 'block' : 'none';
        });

        this.pills.forEach(pill => {
            const pillTarget = pill.getAttribute('data-filter');

            pill.classList.toggle(
                'is-active',
                pillTarget === categoryName
            );
        });
    }
}