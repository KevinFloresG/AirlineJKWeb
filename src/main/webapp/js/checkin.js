$(load)

function load(){
    // conectar a ws
    loadSeats()
}

async function loadSeats(){
    //const response = await fetch("/AirlineJK/tickets/get/")
    // String.fromCharCode(97 + n)
    // s.charCodeAt(0) - 97
    // obtener todos los tickets del vuelo
    const response = await fetch("/AirlineJK/flights/get?id="+4)
    let flight = await response.json()
    let plane =  flight.route.airplaneId.airplaneType
    let container = $("#seatsContainer"), ol, li, sub_li, id;
    container.html("")
    for(let row = 0; row < plane.rowQ; row = row + 1){
        li = $(`<li class='row row--${row+1}' />`)
        ol = $("<ol class='seats' type='A' />")
        for(let col = 0; col < plane.columnQ; col = col + 1){
            sub_li = $("<li class='seat' />")
            id = String.fromCharCode(65 + col) + row
            sub_li.html(
                `<input type="checkbox" id="${id}" />`+
                `<label for="${id}">${id}</label>`
            )
            ol.append(sub_li)
        }
        li.append(ol)
        container.append(li)
    }
}


