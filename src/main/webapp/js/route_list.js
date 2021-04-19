import {WSroute} from './utils/route.js';
import {loadCountrySelect} from './utils/country.js';

let wsroute, GlobalRoute;

$(load);

function load(){
    wsroute = WSroute();
    wsroute.onmessage = function(event){processMsgRoute(event);};
    $("#deleteRoute").on("click", ()=>deleteRoute(GlobalRoute));
    $("#addNewRouteBtn").on("click", ()=>showRouteInfoModal(null));
    $("#addRouteB").on("click", ()=>addRoute());
    $("#updateRouteB").on("click", ()=>updateRoute(GlobalRoute));
    loadCountrySelect("#countries");
}


function sendMsg(obj){
    wsroute.send(JSON.stringify(obj));
}

function processMsgRoute(evt){
    let request = JSON.parse(evt.data);
    switch(request.type){
        case 'all': 
            listAllRoutes(request.content); break;
        case 'update': 
            routeTr(request.content, 'upd'); break;
        case 'delete': 
            routeTr(request.content, 'del'); break;
        case 'add': 
            routeTr(request.content, 'add'); break;
    }
}

function listAllRoutes(list){
    $("#aRoutesList").html("");
    list.forEach(f =>{
        routeTr(f, 'new');
    });
}

function routeTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('routesList').deleteRow(index);
    }
    
    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-3'>"+f.name+"</td>"+
        "<td scope='col' class='col-3'>"+f.country.name+"</td>"+
        "<td class='col-2'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-2'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";

    if(type === 'new' || type === 'add'){
        let tbody = $("#routesList");
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />');
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showRouteInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteRouteModal(f));
        if(type === 'add')
            tbody.prepend(tr);
        else
            tbody.append(tr);
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id);
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showRouteInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteRouteModal(f));
    }
}


function showRouteInfoModal(f){
    if(f === null){
        $('#routeForm').get(0).reset();
        $("#routeModalTitle").text("Agregar Ciudad");
        $("#updateRouteB").prop("hidden",true);
        $("#addRouteB").prop("hidden", false);
        $("#code").prop("readonly", false);
        $("#countries").prop("disabled", false);
    }else{
        GlobalRoute = f;
        $("#routeModalTitle").text("Editar Ciudad");
        $("#code").prop("readonly", true);
        $("#countries").prop("disabled", true);
        $('#code').val(f.id);
        $("#name").val(f.name);
        $("#countries").val(f.country.id);
        $("#updateRouteB").prop("hidden", false);
        $("#addRouteB").prop("hidden", true);
    }
    $("#addRouteModal").modal("show");
}

function showDeleteRouteModal(f){
    GlobalRoute = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar la siguiente ciudad: "
        +f.id+" - "+ f.name +", "+f.country.name+" ?"
    );
    $("#confirmDeleteModal").modal("show");
}

function deleteRoute(route){
    let msg = {
        type:"delete",
        content:JSON.stringify(route)
    };
    sendMsg(msg);
    $("#confirmDeleteModal").modal("hide");
    $("#successModal").modal("show");
}

function updateRoute(route){
    let f = {
        id:route.id,
        name: $("#name").val(),
        country: {id:route.country.id,name:route.country.name}
    };
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    sendMsg(msg);
    $("#addRouteModal").modal("hide");
    $("#successModal").modal("show");
}

function addRoute(){
    var sel = document.getElementById("countries");
    var text= sel.options[sel.selectedIndex].text;
    
    let route = {
        id:$("#code").val(),
        name: $("#name").val(),
        country: {id: $("#countries").val(),name:text}
    };

    let msg = {
        type:"add",
        content:JSON.stringify(route)
    };
    sendMsg(msg);
    $("#addRouteModal").modal("hide");
    $("#successModal").modal("show");
}

