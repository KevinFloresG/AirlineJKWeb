import {WSflight, typeOfFlight, datesOfFlight} from './utils/flight.js'

let wsflight, GlobalFlight;

$(load)

function load(){
    wsflight = WSflight()
    wsflight.onmessage = function(event){processMsg(event)}
    $("#deleteFlight").on("click", ()=>deleteFlight(GlobalFlight))
}

function sendMsg(obj){
    wsflight.send(JSON.stringify(obj))
}

function processMsg(evt){
    let request = JSON.parse(evt.data)
    switch(request.type){
        case 'all': 
            listAllFlights(request.content); break;
        case 'update': 
            flightTr(request.content, 'upd'); break;
        case 'delete': 
            flightTr(request.content, 'del'); break;
    }
}

function listAllFlights(list){
    $("#flightsList").html("")
    list.forEach(f =>{
        flightTr(f, 'new')
    })
}

function flightTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex
        document.getElementById('flightsList').deleteRow(index)
    }
    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-2'>"+typeOfFlight(f)+"</td>"+
        "<td scope='col' class='col-2'>"+f.route.origin.name+"</td>"+
        "<td scope='col' class='col-2'>"+f.route.destination.name+"</td>"+
        "<td scope='col' class='col-2'>"+datesOfFlight(f)+"</td>"+
        "<td class='col-1'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-1'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";
    if(type === 'new'){
        let tbody = $("#flightsList")
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />')
        tr.html(trContent)
        tr.find("#edit-"+f.id).on("click",()=>showEditFlightModal(f))
        tr.find("#del-"+f.id).on("click",()=>showDeleteFlightModal(f))
        tbody.append(tr)
    }
}


function showDeleteFlightModal(f){
    GlobalFlight = f
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar el siguiente vuelo: "
        +f.id+" - "+ f.route.id +" - "+ datesOfFlight(f) +" ?"
    )
    $("#confirmDeleteModal").modal("show")
}

function deleteFlight(flight){
    let msg = {
        "type":"delete",
        "content":JSON.stringify(flight)
    }
    sendMsg(msg)
    $("#confirmDeleteModal").modal("hide")
    $("#successModal").modal("show")
}
