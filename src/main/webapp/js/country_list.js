import {WScountry} from './utils/country.js';

let wscountry, GlobalCountry;

$(load);

function load(){
    wscountry = WScountry();
    wscountry.onmessage = function(event){processMsgCountry(event);};
    $("#deleteCountry").on("click", ()=>deleteCountry(GlobalCountry));
    $("#addNewCountryBtn").on("click", ()=>showCountryInfoModal(null));
    $("#addCountryB").on("click", ()=>addCountry());
    $("#updateCountryB").on("click", ()=>updateCountry(GlobalCountry));
}


function sendMsg(obj){
    wscountry.send(JSON.stringify(obj));
}

function processMsgCountry(evt){
    let request = JSON.parse(evt.data);
    switch(request.type){
        case 'all': 
            listAllCountries(request.content); break;
        case 'update': 
            countryTr(request.content, 'upd'); break;
        case 'delete': 
            countryTr(request.content, 'del'); break;
        case 'add': 
            countryTr(request.content, 'add'); break;
    }
}

function listAllCountries(list){
    $("#countriesList").html("");
    list.forEach(f =>{
        countryTr(f, 'new');
    });
}

function countryTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('countriesList').deleteRow(index);
    }
    
    let trContent = 
        "<td scope='col' class='col-3'>"+f.id+"</td>"+
        "<td scope='col' class='col-5'>"+f.name+"</td>"+
        "<td class='col-2'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-2'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";

    if(type === 'new' || type === 'add'){
        let tbody = $("#countriesList");
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />');
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showCountryInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteCountryModal(f));
        if(type === 'add')
            tbody.prepend(tr);
        else
            tbody.append(tr);
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id);
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showCountryInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteCountryModal(f));
    }
}


function showCountryInfoModal(f){
    if(f === null){
        $('#countryForm').get(0).reset();
        $("#countryModalTitle").text("Agregar País");
        $("#updateCountryB").prop("hidden",true);
        $("#addCountryB").prop("hidden", false);
        $("#code").prop("readonly", false);
    }else{
        GlobalCountry = f;
        $("#countryModalTitle").text("Editar País");
        $("#code").prop("readonly", true);
        $('#code').val(f.id);
        $("#name").val(f.name);
        $("#updateCountryB").prop("hidden", false);
        $("#addCountryB").prop("hidden", true);
    }
    $("#addCountryModal").modal("show");
}

function showDeleteCountryModal(f){
    GlobalCountry = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar el siguiente país: "
        +f.id+" - "+ f.name +" ?"
    );
    $("#confirmDeleteModal").modal("show");
}

function deleteCountry(country){
    let msg = {
        type:"delete",
        content:JSON.stringify(country)
    };
    sendMsg(msg);
    $("#confirmDeleteModal").modal("hide");
    $("#successModal").modal("show");
}

function updateCountry(country){
    let f = {
        id:country.id,
        name: $("#name").val()
    };
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    console.log(f);
    console.log(msg);
    sendMsg(msg);
    $("#addCountryModal").modal("hide");
    $("#successModal").modal("show");
}

function addCountry(){
    let country = {
        id:$("#code").val(),
        name: $("#name").val()
    };

    let msg = {
        type:"add",
        content:JSON.stringify(country)
    };
    sendMsg(msg);
    $("#addCountryModal").modal("hide");
    $("#successModal").modal("show");
}
