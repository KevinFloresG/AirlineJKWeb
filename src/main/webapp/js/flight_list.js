import {WSflight, typeOfFlight, datesOfFlight} from './utils/flight.js'

$(load)

function load(){
    const wsflight = WSflight()
    wsflight.onmessage = function(event){processMsg(event)}
}

function processMsg(evt){
    let request = JSON.parse(evt.data)
    switch(request.type){
        case 'all': 
            listAllFlights(request.content); break;
        case 'update': 
            flightTr(request.content, 'upd'); break;
        case 'delete': 
            flghtTr(request.content, 'del'); break;
    }
}

function listAllFlights(list){
    $("#flightsList").html("")
    list.forEach(f =>{
        flightTr(f, 'new')
    })
}
/*
 * 
 * <tr class="tableTitle d-flex">
    <td scope="col" class="col-2">Id</td>
    <td scope="col" class="col-2">Tipo</td>
    <td scope="col" class="col-2">Origen</td>
    <td scope="col" class="col-2">Destino</td>
    <td scope="col" class="col-2">Fechas</td>
    <td scope="col" class="col-2"></td>
</tr>
 */
function flightTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex
        document.getElementById('flightsList').deleteRow(index)
    }
    let trContent = 
        "<td scope='col' class='col-2'>"+f.id+"</td>"+
        "<td scope='col' class='col-2'>"+typeOfFlight(f)+"</td>"+
        "<td scope='col' class='col-2'>"+f.route.origin.name+"</td>"+
        "<td scope='col' class='col-2'>"+f.route.destination.name+"</td>"+
        "<td scope='col' class='col-2'>"+datesOfFlight(f)+"</td>"+
        "<td class='col-1'>"+
            "<i style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-1'>"+
            "<i style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";
    if(type === 'new'){
        let tbody = $("#flightsList")
        let tr = $('<tr class="d-flex" />')
        tr.html(trContent)
        tbody.append(tr)
    }
}
