import {reservationsByUser} from './utils/reservations.js'

$(load)

function load(){
    loadReservations()
}

async function loadReservations(){
    let username = sessionStorage.getItem('username')
    let reservations = await reservationsByUser(username)
    console.log(reservations)
}

