import {WSroute} from './utils/route.js';
import {loadCitySelect} from './utils/city.js';
import {loadAirplaneSelect} from './utils/airplane.js';
import {loadScheduleSelect} from './utils/schedule.js';

let wsroute, GlobalRoute;

$(load);

function load(){
    wsroute = WSroute();
    wsroute.onmessage = function(event){processMsgRoute(event);};
    $("#deleteRoute").on("click", ()=>deleteRoute(GlobalRoute));
    $("#addNewRouteBtn").on("click", ()=>showRouteInfoModal(null));
    $("#addRouteB").on("click", ()=>addRoute());
    $("#updateRouteB").on("click", ()=>updateRoute(GlobalRoute));
    loadCitySelect("#origin");
    loadCitySelect("#destination");
    loadAirplaneSelect("#plane");
    loadScheduleSelect("#schedules");
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
    if (list.length === 0){
        var tr =$("<tr />");
        tr.html("<td class='font-italic font-weight-bold'>NO HAY REGISTROS</td>");
        $("#aRoutesList").append(tr);
    }else
        list.forEach(f =>{
            routeTr(f, 'new');
        });
}

function routeTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('aRoutesList').deleteRow(index);
    }
    
    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-3'>"+f.origin.name+", "+f.origin.country.name+"</td>"+
        "<td scope='col' class='col-3'>"+f.destination.name+", "+f.destination.country.name+"</td>"+
        "<td scope='col' class='col-2'>"+f.schedule.weekday+" "+f.schedule.departureTime+"</td>"+
        "<td class='col-1'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-1'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";

    if(type === 'new' || type === 'add'){
        let tbody = $("#aRoutesList");
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
        $("#routeModalTitle").text("Agregar una Ruta");
        $("#updateRouteB").prop("hidden",true);
        $("#addRouteB").prop("hidden", false);
        $("#id").prop("readonly", false);
        $("#origin").prop("disabled", false);
        $("#destination").prop("disabled", false);

    }else{
        GlobalRoute = f;
        $("#routeModalTitle").text("Editar la Ruta");
        $("#id").prop("readonly", true);
        $("#origin").prop("disabled", true);
        $("#destination").prop("disabled", true);
        $('#id').val(f.id);
        $("#origin").val(f.origin.id);
        $("#destination").val(f.destination.id);
        $("#schedules").val(f.schedule.id);
        $("#plane").val(f.airplaneId.id);
        $("#hours").val(f.durationhours);
        $("#minutes").val(f.durationminutes);
        $("#updateRouteB").prop("hidden", false);
        $("#addRouteB").prop("hidden", true);
    }
    $("#addRouteModal").modal("show");
}

function showDeleteRouteModal(f){
    GlobalRoute = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar la siguiente ruta: "
        +f.id+": "+ f.origin.name+", "+f.origin.country.name +" - "+f.destination.name+" - "+f.schedule.weekday+" "+f.schedule.departureTime+" ?"
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
        origin: { id: $("#origin").val() },
        destination: { id: $("#destination").val()},
        schedule:{id: $("#schedules").val()},
        airplaneId: {id: $("#plane").val()},
        durationhours: $("#hours").val(),
        durationminutes:$("#minutes").val()
    };
    
    console.log(f);
    
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    sendMsg(msg);
    $("#addRouteModal").modal("hide");
    $("#successModal").modal("show");
}

function addRoute(){
    var selO = document.getElementById("origin");
    var textO = selO.options[selO.selectedIndex].text;
    var selD = document.getElementById("destination");
    var textD = selD.options[selD.selectedIndex].text;
    var selS = document.getElementById("schedules");
    var textS = selS.options[selS.selectedIndex].text;
    /*var selP = document.getElementById("countries");
    var textP= selP.options[selP.selectedIndex].text;*/

    
    let route = {
        id:$("#id").val(),
        name: $("#name").val(),
        origin: { id: $("#origin").val(),name:textO },
        destination: { id: $("#destination").val(),name:textD},
        schedule:{id: $("#schedules").val(),weekday:textS},
        airplaneId: {id: $("#plane").val()},
        durationhours: $("#hours").val(),
        durationminutes:$("#minutes").val()
    };
    
    console.log(route);
    
    let msg = {
        type:"add",
        content:JSON.stringify(route)
    };
    sendMsg(msg);
    $("#addRouteModal").modal("hide");
    $("#successModal").modal("show");
}

