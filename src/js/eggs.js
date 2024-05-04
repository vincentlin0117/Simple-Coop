
// DataTable object of eggs
var eggTable = new DataTable('#tblEgg', {pageLength:5});

// Initialize chart
var eggChart = new Chart($('#canvEggs'), {});

// populate table of eggs
function getEggTable() {
    $.getJSON('https://simplecoop.swollenhippo.com/eggs.php', {SessionID:sessionStorage.getItem('SessionID'), days:100}, function(result) {
        result.forEach(function(eggRecord) {
            eggTable.row.add([eggRecord.LogDateTime.slice(0, 10), eggRecord.Harvested, '<button class="btn btn-danger btnDeleteEgg bi-trash" type="button" data-search="' + eggRecord.LogID + '"></button>']).draw();
        });
        drawEggChart(result);
    })
}

// user enters number of eggs harvested
$('#btnHarvest').on('click', function() {
    let intEggHarvest = $('#numEggHarvest').val();
    let strDateHarvest = document.querySelector('input[id="txtDateHarvest"]').value;
    getSession(function(session){
        if(!validateSession(session)){
            $('#liLogout').click();
        }else{
            if (intEggHarvest && strDateHarvest) {
                let strISODate = new Date(strDateHarvest).toISOString();
                $.post('https://simplecoop.swollenhippo.com/eggs.php', {SessionID:sessionStorage.getItem('SessionID'), observationDateTime:strISODate, eggs:intEggHarvest}, function(result) {
                    result = JSON.parse(result);
                    eggTable.clear().draw();
                    getEggTable();
                });
            }
        }
    })
})

// user clicks delete button in row and it gets rid of egg count for that day
$(document).on('click', '.btnDeleteEgg', function() {
    let strLogID = $(this).attr('data-search');
    getSession(function(session){
        if(!validateSession(session)){
            $('#liLogout').click();
        }else{
            $.ajax({
                url:'https://simplecoop.swollenhippo.com/eggs.php',
                data:{SessionID:sessionStorage.getItem('SessionID'), logID:strLogID},
                type:'DELETE',
                success:function() {
                    eggTable.clear().draw();
                    getEggTable();
                }
            })
        }
    })

})

// auto loads egg table if there is already a sesssion id
if (sessionStorage.getItem('SessionID')) {
    getEggTable();
}

// Renders the chart
const drawEggChart = (arrData)=>{

    arrData.sort((a,b)=>{
        return new Date(a.LogDateTime) - new Date(b.LogDateTime);
    })
    
    const dates = arrData.map(obj => new Date(obj.LogDateTime).toLocaleString('default', { month: 'long', day: 'numeric' }));
    const harvests = arrData.map(obj => obj.Harvested);
    eggChart.destroy();
    eggChart = new Chart($('#canvEggs'), {
        data: {
            datasets: [
                {
                    type: 'line',
                    label: 'Harvests',
                    data: harvests
                }
            ],
            labels: dates
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });
}

