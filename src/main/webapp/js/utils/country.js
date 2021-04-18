
function WScountry(){
    return new WebSocket("ws://localhost:8088/AirlineJK/country");
}

async function loadCountrySelect(selectId){
    
    let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
    let response = await fetch("/AirlineJK/countries/all", requestBody);
    let countries = await response.json();
    listCountries(countries,selectId);
                   
} 
  
function listCountries(countries,selectId){
   countries.forEach( (c)=>{addCountry(c, selectId);});	
}
  
function addCountry(country,selectId){   
      
    $(selectId).append($('<option>', {
    value: country.id,
    text: country.name
    }));                          
}

export {WScountry,loadCountrySelect};


