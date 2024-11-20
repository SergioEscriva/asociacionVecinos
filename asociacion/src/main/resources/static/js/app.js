document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const links = document.querySelectorAll('#sidebar a[data-section]');

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
                loadContent(section, buttonList);
            } else {
                console.error("Error: 'data-section' no está definido en el enlace.");
            }
        });
    });

    const pageInitializers = {
        memberIndex: async () => {
            const { initMemberIndex } = await import('/js/main.js');
            initMemberIndex();
        },
        activityIndex: async () => {
            const { initActivityIndex } = await import('/js/main.js');
            initActivityIndex();
        },
        memberList: async () => {
            const { initListsIndex } = await import('/js/main.js');
            initListsIndex();
        },
        activitiesList: async () => {
            const { initListsIndex } = await import('/js/main.js');
            initListsIndex();

        }

    };

    function loadContent(section, idList) {
        fetch(`${section}.html`)
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                document.body.setAttribute('data-page', section);
                document.body.setAttribute('data-page-selection', idList);

                updateActiveMenuIcons(section);

                if (pageInitializers[section]) {
                    pageInitializers[section]();
                }
            })
            .catch(error => {
                content.innerHTML = `<p>Error al cargar el contenido: ${section}.html no encontrado.</p>`;
                console.error('Error al cargar el contenido:', error);
            });
    }

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
