import {WSairplaneType} from './utils/planeType.js';

let wsairplaneType, GlobalAirplaneType;

$(load);

function load(){
    wsairplaneType = WSairplaneType();
    wsairplaneType.onmessage = function(event){processMsgAirplaneType(event);};
    $("#deleteAirplaneType").on("click", ()=>deleteAirplaneType(GlobalAirplaneType));
    $("#addNewAirplaneTypeBtn").on("click", ()=>showAirplaneTypeInfoModal(null));
    $("#addAirplaneTypeB").on("click", ()=>addAirplaneType());
    $("#updateAirplaneTypeB").on("click", ()=>updateAirplaneType(GlobalAirplaneType));
    loadCountrySelect("#countries");
}


function sendMsg(obj){
    wsairplaneType.send(JSON.stringify(obj));
}

function processMsgAirplaneType(evt){
    let request = JSON.parse(evt.data);
    switch(request.type){
        case 'all': 
            listAllAirplaneTypes(request.content); break;
        case 'update': 
            airplaneTypeTr(request.content, 'upd'); break;
        case 'delete': 
            airplaneTypeTr(request.content, 'del'); break;
        case 'add': 
            airplaneTypeTr(request.content, 'add'); break;
    }
}

function listAllAirplaneTypes(list){
    $("#airplaneTypesList").html("");
        if (list.length === 0){
        var tr =$("<tr />");
        tr.html("<td class='font-italic font-weight-bold'>NO HAY REGISTROS</td>");
        $("#airplaneTypesList").append(tr);
    }list.forEach(f =>{
        airplaneTypeTr(f, 'new');
    });
}

function airplaneTypeTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('airplaneTypesList').deleteRow(index);
    }
    
    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-2'>"+f.brand+"</td>"+
        "<td scope='col' class='col-2'>"+f.model+"</td>"+
        "<td scope='col' class='col-2'>"+f.passengersQ+"</td>"+
        "<td class='col-2'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-2'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";

    if(type === 'new' || type === 'add'){
        let tbody = $("#airplaneTypesList");
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />');
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showAirplaneTypeInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteAirplaneTypeModal(f));
        if(type === 'add')
            tbody.prepend(tr);
        else
            tbody.append(tr);
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id);
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showAirplaneTypeInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteAirplaneTypeModal(f));
    }
}


function showAirplaneTypeInfoModal(f){
    if(f === null){
        $('#airplaneTypeForm').get(0).reset();
        $("#airplaneTypeModalTitle").text("Agregar un Tipo de Avión");
        $("#updateAirplaneTypeB").prop("hidden",true);
        $("#addAirplaneTypeB").prop("hidden", false);
        $("#id").prop("readonly", false);

    }else{
        GlobalAirplaneType = f;
        $("#airplaneTypeModalTitle").text("Editar Tipo de Avión");
        $("#id").prop("readonly", true);
        $('#id').val(f.id);
        $("#brand").val(f.brand);
        $("#model").val(f.model);
        $("#rowQ").val(f.rowQ);
        $("#columnQ").val(f.columnQ);
        $("#updateAirplaneTypeB").prop("hidden", false);
        $("#addAirplaneTypeB").prop("hidden", true);
    }
    $("#addAirplaneTypeModal").modal("show");
}

function showDeleteAirplaneTypeModal(f){
    GlobalAirplaneType = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar el siguiente tipo de avión: "
        +f.id+" - "+ f.brand +" "+f.brand+" - "+f.passengersQ+" A. ?"
    );
    $("#confirmDeleteModal").modal("show");
}

function deleteAirplaneType(airplaneType){
    let msg = {
        type:"delete",
        content:JSON.stringify(airplaneType)
    };
    sendMsg(msg);
    $("#confirmDeleteModal").modal("hide");
    $("#successModal").modal("show");
}

function updateAirplaneType(airplaneType){

    var rows = parseInt($("#rowQ").val());
    var columns = parseInt($("#columnQ").val());
    
    let f = {
        id:airplaneType.id,
        brand: $("#brand").val(),
        model: $("#model").val(),
        passengersQ: (rows*columns),
        rowQ: rows,
        columnQ: columns  
    };
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    sendMsg(msg);
    $("#addAirplaneTypeModal").modal("hide");
    $("#successModal").modal("show");
}

function addAirplaneType(){

    var rows = parseInt($("#rowQ").val());
    var columns = parseInt($("#columnQ").val());
    
    let airplaneType = {
        id:$("#id").val(),
        brand: $("#brand").val(),
        model: $("#model").val(),
        passengersQ: (rows*columns),
        rowQ: rows,
        columnQ: columns 
    };

    let msg = {
        type:"add",
        content:JSON.stringify(airplaneType)
    };
    sendMsg(msg);
    $("#addAirplaneTypeModal").modal("hide");
    $("#successModal").modal("show");
}

