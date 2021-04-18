import {WSflight, typeOfFlight, datesOfFlight} from './utils/flight.js';
import {toDate} from './utils/dates.js';

let wsflight, GlobalFlight;

$(load)

function load(){
    wsflight = WSflight()
    wsflight.onmessage = function(event){processMsgFlight(event)}
    $("#deleteFlight").on("click", ()=>deleteFlight(GlobalFlight))
    $("#addNewFlightBtn").on("click", ()=>showFlighInfoModal(null))
    $("#flightRoute").on("change", ()=>updateASeats())
    $("#addFlightB").on("click", ()=>addFlight())
    $("#updateFlightB").on("click", ()=>updateFlight(GlobalFlight))
}

async function updateASeats(){
    let id = $("#flightRoute").val()
    if(id==="") {
        $("#aSeats").val(0)
        return;
    }
    let response = await fetch("/AirlineJK/routes/get?id="+id)
    let route = await response.json()
    let planeType = route.airplaneId.airplaneType
    $("#aSeats").val(planeType.rowQ * planeType.columnQ)
}

function sendMsg(obj){
    wsflight.send(JSON.stringify(obj))
}

function processMsgFlight(evt){
    let request = JSON.parse(evt.data)
    switch(request.type){
        case 'all': 
            listAllFlights(request.content); break;
        case 'update': 
            flightTr(request.content, 'upd'); break;
        case 'delete': 
            flightTr(request.content, 'del'); break;
        case 'add': 
            flightTr(request.content, 'add'); break;
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
        "<td scope='col' class='col-2'>"+datesOfFlight(f, toDate)+"</td>"+
        "<td class='col-1'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-1'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";
    if(type === 'new' || type === 'add'){
        let tbody = $("#flightsList")
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />')
        tr.html(trContent)
        tr.find("#edit-"+f.id).on("click",()=>showFlighInfoModal(f))
        tr.find("#del-"+f.id).on("click",()=>showDeleteFlightModal(f))
        if(type === 'add')
            tbody.prepend(tr)
        else
            tbody.append(tr)
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id)
        tr.html(trContent)
        tr.find("#edit-"+f.id).on("click",()=>showFlighInfoModal(f))
        tr.find("#del-"+f.id).on("click",()=>showDeleteFlightModal(f))
    }
}

//<option value="CR-USA">San Jose, CR - Nueva York, USA </option>
function showFlighInfoModal(f){
    if(f === null){
        $('#FlightForm').get(0).reset()
        $("#flightRoute").prop('disabled', false)
        $("#flightModalTittle").text("Agregar Vuelo")
        $("#updateFlightB").prop("hidden",true)
        $("#addFlightB").prop("hidden", false)
    }else{
        GlobalFlight = f
        $("#flightModalTittle").text("Editar Vuelo")
        $("#flightRoute").val(f.route.id); $("#flightRoute").prop('disabled', true)
        $('#departureDate').val(toDate(f.departureDate))
        if(f.returnDate !== undefined)
            $('#returnDatee').val(toDate(f.returnDate))
        else
            $("#returnDatee").val("")
        $("#aSeats").val(f.availableSeats)
        $("#tPrice").val(f.price)
        $("#discount").val(f.discount * 100)
        $("#updateFlightB").prop("hidden", false)
        $("#addFlightB").prop("hidden", true)
    }
    $("#addFlightModal").modal("show")
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

function updateFlight(flight){
    let f = {
        "id":flight.id,
        "availableSeats": flight.availableSeats,
        "price": $("#tPrice").val(),
        "discount": $("#discount").val(),
        "departureDate": new Date($('#departureDate').val()),
        "returnDate": $("#returnDatee").val() !== ""? new Date($("#returnDatee").val()) : null,
        "route" : flight.route
    }
    let msg = {
        "type":"update",
        "content":JSON.stringify(f)
    }
    sendMsg(msg)
    $("#addFlightModal").modal("hide")
    $("#successModal").modal("show")
}

function addFlight(){
    let flight = {
        "availableSeats":$("#aSeats").val(),
        "price": $("#tPrice").val(),
        "discount": $("#discount").val(),
        "departureDate": new Date($('#departureDate').val()),
        "returnDate": $("#returnDatee").val() !== ""? new Date($("#returnDatee").val()) : null,
        "route" :{ "id": $("#flightRoute").val() }
    }
    console.log(flight)
    let msg = {
        "type":"add",
        "content":JSON.stringify(flight)
    }
    sendMsg(msg)
    $("#addFlightModal").modal("hide")
    $("#successModal").modal("show")
}
