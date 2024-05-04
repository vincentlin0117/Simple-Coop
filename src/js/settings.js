// Erik Bowling
// Smart Coop

// GLOBAL VARIABLES
const strSettingsUrl = 'https://simplecoop.swollenhippo.com/settings.php';
var intLastTimeChickensFed = null;

/////////////////////////////////////////////
// FEEDING and TIMER
/////////////////////////////////////////////

$.getJSON(strSettingsUrl, {SessionID: sessionStorage.getItem('SessionID'), setting: 'TimeFed'}, (result)=>{
    intLastTimeChickensFed = Number(result.Value);
    const intTimeLeft = intLastTimeChickensFed + 600000 - Date.now();

    // If it has been less than 10 minutes, start the timer.

    if(intTimeLeft > 0){
        $('#btnFeedChickens').hide();
        $('#feedOrNoFeed').show();
        createTimer(intTimeLeft);
    }else{
        $('#btnFeedChickens').show();
        $('#feedOrNoFeed').hide();
    }
});

// Used to create the setInterval to count down when you can feed chickens again.
const createTimer = (numTimeinMiliSec)=>{

    const timeLeftObj = {
        sec: Math.floor((numTimeinMiliSec % 60000) / 1000),
        min: Math.floor(numTimeinMiliSec / 60000)
    }

    // Timer with clock like behavior
    const timer = setInterval(()=>{
        timeLeftObj.sec--;

        if(timeLeftObj.sec < 0){
            timeLeftObj.sec = 59;
            timeLeftObj.min--;
        }

        if(timeLeftObj.min < 0){
            $('#btnFeedChickens').show();
            $('#feedOrNoFeed').hide();
            clearInterval(timer);
        }else{
            $('#paraFeedTime').html(`${timeLeftObj.min < 10 ? '0'+timeLeftObj.min : timeLeftObj.min }:${timeLeftObj.sec < 10 ? '0'+timeLeftObj.sec : timeLeftObj.sec}`)
        }
    }, 1000);

    return timer;
}

$('#btnFeedChickens').on('click', function(){
    getSession(function(session){
        if(!validateSession(session)){
            $('#liLogout').click();
        }else{
            $('#btnFeedChickens').slideToggle(function(){
                $('#feedOrNoFeed').slideToggle();
            })
        
            $('#paraFeedTime').html('10:00');
        
            createTimer(600000);
            
            const objPutParams = {
                SessionID: sessionStorage.getItem('SessionID'), 
                setting: 'TimeFed', 
                value: Date.now()
            }
        
            $.ajax({
                url: strSettingsUrl,
                type: 'PUT',
                data: objPutParams,
                success: function(result){
                    console.log(result)
                }
            });
        }
    })
    
});

/////////////////////////////////////////////
// FAN SPEED
/////////////////////////////////////////////

$(document).on('input', '#rangeFanSpeed', function() {
    $('#spanFanSpeed').html( `${$(this).val()} RPM` );
});

/////////////////////////////////////////////
// LIGHTS ON OR OFF
/////////////////////////////////////////////

// Turn the lights back to the way you last left them
$.getJSON(strSettingsUrl, {SessionID: sessionStorage.getItem('SessionID'), setting: 'LightsOnOff'}, (result)=>{
    const strLightStatus = result.Value;

    if(strLightStatus == "Off"){
        $('#btnToggleLightsOff').attr('checked', true)
    }else{
        $('#btnToggleLightsOn').attr('checked', true)
    }

    turnOffLights(strLightStatus);
});

// Click of the radio on or off.
$('input[name="btnLightRadio"]').change(function() {
    const activeRadioValue = $(this).val();
    getSession(function(session){
        if(!validateSession(session)){
            $('#liLogout').click();
        }else{
            const objPutParams = {
                SessionID: sessionStorage.getItem('SessionID'), 
                setting: 'LightsOnOff', 
                value: activeRadioValue
            }
 
            $.ajax({
                url: strSettingsUrl,
                type: 'PUT',
                data: objPutParams,
                success: function(result){
                    console.log(result)
                }
            });
            
            turnOffLights(activeRadioValue);
        }
    })
});

const turnOffLights = (activeRadioValue)=>{
    if(activeRadioValue == "Off"){
        $(".bg-yellow").each(function(){
            $(this).removeClass('bg-yellow');
            $(this).addClass('bg-dark-yellow');
        });

        $(".bg-red").each(function(){
            $(this).removeClass('bg-red');
            $(this).addClass('bg-dark-red');
        });

        $(".bg-white").each(function(){
            $(this).removeClass('bg-white');
            $(this).addClass('bg-dark-white');
        });

        $(".border-white").each(function(){
            $(this).removeClass('border-white');
            $(this).addClass('border-dark-white');
        });

        $(".outline-red").each(function(){
            $(this).removeClass('outline-red');
            $(this).addClass('outline-dark-red');
        });

        $(".outline-yellow").each(function(){
            $(this).removeClass('outline-yellow');
            $(this).addClass('outline-dark-rellow');
        });

        $("#mainContainerDiv").removeClass('daytime-bg-image');
        $("#mainContainerDiv").addClass('nighttime-bg-image');
    }else{
        $(".bg-dark-yellow").each(function(){
            $(this).removeClass('bg-dark-yellow');
            $(this).addClass('bg-yellow');
        });
    
        $(".bg-dark-red").each(function(){
            $(this).removeClass('bg-dark-red');
            $(this).addClass('bg-red');
        });
    
        $(".bg-dark-white").each(function(){
            $(this).removeClass('bg-dark-white');
            $(this).addClass('bg-white');
        });
    
        $(".border-dark-white").each(function(){
            $(this).removeClass('border-dark-white');
            $(this).addClass('border-white');
        });
    
        $(".outine-dark-red").each(function(){
            $(this).removeClass('outline-dark-red');
            $(this).addClass('outline-red');
        });
    
        $(".outine-dark-yellow").each(function(){
            $(this).removeClass('outline-dark-yellow');
            $(this).addClass('outline-yellow');
        });

        $("#mainContainerDiv").removeClass('nighttime-bg-image');
        $("#mainContainerDiv").addClass('daytime-bg-image');
    }
}