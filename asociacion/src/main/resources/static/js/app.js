document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const links = document.querySelectorAll('#sidebar a');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();


            const linkElement = e.currentTarget;
            const section = linkElement.getAttribute('data-section');

            if (section) {
                loadContent(section);
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
            const { initActivityIndex } = await import('/js/ActivityManager.js');
            initActivityIndex();
        },
    };

    function loadContent(section) {
        fetch(`${section}.html`)
            .then(response => response.text())
            .then(html => {
                content.innerHTML = html;
                document.body.setAttribute('data-page', section);

                // Llama al inicializador de la sección cargada
                if (pageInitializers[section]) {
                    pageInitializers[section]();
                }
            })
            .catch(error => {
                content.innerHTML = `<p>Error al cargar el contenido: ${section}.html no encontrado.</p>`;
                console.error('Error al cargar el contenido:', error);
            });
    }

    // Opción para cargar contenido inicial si se desea
    // loadContent('index');
});
