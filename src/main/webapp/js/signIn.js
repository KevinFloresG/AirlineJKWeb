

$(load);

function load(){
    $("#userForm").submit(e=>verifyInputs(e, addUser));
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
    let user = { username:$("#fUserName").val(),
        name:$("#name").val(),
        lastname:$("#lastName1").val()+" "+$("#lastName2").val(),
        email: $("#email").val(),
        dateOfBirth: $("#dateOfBirth").val(),
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

    const response = await fetch("/AirlineJK/users/add", requestBody);
    
    if(response.ok)
        $("#successModal").show();
    else{
        console.log(response.status);
        console.log(response.statusText);
    }
}

function toIndex(){
    location.href="/AirlineJKWeb";
}