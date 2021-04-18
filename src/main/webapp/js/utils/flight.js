import {toDate} from './dates.js';

function WSflight(){
    return new WebSocket("ws://localhost:8088/AirlineJK/flight")
}

function typeOfFlight(f){
    if(f.returnDate === undefined)
        return 'Ida'
    return 'Ida y Vuelta'
}

function datesOfFlight(f){
    let type = typeOfFlight(f)
    switch(type){
        case 'Ida':
            return toDate(f.departureDate)
        case 'Ida y Vuelta':
            return toDate(f.departureDate) + " -> " + toDate(f.returnDate)
    }
}

export {WSflight, typeOfFlight, datesOfFlight};


