export class RequestFile {
    static async downloadPdf(url, filename) {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': sessionStorage.token
                }
            });

            if (response.status === 401 || response.status === 403) {
                sessionStorage.removeItem('token');
                window.location.href = "/login.html";
                return;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la descarga:", errorText);
                alert("Error al descargar el archivo");
                return;
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Error en la descarga:", error);
        }
    }
}
