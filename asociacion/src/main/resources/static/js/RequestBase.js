export class RequestBase {
    static async request(method, url, body = null) {
        try {
            const config = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.token
                }
            };

            if (body) {
                config.body = JSON.stringify(body);
            }

            const response = await fetch(url, config);
            const contentType = response.headers.get("content-type");

            if (response.status === 401 || response.status === 403) {
                sessionStorage.removeItem('token');
                window.location.href = "/login.html";
                return null;
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error en la respuesta:", errorText);
                throw new Error("Error en la petición");
            }

            if (contentType && contentType.includes("application/json")) {
                return await response.json();
            } else {
                const text = await response.text();
                console.warn("Respuesta no es JSON:", text);
                return null;
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            return null;
        }
    }

    static _getRequest(url) {
        return this.request('GET', url);
    }

    static _postRequest(url, body) {
        return this.request('POST', url, body);
    }

    static _putRequest(url, body) {
        return this.request('PUT', url, body);
    }

    static _delRequest(url) {
        return this.request('DELETE', url);
    }
}
