import {loginInit} from './utils/login.js';

$(load);

function load(){
    loginInit();
    offers()
}

function offerInfo(o){
    let ori = o.route.origin 
    let des = o.route.destination
    let unir = ori.name + ", " + ori.country.id + " - " + 
            des.name + ", " + des.country.id;
    let as = "<div> Lugares Disponiibles: " + o.availableSeats + "</div>"
    let dis = "<div> Descuento: " + o.discount * 100 + "%</div>"
    unir = "<div> Ruta: " + unir + "</div>"
    return unir + as + dis;
}

async function offers(){
    let response = await fetch("/AirlineJK/flights/all/discount")
    let list = await response.json()
    let body = $("#toastBody"), ul = $('<ul class="list-group" />');
    let aux;
    if(list.length > 0){
        list.forEach(offer =>{
            aux = $('<li class="list-group-item" />')
            aux.html(offerInfo(offer))
            ul.append(aux)
        })
        body.append(ul)
        $('.toast').toast('show');
    }

}

