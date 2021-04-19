
function WSschedule(){
    return new WebSocket("ws://localhost:8088/AirlineJK/schedule");
}

async function loadScheduleSelect(selectId){
    
    let requestBody = {
        method:"GET",
        headers:{
            'Content-Type':'application/json'
        }
    };
    let response = await fetch("/AirlineJK/schedules/all", requestBody);
    let schedules = await response.json();
    listSchedules(schedules,selectId);
                   
} 
  
function listSchedules(schedules,selectId){
   schedules.forEach( (c)=>{addSchedule(c, selectId);});	
}
  
function addSchedule(schedule,selectId){   
      
    $(selectId).append($('<option>', {
    value: schedule.id,
    text: schedule.weekday+" "+schedule.departureTime
    }));                          
}


export {WSschedule,loadScheduleSelect};


