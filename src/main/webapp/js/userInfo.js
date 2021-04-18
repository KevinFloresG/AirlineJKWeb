import {toDate} from './utils/dates.js';

$(load);

function load(){
    loadUserInfo();
    $("#updateUser").on("click",e=>verifyInputs(e, updUser));
    $("#enableUpdate").on("click",enableUpd);
    $("#cancelUpd").on("click",cancelUpd);
}

async function loadUserInfo(){
    var cUser = sessionStorage.getItem('username');
    if(cUser){
        
        let response = await fetch("/AirlineJK/users/get?id="+cUser);
        let user = await response.json();
        console.log(user);
        $("#username").val(user.username);
        $("#name").val(user.name);
        var lastName = user.lastname;
        var lN = lastName.split(" ");
        $("#lastName1").val(lN[0]);
        $("#lastName2").val(lN[1]);
        $("#email").val(user.email),
        $("#dateOfBirth").val(toDate(user.dateOfBirth));
        $("#address").val(user.address);
        $("#workphone").val(user.workphone);
        $("#cellphone").val(user.cellphone);         
    }    
    else
        location.href="/AirlineJKWeb/AccessDenied.html";
           
}

function verifyInputs(event, funct){
    let form = document.getElementById('userPInfoForm');
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

async function updUser(){   
    let user = { 
        username:$("#fUserName").val(),
        email: $("#email").val(),
        address: $("#address").val(),
        workphone: $("#workphone").val(),
        cellphone: $("#cellphone").val()};   
    
    let requestBody = {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
    };

    let response = await fetch("/AirlineJK/users/update/info", requestBody);
    
    if(response.ok)
        $("#successModal").modal("show");
    else
        window.alert("Ha ocurrido un error, por favor intente de nuevo más tarde.");
    
    $("#email").attr("readonly",true);
    $("#address").attr("readonly",true);
    $("#workphone").attr("readonly",true);
    $("#cellphone").attr("readonly",true);
    $("#enableUpdate").attr("hidden",false);
    $("#updateUser").attr("hidden",true);
    $("#cancelUpd").attr("hidden",true);
  
}

function enableUpd(){
    $("#email").attr("readonly",false);
    $("#address").attr("readonly",false);
    $("#workphone").attr("readonly",false);
    $("#cellphone").attr("readonly",false);
    $("#enableUpdate").attr("hidden",true);
    $("#updateUser").attr("hidden",false);
    $("#cancelUpd").attr("hidden",false);
}

function cancelUpd(){
    loadUserInfo();
    $("#email").attr("readonly",true);
    $("#address").attr("readonly",true);
    $("#workphone").attr("readonly",true);
    $("#cellphone").attr("readonly",true);
    $("#enableUpdate").attr("hidden",false);
    $("#updateUser").attr("hidden",true);
    $("#cancelUpd").attr("hidden",true);
}