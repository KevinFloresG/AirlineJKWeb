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
        
        var access = sessionStorage.getItem('useraccess')

        if(access==="0")
            showUserOptions();
        else
            showAdminOptions();
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
    $("#signInOpt").attr("hidden",true);
    $('#userOptionsL').removeAttr('hidden');
    $('#checkInOpt').removeAttr('hidden');
    $('#userReservationO').removeAttr('hidden');
    
// show reservation button 

}

function showAdminOptions(){
    
    $("#signInOpt").attr("hidden",true);
    $("#userFlightList").attr("hidden",true);
    $("#publicRoutesList").attr("hidden",true);
    $('#userOptionsL').removeAttr('hidden');
    $('#adminFlightList').removeAttr('hidden');
    $('#planesList').removeAttr('hidden');
    $('#routesList').removeAttr('hidden');
    $('#destinationsList').removeAttr('hidden');
    $('#reports').removeAttr('hidden');


}

export {loginInit};