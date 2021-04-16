import {reservationsByUser, checkinStatus} from './utils/reservations.js'

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
                +r.totalPrice+" / "+r.typeOfPayment.code+
            "</td>"+
            "<td class='col-2'>"+checkinStatus(r)+"</td>"+
            "<td class='col-2'>"+
            "<i style='cursor: pointer;' class='fas fa-info-circle fa-l-blue'"+ 
            "onclick='showReservationModal("+r.id+")'></i>"+
            "</td>"
        )
        tbody.append(auxTr)
    })
}


//reservationModal

