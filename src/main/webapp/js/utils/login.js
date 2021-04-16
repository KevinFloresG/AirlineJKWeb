function loginInit(){
    getLoggedUser()
    $("#login-error").hide()
    $("#currentUser").on("click", getOut)
    $("#loginForm").submit(e=>verifyInputs(e, verifyCredencials))
}

function getLoggedUser(){
    let data = sessionStorage.getItem('userName')
    //let access = sessionStorage.getItem('userAccess')
    if(data !== null){
        let userDiv = $("#currentUser"), loginBtn = $("#iniciarS")
        userDiv.text(data+" - Salir")
        userDiv.show()
        loginBtn.text("")
        loginBtn.hide()
    }
}

function getOut(){
    sessionStorage.clear()
    location.href="/AirlineJKWeb"
}

async function verifyCredencials(){
    let user = { username:$("#username").val(), password:$("#password").val()}
    let requestBody = {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
    }
    const response = await fetch("/AirlineJK/users/login", requestBody)
    const result = await response.json()
    endLogin(result)
}

function verifyInputs(event, f){
    let form = document.getElementById('loginForm')
    $("#login-error").hide()
    if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
    }else{
        f()
        event.preventDefault()
    }
    form.classList.add('was-validated')
}

async function endLogin(x){
    if(x){
        let id = $("#username").val();
        const response = await fetch("/AirlineJK/users/get?id="+id)
        const user = await response.json()
        sessionStorage.setItem('userName', user.name + " " + user.lastname)
        sessionStorage.setItem('userAccess', user.isAdmin)
        $("#currentUser").html()
        getLoggedUser()
        $("#loginModal").modal("hide")
    }else{
        $("#login-error").show(500)
    }
}

export {loginInit, getLoggedUser};