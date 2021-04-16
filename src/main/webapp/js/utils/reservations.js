async function reservationsByUser(username){
    let response = await fetch("/AirlineJK/reservations/get/user?username="+username)
    return await response.json()
}

export {reservationsByUser};