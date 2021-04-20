
$(load)

function load(){
    loadFlights();
}

async function loadFlights(){
    let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
    let response = await fetch("/AirlineJK/flights/all", requestBody);
    let flights = await response.json();
    listAllFlights(flights); 
}



function listAllFlights(list){
    $("#flightsList").html("")
    if (list.length === 0){
        var tr =$("<tr />");
        tr.html("<td class='font-italic font-weight-bold'>NO HAY REGISTROS</td>");
        $("#flightsList").append(tr);
    }
    list.forEach(f =>{
        flightTr(f)
    })
}

function flightTr(f){

    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-3'>"+f.route.origin.name+"</td>"+
        "<td scope='col' class='col-3'>"+f.route.destination.name+"</td>"+
        "<td scope='col' class='col-2'>"+f.departureDate+"</td>"+
        "<td class='col-2'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-info-circle fa-l-blue'>"+
        "</td>";
        let tbody = $("#flightsList")
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />')
        tr.html(trContent)
        tr.find("#edit-"+f.id).on("click",()=>showFlighInfoModal(f))

        tbody.append(tr)
    

    
}

function showFlighInfoModal(f){

        

        $("#id").val(f.id); 
        $('#flightInfo').val(f.route.id+" "+f.route.schedule.weekday+" "+f.route.schedule.departureTime)
        $("#aSeats").val(f.availableSeats)
        $("#departureDate").val(f.departureDate) 
        $("#fInfoModal").modal("show")
        loadModalData(f);
}

async function loadModalData(f){
        let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
        let response = await fetch("/AirlineJK/users/flight?id="+f.id,requestBody);
        let users = await response.json();
        listAllUsers(users);
}


function listAllUsers(list){
    $("#usersList").html("")
    if (list.length === 0){
        var tr =$("<tr />");
        tr.html("<td class='font-italic font-weight-bold'>NO HAY REGISTROS</td>");
        $("#usersList").append(tr);
    }
    list.forEach(f =>{
        userTr(f)
    })
}

function userTr(f){

    let trContent = 
        "<td scope='col' class='col-3'>"+f.username+"</td>"+
        "<td scope='col' class='col-3'>"+f.name+"</td>"+
        "<td scope='col' class='col-3'>"+f.lastname+"</td>"+
        "<td scope='col' class='col-3'>"+f.email+"</td>";
        let tbody = $("#usersList")
        let tr = $('<tr id="tr-'+f.username+'" class="d-flex" />')
        tr.html(trContent)

        tbody.append(tr)
    


}