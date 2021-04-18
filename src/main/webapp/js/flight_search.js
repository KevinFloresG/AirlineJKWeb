import {WSflight, typeOfFlight, datesOfFlight} from './utils/flight.js';
import {toDate} from './utils/dates.js';

let wsflight, GlobalFlight;

$(load)

function load(){
    wsflight = WSflight()
    wsflight.onmessage = function(event){processMsgFlight(event)}
    $("#reservationMB").on("click", ()=>showReservationModal())
    $("#seats").on("change", ()=>calculateTotalPrice())
    $("#makeReservation").on("click", ()=>doReservation())
}

async function doReservation(){
    let reservation = {
        flightInfo: $("#flightInfo").val(),
        flightId: GlobalFlight.id,
        airplane: $("#airplaneId").val(),
        user: {username:sessionStorage.getItem('username')},
        seatQuantity: $("#seats").val(),
        checkedInQuantity: 0,
        totalPrice: $("#price").val(),
        typeOfPayment: {code:$("#payTypes").val()}
    }
    console.log(JSON.stringify(reservation))
    let requestBody = {
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(reservation)
    }
    await fetch("/AirlineJK/reservations/add", requestBody)
    finalReservation(reservation.seatQuantity)
}

function sendMsg(obj){
    wsflight.send(JSON.stringify(obj))
}

function calculateTotalPrice(){
    $("#price").val(GlobalFlight.price * $("#seats").val());
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

function finalReservation(seats){
    $("#mReservationModal").modal("hide")
    $("#flightInfoModal").modal("hide")
    $("#confirmModal").modal("show")
    GlobalFlight.availableSeats = GlobalFlight.availableSeats - seats
    let request = {
        type:"update",
        content:JSON.stringify(GlobalFlight)
    }
    console.log(GlobalFlight)
    sendMsg(request)
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
    let origin = f.route.origin, destiny = f.route.destination;
    let trContent = 
        "<td scope='col' class='col-2'>"+typeOfFlight(f)+"</td>"+
        "<td scope='col' class='col-2'>"+origin.name+", "+origin.country.name+"</td>"+
        "<td scope='col' class='col-2'>"+destiny.name+", "+destiny.country.name+"</td>"+
        "<td scope='col' class='col-3'>"+datesOfFlight(f)+"</td>"+
        "<td class='col-1'>"+f.availableSeats+"</td>"+
        "<td class='col-2'>"+
            "<i id='info-"+f.id+"' style='cursor: pointer;' class='fas fa-info-circle fa-l-blue'>"+
        "</td>";
    if(type === 'new' || type === 'add'){
        let tbody = $("#flightsList")
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />')
        tr.html(trContent)
        tr.find("#info-"+f.id).on("click",()=>showFlighInfoModal(f))
        if(type === 'add')
            tbody.prepend(tr)
        else
            tbody.append(tr)
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id)
        tr.html(trContent)
        tr.find("#info-"+f.id).on("click",()=>showFlighInfoModal(f))
    }
}

function showFlighInfoModal(f){
    GlobalFlight = f
    $("#flightID").val(f.id)
    $("#flightRoute").val(f.route.id)
    $('#departureDate').val(toDate(f.departureDate))
    if(f.returnDate !== undefined)
        $('#returnDate').val(toDate(f.returnDate))
    else
        $("#returnDate").val("No Aplica")
    $("#aSeats").val(f.availableSeats)
    $("#tPrice").val(f.price)
    $("#discount").val(f.discount * 100)      
    $("#flightInfoModal").modal("show")
}

function showReservationModal(){
    let ori = GlobalFlight.route.origin, des = GlobalFlight.route.destination
    let fly = `${ori.name}, ${ori.country.name} - ${des.name}, `+
              `${des.country.name} ${toDate(GlobalFlight.departureDate)}`;
    $("#flightInfo").val(fly)
    $("#airplaneId").val(GlobalFlight.route.airplaneId.id)
    $("#userID").val(sessionStorage.getItem('user'))
    $("#seats").val(1)
    $("#seats").attr('max',GlobalFlight.availableSeats)
    $("#price").val(GlobalFlight.price)
    $("#payTypes").val("BTC")
    $("#mReservationModal").modal("show")
}