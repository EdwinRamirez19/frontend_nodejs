function init() {
    $("#form-login").on('submit', function(e) {
        e.preventDefault()
        sigIn()
    })
}

function sigIn() {
    let login = $("#login").val();
    let password = $("#password").val();
    console.log(password)
    $.ajax({
        url: 'http://localhost:3000/login',
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Content-Type": "multipart/form-data",
        },
        data: { login: login, password: password }
    }).then((res) => {
        console.log(res)
        localStorage.setItem('_token', res.user);
        window.location.href = './views/productos.html'
    }).catch(err => {
        console.log(err.responseJSON.menssage)
        $("#error").text(err.responseJSON.menssage)
    })
}


init();