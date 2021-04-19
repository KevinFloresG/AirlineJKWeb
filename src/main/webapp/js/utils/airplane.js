
function WSairplane(){
    return new WebSocket("ws://localhost:8088/AirlineJK/airplane");
}

async function loadAirplaneSelect(selectId){
    
    let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
    let response = await fetch("/AirlineJK/airplanes/all", requestBody);
    let airplanes = await response.json();
    listAirplanes(airplanes,selectId);
                   
} 
  
function listAirplanes(airplanes,selectId){
   airplanes.forEach( (c)=>{addAirplane(c, selectId);});	
}
  
function addAirplane(airplane,selectId){   
      
    $(selectId).append($('<option>', {
    value: airplane.id,
    text: airplane.id+"-"+airplane.airplaneType.brand+" "+airplane.airplaneType.passengersQ+" A."
    }));                          
}

export {WSairplane,loadAirplaneSelect};


