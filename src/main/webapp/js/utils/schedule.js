
function WSschedule(){
    return new WebSocket("ws://localhost:8088/AirlineJK/schedule");
}

export {WSschedule};

