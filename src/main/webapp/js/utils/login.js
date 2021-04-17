function loginInit(){
    getLoggedUser()
    $("#login-error").hide()
    $("#currentUser").on("click", getOut)
    $("#loginForm").submit(e=>verifyInputs(e, verifyCredencials))
}

function getLoggedUser(){
    let data = sessionStorage.getItem('user')
    if(data !== null){
        
        let userDiv = $("#currentUser"), loginBtn = $("#iniciarS")
        userDiv.text(data+" - Salir")
        userDiv.show()
        loginBtn.text("")
        loginBtn.hide()
        
        let access = sessionStorage.getItem('userAccess')
        
        if(access===0)
            showUserOptions()
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
        sessionStorage.setItem('user', user.name + " " + user.lastname)
        sessionStorage.setItem('username', user.username)
        sessionStorage.setItem('useraccess', user.isAdmin)
        $("#currentUser").html()
        getLoggedUser()
        $("#loginModal").modal("hide")
    }else{
        $("#login-error").show(500)
    }
}

function showUserOptions(){
    $("#userOptionsL").show()
    $("#checkInOpt").show()
    $("#signInOpt").show()
}

export {loginInit};