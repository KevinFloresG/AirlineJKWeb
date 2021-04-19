import {toDate} from './utils/dates.js'

let flight, reservation;

$(load)

function load(){
    verifyCheckin()
    $("#searchReservation").on("click", searchReservation)
    $("#checkIn").on("click", goToCheckin)
}

function verifyCheckin(){
    if(sessionStorage.getItem('checked') !== null ){
        $("#successModal").modal("show")
        sessionStorage.removeItem('checked')
    }
}

function goToCheckin(){
    sessionStorage.setItem('flight', flight.id)
    sessionStorage.setItem('reservation', reservation.id)
    sessionStorage.setItem('seats', reservation.seatQuantity)
    location.href="CheckinVisual.html"
}

async function searchReservation(){
    let id = $("#reservationId").val()
    if(id !== ""){
        let response = await fetch("/AirlineJK/reservations/get?id="+id)
        let reser = await response.json()
        if(reser.id === undefined){
            window.alert("Reserva Inexistente")
        }else{
            if(reser.user.username !== sessionStorage.getItem('username'))
                window.alert("Reserva no Asociada")
            else{
                if(reser.seatQuantity === reser.checkedInQuantity)
                    window.alert("El Check-in ya fue Realizado")
                else
                    showReservation(reser)
            }
        }
    }else{
        window.alert("Digite el Codigo de Reserva")
    }
}

async function showReservation(r){
    reservation = r
    let resp = await fetch("/AirlineJK/flights/get?id="+r.flightId)
    flight = await resp.json()
    $("#rId").val(r.id)
    $("#flightInfo").val(r.flightInfo)
    $("#checkinDate").val(new Date())
    $("#duration").val(flight.route.durationhours +":"+ flight.route.durationminutes)
    $("#seatRQ").val(r.seatQuantity)
    $("#totalPrice").val(r.totalPrice + " " + r.typeOfPayment.description)
    $("#searchDiv").hide();
    $("#checkInDiv").prop('hidden', false);
}
