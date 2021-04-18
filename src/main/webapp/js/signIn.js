

$(load);

function load(){
    $("#registerUser").on("click",e=>verifyInputs(e, addUser));
    $("#continueB").on("click",toIndex);
}

function verifyInputs(event, funct){
    let form = document.getElementById('userForm');
    $("#login-error").hide();
    if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }else{
        funct();
        event.preventDefault();
    }
    form.classList.add('was-validated');
}

async function addUser(){   
    let user = { "username":$("#fUserName").val(),
        name:$("#name").val(),
        lastname:$("#lastName1").val()+" "+$("#lastName2").val(),
        email: $("#email").val(),
        dateOfBirth: new Date($("#dateOfBirth").val()),
        password:$("#fPassword").val(),
        address: $("#address").val(),
        workphone: $("#workphone").val(),
        cellphone: $("#cellphone").val(),
        isAdmin:0};   
    console.log(user);
    let requestBody = {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
    };

    let response = await fetch("/AirlineJK/users/add", requestBody);
    
    
    console.log(response.ok)
    if(response.ok)
        $("#successModal").modal("show");
    else{
        window.alert("Ha ocurrido un error, por favor intente de nuevo o cambie su username.");
    }
}

function toIndex(){
    location.href="/AirlineJKWeb";
}