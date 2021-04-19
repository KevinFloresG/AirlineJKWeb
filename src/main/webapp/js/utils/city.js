
function WScity(){
    return new WebSocket("ws://localhost:8088/AirlineJK/city");
}

async function loadCitySelect(selectId){
    
    let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
    let response = await fetch("/AirlineJK/cities/all", requestBody);
    let cities = await response.json();
    listCities(cities,selectId);
                   
} 
  
function listCities(cities,selectId){
   cities.forEach( (c)=>{addCity(c, selectId);});	
}
  
function addCity(city,selectId){   
      
    $(selectId).append($('<option>', {
    value: city.id,
    text: city.name+", "+city.country.id
    }));                          
}

export {WScity,loadCitySelect};


