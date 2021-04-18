import {reservationsByUser, checkinStatus, getReservation} from './utils/reservation.js';

$(load)

function load(){
    loadReservations()
}

async function loadReservations(){
    let username = sessionStorage.getItem('username')
    let reservations = await reservationsByUser(username)
    showReservations(reservations)
}

function showReservations(reservations){
    let tbody = $("#userReservationList"), auxTr
    tbody.html("")
    reservations.forEach(r => {
        console.log(r)
        auxTr = $("<tr class='d-flex' />")
        auxTr.html(
            "<td class='col-4'>"+r.flightInfo+"</td>"+									
            "<td class='col-1'>"+r.seatQuantity+"</td>"+
            "<td class='col-3'>"
                +r.totalPrice+" "+r.typeOfPayment.code+
            "</td>"+
            "<td class='col-2'>"+checkinStatus(r)+"</td>"+
            "<td class='col-2'>"+
            "<i style='cursor: pointer;' class='fas fa-info-circle fa-l-blue'></i>"+
            "</td>"
        )
        auxTr.find("i").on("click", ()=>showReservationModal(r.id))
        tbody.append(auxTr)
    })
}

async function showReservationModal(r_id){
    let r = await getReservation(r_id)
    $("#id").val(r.id)
    $("#flightInfo").val(r.flightInfo)
    $("#airplane").val(r.airplane)
    $("#seats").val(r.seatQuantity)
    $("#price").val(r.totalPrice)
    $("#payType").val(r.typeOfPayment.description)
    $("#state").val(checkinStatus(r))
    $("#checkedInQ").val(r.checkedInQuantity)
    $("#reservationModal").modal("show")
} 
