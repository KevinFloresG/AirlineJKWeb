import {WSairplane} from './utils/airplane.js';
import {loadPlaneTypeSelect} from './utils/planeType.js';

let wsairplane, GlobalAirplane;

$(load);

function load(){
    wsairplane = WSairplane();
    wsairplane.onmessage = function(event){processMsgAirplane(event);};
    $("#deleteAirplane").on("click", ()=>deleteAirplane(GlobalAirplane));
    $("#addNewAirplaneBtn").on("click", ()=>showAirplaneInfoModal(null));
    $("#addAirplaneB").on("click", ()=>addAirplane());
    $("#updateAirplaneB").on("click", ()=>updateAirplane(GlobalAirplane));
    loadPlaneTypeSelect("#types");
}


function sendMsg(obj){
    wsairplane.send(JSON.stringify(obj));
}

function processMsgAirplane(evt){
    let request = JSON.parse(evt.data);
    switch(request.type){
        case 'all': 
            listAllAirplanes(request.content); break;
        case 'update': 
            airplaneTr(request.content, 'upd'); break;
        case 'delete': 
            airplaneTr(request.content, 'del'); break;
        case 'add': 
            airplaneTr(request.content, 'add'); break;
    }
}

function listAllAirplanes(list){
    $("#airplanesList").html("");
    if (list.length === 0){
        var tr =$("<tr />");
        tr.html("<td class='font-italic font-weight-bold'>NO HAY REGISTROS</td>");
        $("#airplanesList").append(tr);
    }
    list.forEach(f =>{
        airplaneTr(f, 'new');
    });
}

function airplaneTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('airplanesList').deleteRow(index);
    }
    
    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-2'>"+f.airplaneType.id+"</td>"+
        "<td scope='col' class='col-2'>"+f.airplaneType.brand+"</td>"+
        "<td scope='col' class='col-1'>"+f.anno+"</td>"+
        "<td scope='col' class='col-1'>"+f.airplaneType.passengersQ+" A."+"</td>"+
        "<td class='col-2'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-2'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";

    if(type === 'new' || type === 'add'){
        let tbody = $("#airplanesList");
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />');
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showAirplaneInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteAirplaneModal(f));
        if(type === 'add')
            tbody.prepend(tr);
        else
            tbody.append(tr);
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id);
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showAirplaneInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteAirplaneModal(f));
    }
}


function showAirplaneInfoModal(f){
    if(f === null){
        $('#airplaneForm').get(0).reset();
        $("#airplaneModalTitle").text("Agregar Avión");
        $("#updateAirplaneB").prop("hidden",true);
        $("#addAirplaneB").prop("hidden", false);
        $("#id").prop("readonly", false);

    }else{
        GlobalAirplane = f;
        $("#airplaneModalTitle").text("Editar Avión");
        $("#id").prop("readonly", true);
        $('#id').val(f.id);
        $("#types").val(f.airplaneType.id);
        $("#year").val(f.anno);
        $("#updateAirplaneB").prop("hidden", false);
        $("#addAirplaneB").prop("hidden", true);
    }
    $("#addAirplaneModal").modal("show");
}

function showDeleteAirplaneModal(f){
    GlobalAirplane = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar el siguiente avión: "
        +f.id+" - "+ f.airplaneType.id +" - "+f.airplaneType.passengersQ+" ?"
    );
    $("#confirmDeleteModal").modal("show");
}

function deleteAirplane(airplane){
    let msg = {
        type:"delete",
        content:JSON.stringify(airplane)
    };
    sendMsg(msg);
    $("#confirmDeleteModal").modal("hide");
    $("#successModal").modal("show");
}

function updateAirplane(airplane){
    var sel = document.getElementById("types");
    var text= sel.options[sel.selectedIndex].text;
    var textS = text.split("-");
    var seatText =  textS[2];
    var nmU = seatText.split(" ");

    let f = {
        id:airplane.id,
        anno: $("#year").val(),
        airplaneType: {id:$("#types").val(),brand:textS[0],passengersQ:parseInt(nmU[0])}
    };
    
    console.log(f);
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    sendMsg(msg);
    $("#addAirplaneModal").modal("hide");
    $("#successModal").modal("show");
}

function addAirplane(){
    
    var sel = document.getElementById("types");
    var text= sel.options[sel.selectedIndex].text;
    var textS = text.split("-");
    var seatText =  textS[2];
    var nmU = seatText.split(" ");
    console.log(nmU);
            
    let airplane = {
        id:$("#id").val(),
        anno: $("#year").val(),
        airplaneType: {id:$("#types").val(),brand:textS[0],passengersQ:parseInt(nmU[0])}
    };

    let msg = {
        type:"add",
        content:JSON.stringify(airplane)
    };
    sendMsg(msg);
    $("#addAirplaneModal").modal("hide");
    $("#successModal").modal("show");
}

