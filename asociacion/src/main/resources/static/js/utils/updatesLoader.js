// Importa una librería de Markdown a HTML (ej. marked.js)
// <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script> en tu HTML

document.addEventListener('DOMContentLoaded', async () => {
    const updatesList = document.getElementById('updates-list');
    if (updatesList) {
        try {
            const response = await fetch('updates.txt');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            const lines = text.split('\n').filter(line => line.trim() !== '');

            lines.forEach(line => {
                const listItem = document.createElement('li');

                listItem.innerHTML = marked.parse(line);
                updatesList.appendChild(listItem);
            });

        } catch (error) {
            console.error('Error al cargar las novedades:', error);
            updatesList.innerHTML = '<li>Error al cargar las novedades.</li>';
        }
    }
});