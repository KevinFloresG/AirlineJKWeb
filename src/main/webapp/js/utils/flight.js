function WSflight(){
    return new WebSocket("ws://localhost:8088/AirlineJK/flight")
}

function typeOfFlight(f){
    if(f.returnDate === undefined)
        return 'Ida'
    return 'Ida y Vuelta'
}

function toDate(date){
    let months = {
       ene: "01",feb: "02",mar: "03",
       abr: "04",may: "05",jun: "06",
       jul: "07",ago: "08",sep: "09",
       oct: "10",nov: "11",dic: "12"
    }
    //may. 23, 2021
    let [month, ...r] = date.split(". ")
    let [day, year] = r[0].split(", ")
    return year+"-"+months[month]+"-"+day
}

function datesOfFlight(f){
    let type = typeOfFlight(f)
    switch(type){
        case 'Ida':
            return f.departureDate
        case 'Ida y Vuelta':
            return f.departureDate + " -> " + f.returnDate
    }
}

export {WSflight, typeOfFlight, datesOfFlight, toDate}


