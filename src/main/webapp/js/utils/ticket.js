function WSticket(){
    return new WebSocket("ws://localhost:8088/AirlineJK/ticket")
}

export{WSticket};