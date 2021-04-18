

$(load);

function load(){
    getTop5Routes();
}


async function getTop5Routes(){
    let response = await fetch("/AirlineJK/routes/getTop");
    let result = await response.json(); 
    if(response.ok)
        listTopRoutes(result);  
    else
        window.alert("Ha ocurrido un error en el servidor, intente de nuevo más tarde.");
}

function listTopRoutes(routes){
    var routesL=$("#topRoutesList");
    routesL.html("");
    if (routes.length === 0){
        var tr =$("<tr />");
        tr.html("<td class='font-italic font-weight-bold'>NO HAY REGISTROS</td>");
        routesL.append(tr);
    }else
        routes.forEach( (r)=>{routeRow(routesL,r);});
};

function routeRow(routesL,route){
    
    // THE ROUTE COMES WITH ITS TOTAL RESERVATIONS IN THE DURATION MINUTES ATTRIBUTE
    var tr =$("<tr class='d-flex' />");
    tr.html("<td class='col-2'>"+route.id+"</td>"+
        "<td class='col-3'>"+route.origin.name+", "+route.origin.country.id+"</td>"+
        "<td class='col-3'>"+route.destination.name+", "+route.destination.country.id+"</td>"+
        "<td class='col-2'>"+route.schedule.weekday+" "+route.schedule.departureTime+"</td>"+
        "<td class='col-2'>"+route.durationminutes+"</td>");

    routesL.append(tr);
}
