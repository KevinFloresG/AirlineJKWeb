import {WScity} from './utils/city.js';
import {loadCountrySelect} from './utils/country.js';

let wscity, GlobalCity;

$(load);

function load(){
    wscity = WScity();
    wscity.onmessage = function(event){processMsgCity(event);};
    $("#deleteCity").on("click", ()=>deleteCity(GlobalCity));
    $("#addNewCityBtn").on("click", ()=>showCityInfoModal(null));
    $("#addCityB").on("click", ()=>addCity());
    $("#updateCityB").on("click", ()=>updateCity(GlobalCity));
    loadCountrySelect("#countries");
}


function sendMsg(obj){
    wscity.send(JSON.stringify(obj));
}

function processMsgCity(evt){
    let request = JSON.parse(evt.data);
    switch(request.type){
        case 'all': 
            listAllCities(request.content); break;
        case 'update': 
            cityTr(request.content, 'upd'); break;
        case 'delete': 
            cityTr(request.content, 'del'); break;
        case 'add': 
            cityTr(request.content, 'add'); break;
    }
}

function listAllCities(list){
    $("#citiesList").html("");
    list.forEach(f =>{
        cityTr(f, 'new');
    });
}

function cityTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('citiesList').deleteRow(index);
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
        let tbody = $("#citiesList");
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />');
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showCityInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteCityModal(f));
        if(type === 'add')
            tbody.prepend(tr);
        else
            tbody.append(tr);
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id);
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showCityInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteCityModal(f));
    }
}


function showCityInfoModal(f){
    if(f === null){
        $('#cityForm').get(0).reset();
        $("#cityModalTitle").text("Agregar Ciudad");
        $("#updateCityB").prop("hidden",true);
        $("#addCityB").prop("hidden", false);
        $("#code").prop("readonly", false);
        $("#countries").prop("disabled", false);
    }else{
        GlobalCity = f;
        $("#cityModalTitle").text("Editar Ciudad");
        $("#code").prop("readonly", true);
        $("#countries").prop("disabled", true);
        $('#code').val(f.id);
        $("#name").val(f.name);
        $("#countries").val(f.country.id);
        $("#updateCityB").prop("hidden", false);
        $("#addCityB").prop("hidden", true);
    }
    $("#addCityModal").modal("show");
}

function showDeleteCityModal(f){
    GlobalCity = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar la siguiente ciudad: "
        +f.id+" - "+ f.name +", "+f.country.name+" ?"
    );
    $("#confirmDeleteModal").modal("show");
}

function deleteCity(city){
    let msg = {
        type:"delete",
        content:JSON.stringify(city)
    };
    sendMsg(msg);
    $("#confirmDeleteModal").modal("hide");
    $("#successModal").modal("show");
}

function updateCity(city){
    let f = {
        id:city.id,
        name: $("#name").val(),
        country: {id:city.country.id,name:city.country.name}
    };
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    sendMsg(msg);
    $("#addCityModal").modal("hide");
    $("#successModal").modal("show");
}

function addCity(){
    var sel = document.getElementById("countries");
    var text= sel.options[sel.selectedIndex].text;
    
    let city = {
        id:$("#code").val(),
        name: $("#name").val(),
        country: {id: $("#countries").val(),name:text}
    };

    let msg = {
        type:"add",
        content:JSON.stringify(city)
    };
    sendMsg(msg);
    $("#addCityModal").modal("hide");
    $("#successModal").modal("show");
}

