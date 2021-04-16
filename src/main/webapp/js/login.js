$(load);

let access = false;

function load(){

    $("#login-error").hide();
    $("#loginForm").submit(e=>verifyInputs(e, verifyCredencials));
}

function verifyCredencials(){
    let user = { id:$("#username").val(), password:$("#password").val()};
    $.ajax(
        {
            type:"POST",
            url:"/api/v1/login",
            data:JSON.stringify(user),
            contentType:"application/json"
        }
    ).then(a => endLogin(a), ()=>endLogin(false));
}
/*function endLogin(x){
    x?getUserData():$("#login-error").show(500)
}*/
function endLogin(x){
    x?getUserData():$("#login-error").show(500)
}
function getUserData(){

    let id = $("#username").val();
    $.ajax({type: "GET", url:"/api/v1/user/"+id,contentType: "application/json"})
    .then( (user)=>{userStorage(user);},
           (error)=>{ 
               //errorMessage(error.status,$("#errorDiv"));
           });  
}
function userStorage(user){
    sessionStorage.setItem('userName', user.name + " " + user.lastName_1);
    location.href="index.html";
}
function verifyInputs(event, f){
    let form = document.getElementById('loginForm');
    $("#login-error").hide();
    if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
    }else{
        f();
        event.preventDefault();
    }
    form.classList.add('was-validated')
}