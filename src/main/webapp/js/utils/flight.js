function WSflight(){
    return new WebSocket("ws://localhost:8088/AirlineJK/flight")
}

function typeOfFlight(f){
    if(f.departureDate !== undefined){
        if(f.returnDate === undefined)
            return 'Ida'
        return 'Ida y Vuelta'
    }
    return 'Vuelta'
}

function datesOfFlight(f){
    let type = typeOfFlight(f)
    switch(type){
        case 'Ida':
            return f.departureDate
        case 'Ida y Vuelta':
            return f.departureDate + " -> " + f.returnDate
        case 'Vuelta':
            return f.returnDate
    }
}

export {WSflight, typeOfFlight,datesOfFlight}


