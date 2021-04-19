
function WSairplaneType(){
    return new WebSocket("ws://localhost:8088/AirlineJK/airplaneType");
}

async function loadPlaneTypeSelect(selectId){
    
    let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
    let response = await fetch("/AirlineJK/planetypes/all", requestBody);
    let planetypes = await response.json();
    listPlaneTypes(planetypes,selectId);
                   
} 
  
function listPlaneTypes(planetypes,selectId){
   planetypes.forEach( (c)=>{addPlaneType(c, selectId);});	
}
  
function addPlaneType(airplaneType,selectId){   
      
    $(selectId).append($('<option>', {
    value: airplaneType.id,
    text: airplaneType.brand+" "+airplaneType.model+" - "+airplaneType.passangersQ+" A."
    }));                          
}

export {WSairplaneType,loadPlaneTypeSelect};


