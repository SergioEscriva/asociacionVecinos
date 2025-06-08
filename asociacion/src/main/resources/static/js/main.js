


async function loadProtectedPage(pagePath) {

    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error("loadProtectedPage() - No hay token JWT en sessionStorage. Redirigiendo al login.");
        window.alert("Tu sesión ha expirado o no has iniciado sesión. Por favor, inicia sesión de nuevo.");
        window.location.href = 'login.html';
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await fetch(`http://localhost:8585/${pagePath}`, {
            method: 'GET',
            headers: headers
        });

        if (response.ok) {
            const htmlContent = await response.text();
            document.getElementById('dynamicontent').innerHTML = htmlContent;
            console.log(`loadProtectedPage() - Contenido de ${pagePath} cargado exitosamente.`);
        } else if (response.status === 403 || response.status === 401) {
            const errorMessage = await response.text();
            console.error(`loadProtectedPage() - Acceso denegado a ${pagePath}. Estado: ${response.status}, Mensaje: ${errorMessage}`);
            window.alert("No tienes permiso para ver esta página o tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
            sessionStorage.removeItem('token');
            window.location.href = 'login.html';
        } else {
            console.error(`loadProtectedPage() - Error al cargar ${pagePath}. Estado: ${response.status}`);
            window.alert(`Error al cargar la página: ${pagePath}. Estado: ${response.status}`);
        }
    } catch (error) {
        console.error(`loadProtectedPage() - Error de red al cargar ${pagePath}:`, error);
        window.alert("No se pudo conectar al servidor para cargar la página.");
    }
}


function logout() {
    sessionStorage.removeItem('token');
    console.log("Sesión cerrada. Token eliminado.");
    window.location.href = 'login.html';
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded - main.js cargado.");

    // Manejar clics en los enlaces del sidebar
    document.getElementById('sidebar').addEventListener('click', async (event) => {
        const target = event.target.closest('a.nav-link, a.collapse-item');
        if (target && target.hasAttribute('data-section')) {
            event.preventDefault();

            const section = target.getAttribute('data-section');
            let pageToLoad = '';

            switch (section) {
                case 'index':
                    pageToLoad = 'index.html';
                    break;
                case 'memberIndex':
                    pageToLoad = 'memberIndex.html';
                    break;
                case 'activityIndex':
                    pageToLoad = 'activityIndex.html';
                    break;
                case 'FeesByDate':
                    pageToLoad = 'FeesByDate.html';
                    break;
                case 'memberList':
                    pageToLoad = 'memberList.html';
                    break;
                case 'activitiesList':
                    pageToLoad = 'activitiesList.html';
                    break;
                case 'payList':
                    pageToLoad = 'payList.html';
                    break;
                case 'configIndex':
                    pageToLoad = 'configIndex.html';
                    break;
                default:
                    console.warn(`Sección desconocida: ${section}`);
                    return;
            }

            if (pageToLoad) {
                await loadProtectedPage(pageToLoad);
            }
        }
    });

    // Lógica para cargar la página por defecto al cargar index.html
    const storedToken = sessionStorage.getItem('token');


    if (storedToken) {
        loadProtectedPage('index.html');
    } else {
        window.location.href = 'login.html';
    }

    document.getElementById('fecha').textContent = new Date().toLocaleDateString();
});
