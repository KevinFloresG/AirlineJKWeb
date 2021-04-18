import {WSschedule} from './utils/schedule.js';

let wsschedule, GlobalSchedule;

$(load);

function load(){
    wsschedule = WSschedule();
    wsschedule.onmessage = function(event){processMsgSchedule(event);};
    $("#deleteSchedule").on("click", ()=>deleteSchedule(GlobalSchedule));
    $("#addNewScheduleBtn").on("click", ()=>showScheduleInfoModal(null));
    $("#addScheduleB").on("click", ()=>addSchedule());
    $("#updateScheduleB").on("click", ()=>updateSchedule(GlobalSchedule));
}


function sendMsg(obj){
    wsschedule.send(JSON.stringify(obj));
}

function processMsgSchedule(evt){
    let request = JSON.parse(evt.data);
    switch(request.type){
        case 'all': 
            listAllSchedules(request.content); break;
        case 'update': 
            scheduleTr(request.content, 'upd'); break;
        case 'delete': 
            scheduleTr(request.content, 'del'); break;
        case 'add': 
            scheduleTr(request.content, 'add'); break;
    }
}

function listAllSchedules(list){
    $("#schedulesList").html("");
    list.forEach(f =>{
        scheduleTr(f, 'new');
    });
}

function scheduleTr(f, type){
    if(type === 'del'){
        let index = document.getElementById(`tr-${f.id}`).rowIndex;
        document.getElementById('schedulesList').deleteRow(index);
    }
    
    let trContent = 
        "<td scope='col' class='col-5'>"+f.weekday+"</td>"+
        "<td scope='col' class='col-3'>"+f.departureTime+"</td>"+
        "<td class='col-2'>"+
            "<i id='edit-"+f.id+"' style='cursor: pointer;' class='fas fa-edit fa-l-blue'>"+
        "</td>"+
        "<td class='col-2'>"+
            "<i id='del-"+f.id+"' style='cursor: pointer;' class='fas fa-ban fa-l-red'></i>"+
        "</td>";

    if(type === 'new' || type === 'add'){
        let tbody = $("#schedulesList");
        let tr = $('<tr id="tr-'+f.id+'" class="d-flex" />');
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showScheduleInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteScheduleModal(f));
        if(type === 'add')
            tbody.prepend(tr);
        else
            tbody.append(tr);
    }
    if(type === 'upd'){
        let tr = $("#tr-"+f.id);
        tr.html(trContent);
        tr.find("#edit-"+f.id).on("click",()=>showScheduleInfoModal(f));
        tr.find("#del-"+f.id).on("click",()=>showDeleteScheduleModal(f));
    }
}


function showScheduleInfoModal(f){
    if(f === null){
        $('#scheduleForm').get(0).reset();
        $("#scheduleModalTitle").text("Agregar Horario");
        $("#updateScheduleB").prop("hidden",true);
        $("#addScheduleB").prop("hidden", false);
        $("#sDays").prop("readonly", false);
    }else{
        GlobalSchedule = f;
        $("#scheduleModalTitle").text("Editar Horario");
        $("#sDays").prop("readonly", true);
        $('#sDays').val(f.weekday);
        $("#hour").val(f.departureTime);
        $("#updateScheduleB").prop("hidden", false);
        $("#addScheduleB").prop("hidden", true);
    }
    $("#addScheduleModal").modal("show");
}

function showDeleteScheduleModal(f){
    GlobalSchedule = f;
    $("#confirmDeleteModalBody").html(
        "¿ Está seguro de que desea eliminar el siguiente horario: "
        +f.weekday+" - "+ f.hour +" ?"
    );
    $("#confirmDeleteModal").modal("show");
}

function deleteSchedule(schedule){
    let msg = {
        type:"delete",
        content:JSON.stringify(schedule)
    };
    sendMsg(msg);
    $("#confirmDeleteModal").modal("hide");
    $("#successModal").modal("show");
}

function updateSchedule(schedule){
    let f = {
        id:schedule.id,
        weekday:schedule.weekday,
        departureTime: $("#hour").val()
    };
    let msg = {
        type:"update",
        content:JSON.stringify(f)
    };
    
    console.log(f);
    console.log(msg);
    sendMsg(msg);
    $("#addScheduleModal").modal("hide");
    $("#successModal").modal("show");
}

function addSchedule(){
    let schedule = {
        weekday:$("#sDays").val(),
        departureTime: $("#hour").val()
    };

    let msg = {
        type:"add",
        content:JSON.stringify(schedule)
    };
    sendMsg(msg);
    $("#addScheduleModal").modal("hide");
    $("#successModal").modal("show");
}
