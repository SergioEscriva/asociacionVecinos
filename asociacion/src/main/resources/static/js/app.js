document.addEventListener('DOMContentLoaded', () => {

    const content = document.getElementById('content');
    const links = document.querySelectorAll('#sidebar a[data-section]');

    const pageInitializers = {
        memberIndex: async (memberId = null) => {
            const { initMemberIndex } = await import('/js/main.js');
            initMemberIndex(memberId);
            document.body.removeAttribute('data-member-id');
        },
        activityIndex: async () => {
            const { initActivityIndex } = await import('/js/main.js');
            initActivityIndex();
        },
        memberList: async () => {
            const { initListsIndex } = await import('/js/main.js');
            initListsIndex();
        },
        payList: async () => {
            const { initListsIndex } = await import('/js/main.js');
            initListsIndex();
        },
        activitiesList: async () => {
            const { initListsIndex } = await import('/js/main.js');
            initListsIndex();
        },
        FeesByDate: async () => {
            const { initFeesByDateIndex } = await import('/js/main.js');
            initFeesByDateIndex();
        },
        configIndex: async () => {
            const { initConfigIndex } = await import('/js/main.js');
            initConfigIndex();
        }
    };

    function internalLoadContent(section, idList, memberId = null) {
        fetch(`${section}.html`)
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                document.body.setAttribute('data-page', section);
                document.body.setAttribute('data-page-selection', idList);

                if (memberId !== null) {
                    document.body.setAttribute('data-member-number', memberId);
                } else {
                    document.body.removeAttribute('data-member-number');
                }

                updateActiveMenuIcons(section);

                if (pageInitializers[section]) {

                    if (section === 'memberIndex') {

                        pageInitializers[section](memberId);
                    } else {
                        pageInitializers[section]();
                    }
                }
            })
            .catch(error => {
                content.innerHTML = `<p>Error al cargar el contenido: ${section}.html no encontrado.</p>`;
                console.error('Error al cargar el contenido:', error);
            });
    }

    window.App = window.App || {};
    window.App.loadContent = internalLoadContent;


    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const linkElement = e.currentTarget;
            const section = linkElement.getAttribute('data-section');

            if (section === 'index') {
                window.location.reload();
            }

            const buttonList = linkElement.getAttribute('id')

            if (section) {

                window.App.loadContent(section, buttonList);
            } else {
                console.error("Error: 'data-section' no está definido en el enlace.");
            }
        });
    });
    function updateActiveMenuIcons(activeSection) {
        const menuItems = document.querySelectorAll('#sidebar .nav-item');
        menuItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const section = link.getAttribute('data-section');
            if (section === activeSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
});