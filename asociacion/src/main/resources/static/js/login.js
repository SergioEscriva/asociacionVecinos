async function login() {
    var user = document.getElementById("txtUser").value;
    var password = document.getElementById("txtPassword").value;

    var body = {
        "user": user,
        "password": password
    };

    var config = {
        "method": 'POST',
        "headers": {
            "Content-Type": 'application/json'
        },

        "body": JSON.stringify(body)

    };

    let response = await fetch('/api/auth/login', config);

    let token = await response.text();

    sessionStorage.token = token;

    existe();






}

async function existe() {
    let url = 'http://localhost:8585/api/' + 'auth/existeUsuario';
    let config = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.token
        }
    }


    let response = await fetch(url, config);
    let existe = await response.text();
    if (existe.includes(true)) {
        window.location.href = 'index.html'
    } else {
        window.alert("No existe usuario o datos incorrectos");
    }


}


