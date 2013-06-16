    function renderPadButtons(disable){ //b1, b2, b3, b4, b5, b6, b7, b8, b9, bam, b0, bpm, bsubmit){
        var padbuttons = '', display=1, off=false;
        for(var i=1; i<=12; i++){
            off = '';
            display = i;
            if(i == 10){ display='AM'; }
            if(i == 11){ display='0'; }
            if(i == 12){ display='PM'; }

            for(var k=0; k<=12; k++){
                if(display == disable[k]){
                    off=' disable'; //Disable button 
                }
            }

            padbuttons += '<div id="numpad_'+display+'" class="padbutton'+off+'">'+display+'</div>';
        }
        $('#numpad').empty().unbind().append(padbuttons);
    }//

    function generateAlarmInputPad(){
        var input = $('#alarmdisplay').text();
        var length = input.length;

        //COLON ADDING GOODNESSl
        if (length == 1 && input > 1) { $('#alarmdisplay').append(':'); }
        //ONLY 1, 2, 0
        if(length == 2 && input > 12){ $('#alarmdisplay').text( input[0]+':'+input[1] ); }//Sneak in a colon
        //Only if length is greater than 2
        if(length == 3){
            if(input.indexOf(':') === -1){
                $('#alarmdisplay').text( input.substring(0,2)+':'+input[2] ); //Sneak in a colon
            }
        }

        //Bad Time Entering Prevention.
        if(length == 0) renderPadButtons(['AM','PM',0]);
        else if(length == 1) renderPadButtons(['AM','PM',6,7,8,9]);
        else if(length == 2 && input == 12 || input == 11 || input == 10) renderPadButtons(['AM','PM',6,7,8,9]);
        else renderPadButtons(['AM','PM']);

        //If the length of the string after the colon is two, render AM, PM buttons
        var col = input.indexOf(':');
        if(col != -1){
            var twodigits = input.substring(col+1, input.length+1);
            if(twodigits.length == 2){ renderPadButtons([1,2,3,4,5,6,7,8,8,9,0]); }
        }

        $('#submit').addClass('disable');
        if(input.indexOf('AM') !== -1 || input.indexOf('PM') !== -1 && input.length >= 4)
        { //Render Submit Buttons
            $('#submit').removeClass('disable');
            renderPadButtons([1,2,3,4,5,6,7,8,8,9,0, 'AM', 'PM']);
        }

        $('.padbutton').unbind().click(function(){
            var time = $('#alarmdisplay').text();
            time += $(this).text();
            $('#alarmdisplay').empty().append(time);
            generateAlarmInputPad();
        });

        $('#submit').unbind().click(function(){
            socket.emit('addAlarm', $('#alarmdisplay').text()); //Send alarm time to server
            $('#alarmdisplay').text(''); //Clear alarm thing on submit.
            closeLightbox();
        });

        $('#cancel').unbind().click(function(){
            closeLightbox();
        });

        $('#backspace').unbind().click(function(){
            var current = $('#alarmdisplay').text();
            var end = current.substring(current.length-1, current.length);
            if(end.indexOf(':') === 0 || end.indexOf('M') === 0){
                $('#alarmdisplay').text(current.substring(0,current.length-2));
            } else {
                $('#alarmdisplay').text(current.substring(0,current.length-1));
            }
            generateAlarmInputPad(); //Refresh buttons
        });

        $('.disable').unbind(); //Usbind Events on disabled buttons.
    }//

    $(document).ready(function() {
        generateAlarmInputPad(); //Generate Number Input pad thang
    });//