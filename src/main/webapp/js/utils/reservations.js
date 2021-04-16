async function reservationsByUser(username){
    let response = await fetch("/AirlineJK/reservations/get/user?username="+username)
    return await response.json()
}

function checkinStatus(r){
    return r.seatQuantity !== r.checkedInQuantity?"Pendiente":"Realizado"
}

export {reservationsByUser, checkinStatus};