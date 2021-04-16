function loaded(){
    getLoggedUser();
    $("#currentUser").on("click", getOut);
}
function getLoggedUser(){
    var data = sessionStorage.getItem('userName');
    if(data == null)
        location.href="AccessDenied.html";
    $("#currentUser").text(data+" - Salir");
    document.getElementsByTagName("BODY")[0].style.display = "block";
}
function getOut(){
    sessionStorage.clear();
    location.href="login.html";
}
$(loaded);

