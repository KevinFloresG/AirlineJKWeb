import {WSticket} from './utils/ticket.js'

let wsticket, flight, reservation;
let selectedTickets = new Map(), remainingSeats;

$(load)

function load(){
    flight = {id:sessionStorage.getItem('flight')}
    remainingSeats = sessionStorage.getItem('seats')
    reservation = {
        id:sessionStorage.getItem('reservation'),
        checkedInQuantity:remainingSeats
    }
    sessionStorage.removeItem('flight')
    sessionStorage.removeItem('reservation')
    sessionStorage.removeItem('seats')
    $("#remainingSets").text("Asientos Restantes: "+remainingSeats)
    $("#endCheck").on("click", endCheckin)
    $("#cancelCheck").on("click", cancelCheckin)
    wsticket = WSticket()
    wsticket.onmessage = function(){processTicketMsg(event)}
}

function cancelCheckin(){
    location.href="CheckIn.html"
}

function endCheckin(){
    if(remainingSeats > 0){
        window.alert("Debes seleccionar los "+remainingSeats+" asientos restantes.")
    }else{
        let wsmsg = {
            type:"checkin",
            content: JSON.stringify(Array.from(selectedTickets.values()))
        }
        wsticket.send(JSON.stringify(wsmsg))
        let body = {
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(reservation)   
        }
        fetch("/AirlineJK/reservations/update", body)
        sessionStorage.setItem('checked',true)
        location.href="CheckIn.html"
    }
}

function processTicketMsg(evt){
    let request = JSON.parse(evt.data)
    switch(request.type){
        case 'all': 
            loadSeats(); break;
        case 'checkin': 
            ticketsUpd(request.content); break;
    }
}

function ticketsUpd(tkts){
    let id, li
    tkts.forEach(t => {
        id = String.fromCharCode(65 + t.columnN) + t.rowN
        li = $("#check-"+id)
        if(li !== undefined)
            li.prop("disabled", true)
    })
}

async function loadSeats(){
    let response = await fetch("/AirlineJK/flights/get?id="+flight.id)
    flight = await response.json()
    response = await fetch("/AirlineJK/tickets/get/flight?id="+flight.id)
    let ticketsList = await response.json()
    let plane =  flight.route.airplaneId.airplaneType
    let container = $("#seatsContainer"), ol, li, sub_li, id;
    container.html("")
    for(let row = 0; row < plane.rowQ; row = row + 1){
        li = $(`<li class='row row--${row+1}' />`)
        ol = $("<ol class='seats' type='A' />")
        li.append(ol)
        container.append(li)
        for(let col = 0; col < plane.columnQ; col = col + 1){
            sub_li = $("<li class='seat' />")
            id = String.fromCharCode(65 + col) + row
            sub_li.html(
                `<input type="checkbox" id="check-${id}" />`+
                `<label for="check-${id}">${id}</label>`
            )
            ol.append(sub_li)
            let aux = id
            sub_li.find("#check-"+id).on("click", ()=>addFunctionality(aux))
            
        }    
    }
    ticketsList.forEach(t => {
        id = String.fromCharCode(65 + t.columnN) + t.rowN
        li = $("#check-"+id)
        if(li !== undefined)
            li.prop("disabled", true)
    })
}

function addFunctionality(id){
    let seat = $("#check-"+id)
    if(!seat.prop('checked')){
        selectedTickets.delete(id)
        remainingSeats += 1
        $("#remainingSets").text("Asientos Restantes: "+remainingSeats)
        console.log(selectedTickets)
    }else{
        if(remainingSeats > 0){
            let col = id.slice(0,1).charCodeAt(0) - 65
            let row = parseInt(id.slice(1))
            let tkt = {
                columnN:col,
                rowN:row,
                reservation: reservation,
                flight: {id:flight.id}
            }
            selectedTickets.set(id, tkt)
            console.log(selectedTickets)
            remainingSeats -= 1
            $("#remainingSets").text("Asientos Restantes: "+remainingSeats)
        }else{
            seat.prop('checked', false)
        }
    }
}


